# AF Comedy Fest - Static Website

A modern static website for AF Comedy Fest built with Astro.

## 📋 Project Structure

```
src/
├── layouts/
│   └── Layout.astro          # Main layout component with navigation
├── pages/
│   ├── index.astro           # Home page
│   ├── about.astro           # About page
│   ├── schedule.astro        # Schedule/shows page
│   ├── performers.astro      # Performers listing
│   ├── performers/
│   │   └── [slug].astro      # Individual performer bio pages
│   ├── team.astro            # Team members bios
│   └── workshops.astro       # Workshops listing
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17.1 or higher
- npm or yarn

### Installation

Dependencies are already installed. To reinstall if needed:

```bash
npm install
```

### Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

Build the static site:

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

Preview the built site locally:

```bash
npm run preview
```

## 📄 Pages

### Home (`/`)
Welcome page with links to main sections.

### About (`/about`)
Festival information, mission, values, history, and contact details.

### Schedule (`/schedule`)
Displays all upcoming shows with dates, times, venues, and performers.

### Performers (`/performers`)
Grid view of all performers with bios and links to individual pages.

### Performer Bio (`/performers/[slug]`)
Individual performer pages with detailed information. Edit performer data in `src/pages/performers/[slug].astro`.

### Team (`/team`)
Grid view of team members with roles and bios.

### Workshops (`/workshops`)
List of workshops with instructor, time, level, and capacity information.

## ✏️ Customization

### Update Site Title & Info
- Edit `astro.config.mjs` for site-wide configuration
- Update contact info in `src/pages/about.astro`

### Add/Edit Performers
1. Update the performers data in `src/pages/performers.astro`
2. Add performer details in `src/pages/performers/[slug].astro`

### Add/Edit Team Members
Edit team member data in `src/pages/team.astro`

### Add/Edit Workshops
Edit workshop data in `src/pages/workshops.astro`

### Add/Edit Events
Edit show/event data in `src/pages/schedule.astro`

### Styling
Global styles are in `src/layouts/Layout.astro`. Component-specific styles use scoped `<style>` tags.

## 🎨 Styling Features

- Responsive grid layouts that adapt to mobile
- Hover effects and transitions
- Color scheme centered on `#0066cc` (blue accent)
- Card-based design patterns

## 📦 Deployment

The built `dist/` folder can be deployed to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## 📝 Next Steps

1. Replace placeholder images:
   - Add real performer images to `public/` folder
   - Update image paths in components

2. Update content:
   - Add real performer and team member information
   - Update festival dates and venues
   - Add actual workshop and show details

3. Add branding:
   - Update colors in `Layout.astro`
   - Add festival logo
   - Customize fonts if desired

4. Add navigation/social links:
   - Update social media links in `about.astro`
   - Add email signup forms if desired

## 📚 Astro Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Components](https://docs.astro.build/en/basics/astro-components/)
- [Astro Pages & Routing](https://docs.astro.build/en/basics/astro-pages/)
