import workshopsJson from '../../data/workshops.json';

interface Workshop {
  slug: string;
  teacher: string;
  title: string;
  bio: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  cost: string;
  location: string;
  link: string;
  capacity: number;
}

export const WORKSHOPS = workshopsJson as Workshop[];
