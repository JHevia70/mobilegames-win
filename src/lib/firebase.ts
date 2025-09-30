import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCywwj_27AOLJVq_hrhArfN--k1eStHOdA',
  authDomain: 'mobilegames-win.firebaseapp.com',
  projectId: 'mobilegames-win',
  storageBucket: 'mobilegames-win.firebasestorage.app',
  messagingSenderId: '1055853638509',
  appId: '1:1055853638509:web:e7fb57c0e2e8d7c0b7c9b5',
};

// Initialize Firebase only if no apps exist (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('🔥 Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Initialize Firestore
const db = getFirestore(app);
console.log('🗄️ Firestore instance created:', db.app.name);

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app;