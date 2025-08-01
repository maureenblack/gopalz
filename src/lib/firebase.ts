import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhlUazexpv1z2gUTtMcylGgKT6m8QcDYs",
  authDomain: "gopalz-io.firebaseapp.com",
  projectId: "gopalz-io",
  storageBucket: "gopalz-io.appspot.com",
  messagingSenderId: "236524816129",
  appId: "1:236524816129:web:5d29d6fa6dc7c556367d00",
  measurementId: "G-59X5SS1NE3"
};

// Initialize Firebase
let app;
let analytics = null;
let auth;
let db;
let storage;

try {
  // Check if Firebase is already initialized
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Only initialize client-side services in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    auth = getAuth(app);
    auth.useDeviceLanguage(); // Set auth language to match device

    // Initialize other services
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db, storage, analytics };
