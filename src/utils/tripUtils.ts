import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { TripData } from '@/types/trip';

export const activityOptions = [
  { value: 'hiking', label: 'Hiking', icon: '🥾' },
  { value: 'beach_day', label: 'Beach Day', icon: '🏖️' },
  { value: 'city_tour', label: 'City Tour', icon: '🏛️' },
  { value: 'camping', label: 'Camping', icon: '⛺' },
  { value: 'mountain_biking', label: 'Mountain Biking', icon: '🚵' },
  { value: 'kayaking', label: 'Kayaking', icon: '🛶' },
  { value: 'rock_climbing', label: 'Rock Climbing', icon: '🧗' },
  { value: 'skiing', label: 'Skiing', icon: '⛷️' },
  { value: 'surfing', label: 'Surfing', icon: '🏄' },
  { value: 'other', label: 'Other', icon: '🎯' }
];

export const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', description: 'No experience needed' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience required' },
  { value: 'advanced', label: 'Advanced', description: 'Significant experience needed' },
  { value: 'expert', label: 'Expert', description: 'Professional level' }
];

export async function uploadTripImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const imageRef = ref(storage, `trips/${uuidv4()}_${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  });

  return Promise.all(uploadPromises);
}

export async function createTrip(tripData: Omit<TripData, 'id' | 'createdAt' | 'updatedAt'>) {
  const tripId = uuidv4();
  const now = new Date().toISOString();
  
  const trip: TripData = {
    ...tripData,
    id: tripId,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(doc(db, 'trips', tripId), trip);
  return trip;
}
