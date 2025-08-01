import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhlUazexpv1z2gUTtMcylGgKT6m8QcDYs",
  authDomain: "gopalz.firebaseapp.com",
  projectId: "gopalz",
  storageBucket: "gopalz.firebasestorage.app",
  messagingSenderId: "236524816129",
  appId: "1:236524816129:web:5d29d6fa6dc7c556367d00",
  measurementId: "G-59X5SS1NE3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analytics };
