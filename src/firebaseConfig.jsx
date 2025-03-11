
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps } from "firebase/app";
import { collection, getDocs, query, where } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBu3u6yh4jX0y_MEdCXAjIGHwVqfDQUDl8",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.appspot.com",
  messagingSenderId: "373438186510",
  appId: "1:373438186510:web:d20daf88ab0fd04be0685f",
  measurementId: "G-5ZRRRH6C38"
};

// Initialize Firebase only if no apps exist
let app;
let db;

// Check if Firebase is already initialized
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the existing initialized app
}

db = getFirestore(app);

// Admin authentication function
const authenticateAdmin = async (username, password) => {
  try {
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

export { db, authenticateAdmin };
