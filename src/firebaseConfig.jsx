
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC88iqGZd4wPsyR4lKVQGKHRPwQSNR2N4A",
  authDomain: "preciamech-9c59b.firebaseapp.com",
  projectId: "preciamech-9c59b",
  storageBucket: "preciamech-9c59b.appspot.com",
  messagingSenderId: "785913419435",
  appId: "1:785913419435:web:5eee3be2e7c2e0ecbcfcc2",
  measurementId: "G-GSNW42QQVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const authenticateAdmin = async (username, password) => {
  try {
    console.log("Authenticating admin with username:", username);
    const adminQuery = query(
      collection(db, "admins"),
      where("username", "==", username),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(adminQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error authenticating admin:", error);
    return false;
  }
};

export { db, storage, authenticateAdmin };
