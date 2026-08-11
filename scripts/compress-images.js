import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const imageDirs = [
  path.resolve(projectRoot, 'assets/performer_images'),
  path.resolve(projectRoot, 'assets/workshop_images'),
];

const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 80;
const MAX_DIMENSION = 800;

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG'];

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = fs.statSync(filePath).size;

  const image = sharp(filePath);
  const meta = await image.metadata();

  const needsResize = (meta.width > MAX_DIMENSION) || (meta.height > MAX_DIMENSION);
  const pipeline = needsResize
    ? image.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    : image;

  let output;
  if (ext === '.png') {
    output = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === '.webp') {
    output = pipeline.webp({ quality: WEBP_QUALITY });
  } else {
    output = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const compressed = await output.toBuffer();
  const after = compressed.length;

  // Only write if it actually got smaller
  if (after < before) {
    fs.writeFileSync(filePath, compressed);
    const saved = ((before - after) / before * 100).toFixed(1);
    console.log(`  ✓ ${path.basename(filePath)}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${saved}%)`);
    return { before, after };
  } else {
    console.log(`  ~ ${path.basename(filePath)}: already optimized, skipped`);
    return { before, after: before };
  }
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const imagesDir of imageDirs) {
    if (!fs.existsSync(imagesDir)) continue;
    const files = fs.readdirSync(imagesDir).filter(f => SUPPORTED.includes(path.extname(f)));
    console.log(`🖼️  Compressing ${files.length} images in ${path.relative(projectRoot, imagesDir)}/...\n`);

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const { before, after } = await compressImage(filePath);
      totalBefore += before;
      totalAfter += after;
    }
    console.log('');
  }

  const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
  console.log(`✅ Done!`);
  console.log(`   Before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   After:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB (-${totalSaved}%)`);
}

run().catch(console.error);
