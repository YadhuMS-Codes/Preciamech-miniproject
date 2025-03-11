
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps } from "firebase/app";

// Your Firebase configuration (Replace with your own keys)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.appspot.com",
  messagingSenderId: process.env.FIREBASE_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
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

export { db };
