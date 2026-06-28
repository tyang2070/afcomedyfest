import workshopsJson from '../../data/workshops.json';

const workshopImagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/workshop_images/*.{jpeg,jpg,png,gif}',
  { eager: true }
);

interface ImageMetadata {
  src: string;
  width: number;
  height: number;
}

interface Workshop {
  slug: string;
  teacher: string;
  title: string;
  bio: string;
  image?: ImageMetadata;
  date: string;
  startTime: string;
  endTime: string;
  cost: string;
  location: string;
  link: string;
  capacity: number;
}

// Match images to workshops by filename
const workshopsWithImages: Workshop[] = workshopsJson.map((workshop: any) => {
  const imageName = workshop.image.split('/').pop();
  const imageKey = Object.keys(workshopImagesGlob).find((key) =>
    key.includes(imageName)
  );

  return {
    ...workshop,
    image: imageKey ? workshopImagesGlob[imageKey].default : undefined,
  };
});

export const WORKSHOPS = workshopsWithImages;
