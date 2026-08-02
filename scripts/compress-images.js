import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const imagesDir = path.resolve(projectRoot, 'assets/performer_images');

const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 80;

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG'];

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = fs.statSync(filePath).size;

  const image = sharp(filePath);
  const meta = await image.metadata();

  let pipeline;
  if (ext === '.png') {
    pipeline = image.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === '.webp') {
    pipeline = image.webp({ quality: WEBP_QUALITY });
  } else {
    pipeline = image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const compressed = await pipeline.toBuffer();
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
  const files = fs.readdirSync(imagesDir).filter(f => SUPPORTED.includes(path.extname(f)));

  console.log(`🖼️  Compressing ${files.length} images in assets/performer_images/...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const { before, after } = await compressImage(filePath);
    totalBefore += before;
    totalAfter += after;
  }

  const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
  console.log(`\n✅ Done!`);
  console.log(`   Before: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   After:  ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB (-${totalSaved}%)`);
}

run().catch(console.error);
