// Script to add admin user to Firestore
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu3u6yh4jX0y_MEdCXAjIGHwVqfDQUDl8",
  authDomain: "preciamech-63537.firebaseapp.com",
  projectId: "preciamech-63537",
  storageBucket: "preciamech-63537.appspot.com",
  messagingSenderId: "373438186510",
  appId: "1:373438186510:web:d20daf88ab0fd04be0685f",
  measurementId: "G-5ZRRRH6C38",
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
