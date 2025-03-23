
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, query, where } from "firebase/firestore";

// Firebase configuration with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXIwecMbGk8_XAV_x6lwEs9vgB9xsjl2Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "preciamech-63537.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "preciamech-63537",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "preciamech-63537.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "373438186510",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:373438186510:web:d20daf88ab0fd04be0685f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5ZRRRH6C38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Admin authentication function
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
export { db, storage, analytics, authenticateAdmin };
