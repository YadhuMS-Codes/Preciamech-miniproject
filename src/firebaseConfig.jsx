
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase app already initialized, using existing app');
  } else {
    console.error('Firebase initialization error:', error);
  }
}

db = getFirestore(app);

const authenticateAdmin = async (username, password) => {
  try {
    console.log("Authenticating admin with username:", username);
    const adminQuery = query(
      collection(db, "admins"), 
      where("username", "==", username),
      where("password", "==", password)
    );
    
    const snapshot = await getDocs(adminQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
};

const storage = getStorage(app);
export { db, storage, authenticateAdmin };
