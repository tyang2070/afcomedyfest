import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Read CSV
const csvPath = path.resolve(process.cwd(), 'data/workshops.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

// Process workshops
const workshops = records.map((record) => {
  // Read workshop description markdown
  const bioPath = path.resolve(process.cwd(), `data/workshop_bios/${record.workshop_description}`);
  const bioContent = fs.readFileSync(bioPath, 'utf-8').trim();

  return {
    slug: record.workshop_teacher.toLowerCase().replace(/\s+/g, '-'),
    teacher: record.workshop_teacher,
    title: record.workshop_title,
    bio: bioContent,
    image: `/data/workshop_images/${record.teacher_image}`,
    date: record.date,
    startTime: record.start_time,
    endTime: record.end_time,
    cost: record.cost,
    location: record.location,
    link: record.link,
    capacity: parseInt(record.capacity) || 0,
  };
});

// Write JSON
const outputPath = path.resolve(process.cwd(), 'data/workshops.json');
fs.writeFileSync(outputPath, JSON.stringify(workshops, null, 2));

console.log('✓ Workshops converted from CSV to JSON');
console.log(`✓ Output: ${outputPath}`);
console.log(`✓ Workshops: ${workshops.map(w => w.teacher).join(', ')}`);
