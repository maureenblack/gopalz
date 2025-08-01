export type ActivityType = 
  | 'hiking'
  | 'beach_day'
  | 'city_tour'
  | 'camping'
  | 'mountain_biking'
  | 'kayaking'
  | 'rock_climbing'
  | 'skiing'
  | 'surfing'
  | 'other';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface TripData {
  id: string;
  title: string;
  activityType: ActivityType;
  startDate: string;
  endDate: string;
  location: Location;
  difficulty: DifficultyLevel;
  spots: number;
  description: string;
  imageUrls: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
