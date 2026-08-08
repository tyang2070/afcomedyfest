import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Helper functions for date/time parsing
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[date.getUTCDay()];
  const monthName = months[date.getUTCMonth()];
  const dayNum = String(date.getUTCDate()).padStart(2, '0');

  return `${dayName}, ${monthName} ${dayNum}`;
}

function formatTime(timeStr) {
  // Handle both "13:00" (24-hour) and "10:00 AM" (already AM/PM) formats
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }

  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
}

function extractSections(markdown) {
  if (!markdown) return null;

  const descMatch = markdown.match(/\*\*Workshop Description\*\*:\s*(.+?)(?=\n\n\*\*|\n\*\*[A-Z]|$)/s);
  const instrMatch = markdown.match(/\*\*Instructor Info\*\*:\s*(.+?)(?=\n\n\*\*|\n\*\*[A-Z]|$)/s);

  const mdLinks = str => str
    .replace(/\\(.)/g, '$1')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const parts = [];
  if (descMatch) parts.push(`<h4>Workshop Description</h4><p>${mdLinks(descMatch[1].trim())}</p>`);
  if (instrMatch) parts.push(`<h4>Instructor Info</h4><p>${mdLinks(instrMatch[1].trim())}</p>`);

  return parts.length ? parts.join('\n<br>\n') : null;
}

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
  let bioContent = null;
  if (record.workshop_description && record.workshop_description.trim()) {
    const bioPath = path.resolve(process.cwd(), `data/workshops/${record.workshop_description}`);
    if (fs.existsSync(bioPath)) {
      bioContent = extractSections(fs.readFileSync(bioPath, 'utf-8').trim());
    }
  }

  return {
    slug: record.workshop_teacher.toLowerCase().replace(/\s+/g, '-'),
    teacher: record.workshop_teacher,
    title: record.workshop_title,
    bio: bioContent,
    image: record.teacher_image ? `assets/workshop_images/${record.teacher_image}` : null,
    date: formatDate(record.date),
    startTime: formatTime(record.start_time),
    endTime: formatTime(record.end_time),
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
