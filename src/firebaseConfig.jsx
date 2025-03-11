
// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (Replace with your own keys)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
