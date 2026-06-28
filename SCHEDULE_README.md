# Schedule Management Guide

This project uses a CSV file to manage the festival schedule. The CSV file is automatically converted to JSON and used by the website.

## 📋 How to Update the Schedule

### Option 1: Edit the CSV File (Recommended)

1. Open `/data/schedule.csv` in your favorite spreadsheet application (Excel, Google Sheets, Numbers, etc.) or a text editor
2. Add/edit/delete rows for shows
3. Save the file
4. Run `npm run update-schedule` to convert the CSV to JSON
5. The website will automatically use the updated schedule

### Option 2: Direct JSON Edit

If you prefer, you can directly edit `/data/schedule.json`. This file is generated from the CSV, so if you edit it directly, make sure to maintain the structure.

## 📝 CSV Column Reference

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `date` | ✓ | Festival date | 2026-09-02, 2026-09-03 |
| `start_time` | ✓ | Show start time (HH:MM) | 18:00, 19:30 |
| `end_time` | ✓ | Show end time (HH:MM) | 19:00, 21:00 |
| `stage` | ✓ | Performance stage | ArtSpace - Mainstage, ArtBox |
| `show_name` | ✓ | Name of the show/act | Comedian A, Improv Group C |
| `subacts` | ✗ | Performers/acts (comma-delimited) | Actor 1, Actor 2, Actor 3 |

## 📅 Valid Dates

You can only use these dates in the CSV:
- 2026-09-02 (Tuesday)
- 2026-09-03 (Wednesday)
- 2026-09-04 (Thursday)
- 2026-09-05 (Friday)
- 2026-09-06 (Saturday)

## 🎪 Valid Stages

Only two stages are available:
- `ArtSpace - Mainstage`
- `ArtBox`

## 🔄 Workflow

**For Development:**
```bash
# Edit the CSV file in data/schedule.csv
# Then run:
npm run update-schedule

# Or start dev server (which also updates schedule)
npm run dev
```

**For Production:**
```bash
# Build command automatically updates schedule from CSV
npm run build
```

## 📊 Example CSV Content

```csv
date,start_time,end_time,stage,show_name,subacts
2026-09-02,18:00,19:00,ArtSpace - Mainstage,Opening Welcome,
2026-09-02,19:00,20:00,ArtSpace - Mainstage,Comedian A,
2026-09-02,19:00,20:00,ArtBox,Musical Act B,
2026-09-02,20:00,21:00,ArtSpace - Mainstage,Improv Group C,"Actor 1, Actor 2, Actor 3"
2026-09-02,20:00,21:00,ArtBox,Comedian D,
2026-09-03,18:00,19:00,ArtSpace - Mainstage,Sketch Comedy E,"Cast Member 1, Cast Member 2"
```

### Notes on the Format:

- **Time Format**: Use 24-hour format (HH:MM), e.g., 18:00 for 6 PM, 21:30 for 9:30 PM
- **Date Format**: Use YYYY-MM-DD format
- **Subacts**: Optional field for listing performers
  - Leave empty if no subacts
  - Use commas to separate multiple performers
  - Each subact appears on its own line in the schedule
  - Subacts are displayed with an arrow (→) prefix

## ⚠️ Important Notes

1. **Stick to valid dates** - Only use the 5 festival dates listed above
2. **Use correct stage names** - Must be exactly "ArtSpace - Mainstage" or "ArtBox"
3. **Time format matters** - Use HH:MM in 24-hour format (13:00 not 1:00 PM)
4. **Don't edit JSON directly** - It's auto-generated from the CSV
5. **Multiple shows at same time** - If you have shows on both stages at the same time, create separate rows with matching start_time

## 💡 Quick Tips

- **Open CSV in Excel/Google Sheets** for easier editing
- **Duplicate rows** to quickly add similar shows
- **Keep times consistent** within a day for better organization
- **Each row = one show** on one stage at one time
- **Use "subacts" field** to list all performers in a show

## 🐛 Troubleshooting

### Schedule not updating?
1. Make sure you saved the CSV file
2. Run `npm run update-schedule`
3. Restart dev server if running

### Error: "Invalid date"
- Use only these dates: 2026-09-02 through 2026-09-06
- Check the date format: YYYY-MM-DD

### Error: "Invalid stage"
- Use exactly: `ArtSpace - Mainstage` or `ArtBox`
- Check spelling and capitalization

### Time displays incorrectly?
- Use 24-hour format with colons: 18:00, not 6PM or 6:00pm
- Format: HH:MM

## 🔧 Advanced: Modify the Script

If you need to change how the CSV is processed, edit `/scripts/csv-to-schedule.js`:

1. Update valid dates in the `validDates` array
2. Update stage names in the `validStages` array
3. Run `npm run update-schedule` to regenerate JSON

## 📝 Example: Complete Day Schedule

```csv
date,start_time,end_time,stage,show_name,subacts
2026-09-04,17:00,18:00,ArtSpace - Mainstage,Comedian John,"John Smith"
2026-09-04,17:00,18:00,ArtBox,Improv Warm-up,"Jane Doe, Mike Johnson"
2026-09-04,18:00,19:30,ArtSpace - Mainstage,Comedy Show,"Performer 1, Performer 2, Performer 3"
2026-09-04,18:00,19:30,ArtBox,Musical Performance,"Singer Name"
2026-09-04,19:30,21:00,ArtSpace - Mainstage,Late Night Comedy,
2026-09-04,19:30,21:00,ArtBox,DJ Night,
```

This creates a full day with 3 time slots, each with shows on both stages.
