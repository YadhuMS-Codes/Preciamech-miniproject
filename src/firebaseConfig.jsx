
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps } from "firebase/app";

// Your Firebase configuration (Replace with your own keys)
const firebaseConfig = {
  apiKey: "const mySecret = process.env['MY_API']",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.firebasestorage.app",
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

export { db };
