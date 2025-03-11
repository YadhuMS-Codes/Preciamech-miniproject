
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

// Your Firebase configuration - removed process.env reference that was causing errors
const firebaseConfig = {
  apiKey: "AIzaSyBu3u6yh4jX0y_MEdCXAjIGHwVqfDQUDl8",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.appspot.com",
  messagingSenderId: "373438186510",
  appId: "1:373438186510:web:d20daf88ab0fd04be0685f",
  measurementId: "G-5ZRRRH6C38"
};

// Initialize Firebase
let app;
let db;

// Avoid duplicate Firebase app initialization
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If already initialized, use the existing app
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase app already initialized, using existing app');
  } else {
    console.error('Firebase initialization error:', error);
  }
}

db = getFirestore(app);

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

export { db, authenticateAdmin };
