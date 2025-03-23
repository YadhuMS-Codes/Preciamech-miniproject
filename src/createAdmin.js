
// Script to add admin user to Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
