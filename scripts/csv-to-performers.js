import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const csvPath = resolve(projectRoot, 'data/performers.csv');
const jsonPath = resolve(projectRoot, 'data/performers.json');

const csv = readFileSync(csvPath, 'utf-8');
const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true });

const performers = records.map(row => {
  const bioPath = resolve(projectRoot, `data/performer_bios/${row.bio}`);
  const imagePath = `assets/performer_images/${row.performer_image}`;

  let bio = null;
  if (bioPath && existsSync(bioPath)) {
    bio = readFileSync(bioPath, 'utf-8');
  }

  return {
    slug: row.slug,
    name: row.name,
    bio,
    performer_image: imagePath,
  };
});

writeFileSync(jsonPath, JSON.stringify(performers, null, 2));
console.log(`✓ Wrote ${performers.length} performer(s) to data/performers.json`);
