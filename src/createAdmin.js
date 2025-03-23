
// Script to add admin user to Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add admin
async function addAdmin() {
  try {
    await setDoc(doc(db, "admins", "admin1"), {
      username: "admin",
      password: "admin123",
    });
    console.log("Admin user added successfully!");
  } catch (error) {
    console.error("Error adding admin:", error);
  }
}

// Run the function when this script is executed directly
addAdmin();

// For browser environments, export the function
export { addAdmin };
