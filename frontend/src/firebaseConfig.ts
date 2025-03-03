import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgJuAc9dsY793Nuvs3I3dTNpaOaT7VFII",
  authDomain: "nebulous-dream-journal-985db.firebaseapp.com",
  projectId: "nebulous-dream-journal-985db",
  storageBucket: "nebulous-dream-journal-985db.firebasestorage.app",
  messagingSenderId: "654343636275",
  appId: "1:654343636275:web:be7be8edf258480032aa46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

