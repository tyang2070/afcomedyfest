/**
 * Performer data system (CSV + Markdown bios + Images).
 *
 * To add or update a performer:
 * 1. Edit /data/performers.csv — add slug, name, bio filename, and image filename
 * 2. Create /data/performer_bios/<filename>.md with their bio text
 * 3. Drop their photo at /assets/performer_images/<filename>
 * 4. Run: npm run update-performers
 *
 * Example row in performers.csv:
 *   slug,name,bio,performer_image
 *   capulet,Capulet,capulet.md,capulet.jpg
 *
 * Bio and image paths are auto-prefixed to their directories.
 */

import performerData from '../../data/performers.json';

export interface Performer {
  slug: string;
  name: string;
  bio: string | null;
  image: ImageMetadata | null;
}

// Dynamic import all performer images from assets/performer_images/
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/performer_images/*',
  { eager: true }
);

function getImageFromPath(filePath: string | null): ImageMetadata | null {
  if (!filePath) return null;

  // Extract filename from path (e.g., "assets/performer_images/capulet.jpg" -> "capulet.jpg")
  const filename = filePath.split('/').pop();
  if (!filename) return null;

  for (const [modulePath, mod] of Object.entries(imageModules)) {
    if (modulePath.endsWith(filename)) {
      return mod.default;
    }
  }
  return null;
}

export const PERFORMERS: Performer[] = performerData.map(p => ({
  slug: p.slug,
  name: p.name,
  bio: p.bio,
  image: getImageFromPath(p.performer_image),
}));

export function getPerformer(slug: string): Performer | undefined {
  return PERFORMERS.find(p => p.slug === slug);
}
