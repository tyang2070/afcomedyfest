import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read CSV file
const csvPath = path.join(__dirname, '../data/schedule.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

// Define valid dates
const validDates = ['2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'];
const validStages = ['ArtSpace', 'ArtBox'];

// Validate records
for (const record of records) {
  if (!validDates.includes(record.date)) {
    throw new Error(`Invalid date: ${record.date}. Valid dates: ${validDates.join(', ')}`);
  }
  if (!validStages.includes(record.stage)) {
    throw new Error(`Invalid stage: ${record.stage}. Valid stages: ${validStages.join(', ')}`);
  }
}

// Parse subacts - split by comma and trim whitespace
const parseSubacts = (subactsStr) => {
  if (!subactsStr || subactsStr.trim() === '') {
    return [];
  }
  return subactsStr.split(',').map(act => act.trim());
};

// Parse ticket link - return URL or null
const parseTicketLink = (linkStr) => {
  if (!linkStr || linkStr.trim() === '') {
    return null;
  }
  return linkStr.trim();
};

// Transform CSV data into schedule structure organized by date and stage
const schedule = {};

// Initialize structure for each date
for (const date of validDates) {
  schedule[date] = {};
  for (const stage of validStages) {
    schedule[date][stage] = [];
  }
}

// Populate with records
for (const record of records) {
  schedule[record.date][record.stage].push({
    showName: record.show_name,
    startTime: record.start_time,
    endTime: record.end_time,
    subacts: parseSubacts(record.subacts),
    ticketLink: parseTicketLink(record.ticket_link)
  });
}

// Sort each stage by start time
for (const date of Object.keys(schedule)) {
  for (const stage of Object.keys(schedule[date])) {
    schedule[date][stage].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  }
}

// Create output structure
const output = {
  dates: validDates,
  stages: validStages,
  schedule: schedule
};

// Write JSON file
const jsonPath = path.join(__dirname, '../data/schedule.json');
fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));

console.log('✓ Schedule converted from CSV to JSON');
console.log(`✓ Output: ${jsonPath}`);
console.log(`✓ Dates: ${validDates.join(', ')}`);
console.log(`✓ Stages: ${validStages.join(', ')}`);
