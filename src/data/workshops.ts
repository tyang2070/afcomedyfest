import workshopsJson from '../../data/workshops.json';

interface Workshop {
  slug: string;
  teacher: string;
  title: string;
  bio: string | null;
  image: ImageMetadata | null;
  date: string;
  startTime: string;
  endTime: string;
  cost: string;
  location: string;
  link: string;
  capacity: number;
}

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/workshop_images/*',
  { eager: true }
);

function getImageFromPath(filePath: string | null): ImageMetadata | null {
  if (!filePath) return null;
  const filename = filePath.split('/').pop();
  if (!filename) return null;
  const filenameLower = filename.toLowerCase();
  for (const [modulePath, mod] of Object.entries(imageModules)) {
    if (modulePath.split('/').pop()?.toLowerCase() === filenameLower) {
      return mod.default;
    }
  }
  return null;
}

export const WORKSHOPS: Workshop[] = (workshopsJson as any[]).map(w => ({
  ...w,
  image: getImageFromPath(w.image),
}));
