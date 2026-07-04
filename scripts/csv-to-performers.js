import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const csvPath = resolve(projectRoot, 'data/performers.csv');
const jsonPath = resolve(projectRoot, 'data/performers.json');

// Convert markdown to HTML
function markdownToHtml(markdown) {
  if (!markdown) return '';
  return markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italics
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Paragraphs
    .split('\n\n')
    .map(para => {
      if (para.match(/^<h[1-3]>/)) return para;
      if (para.trim().length === 0) return '';
      return `<p>${para.trim()}</p>`;
    })
    .filter(p => p)
    .join('\n');
}

const csv = readFileSync(csvPath, 'utf-8');
const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true });

const performers = records.map(row => {
  const bioPath = resolve(projectRoot, `data/performer_bios/${row.bio}`);
  const imagePath = `assets/performer_images/${row.performer_image}`;

  let bio = null;
  if (bioPath && existsSync(bioPath)) {
    const bioMarkdown = readFileSync(bioPath, 'utf-8');
    bio = markdownToHtml(bioMarkdown);
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
