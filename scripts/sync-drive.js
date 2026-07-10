import dotenv from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Load .env.local (or .env as fallback)
dotenv.config({ path: path.resolve(projectRoot, '.env.local') });
dotenv.config({ path: path.resolve(projectRoot, '.env') });

// Parse service account from env variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`,
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

async function downloadSheet(sheetId, fileName) {
  try {
    console.log(`⬇️  Downloading ${fileName}...`);
    const response = await drive.files.export({
      fileId: sheetId,
      mimeType: 'text/csv',
    });
    
    const filePath = path.resolve(projectRoot, 'data', fileName);
    fs.writeFileSync(filePath, response.data);
    console.log(`✓ Saved to ${filePath}`);
  } catch (error) {
    console.error(`✗ Error downloading ${fileName}:`, error.message);
  }
}

async function downloadFolder(folderId, localDir) {
  try {
    console.log(`⬇️  Syncing folder ${folderId} to ${localDir}...`);

    // Ensure directory exists
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, webContentLink, modifiedTime)',
      pageSize: 1000,
    });

    const files = response.data.files || [];
    console.log(`Found ${files.length} files`);

    // Get max modified time in local directory
    let maxLocalModified = 0;
    if (fs.existsSync(localDir)) {
      const localFiles = fs.readdirSync(localDir);
      for (const file of localFiles) {
        const filePath = path.resolve(localDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() > maxLocalModified) {
          maxLocalModified = stats.mtime.getTime();
        }
      }
    }

    let downloaded = 0;
    for (const file of files) {
      const remoteModified = new Date(file.modifiedTime).getTime();
      // Only download if remote is newer than all local files
      if (remoteModified > maxLocalModified) {
        await downloadFile(file.id, file.name, localDir);
        downloaded++;
      }
    }

    if (downloaded === 0) {
      console.log('  (no updates needed)');
    }
  } catch (error) {
    console.error(`✗ Error syncing folder:`, error.message);
  }
}

async function downloadFile(fileId, fileName, localDir) {
  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    const filePath = path.resolve(localDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          console.log(`  ✓ ${fileName}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`  ✗ ${fileName}: ${err.message}`);
          reject(err);
        })
        .pipe(writeStream);
    });
  } catch (error) {
    console.error(`  ✗ Error downloading ${fileName}:`, error.message);
  }
}

async function sync() {
  console.log('🔄 Syncing Google Drive data...\n');

  // Download sheets
  if (process.env.DRIVE_PERFORMERS_SHEET) {
    await downloadSheet(process.env.DRIVE_PERFORMERS_SHEET, 'performers.csv');
    console.log('');
  } else {
    console.log('⚠️  DRIVE_PERFORMERS_SHEET not configured\n');
  }

  if (process.env.DRIVE_SCHEDULE_SHEET) {
    await downloadSheet(process.env.DRIVE_SCHEDULE_SHEET, 'schedule.csv');
    console.log('');
  } else {
    console.log('⚠️  DRIVE_SCHEDULE_SHEET not configured\n');
  }

  // Sync folders
  if (process.env.DRIVE_PERFORMERS_BIOS_FOLDER) {
    await downloadFolder(
      process.env.DRIVE_PERFORMERS_BIOS_FOLDER,
      path.resolve(projectRoot, 'data/performer_bios')
    );
    console.log('');
  } else {
    console.log('⚠️  DRIVE_PERFORMERS_BIOS_FOLDER not configured\n');
  }

  if (process.env.DRIVE_PERFORMER_IMAGES_FOLDER) {
    await downloadFolder(
      process.env.DRIVE_PERFORMER_IMAGES_FOLDER,
      path.resolve(projectRoot, 'assets/performer_images')
    );
    console.log('');
  } else {
    console.log('⚠️  DRIVE_PERFORMER_IMAGES_FOLDER not configured\n');
  }

  console.log('✅ Sync complete!');
}

sync().catch(console.error);
