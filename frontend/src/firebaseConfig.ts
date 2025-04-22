import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgJuAc9dsY793Nuvs3I3dTNpaOaT7VFII",
  authDomain: "nebulous-dream-journal-985db.firebaseapp.com",
  projectId: "nebulous-dream-journal-985db",
  storageBucket: "nebulous-dream-journal-985db.appspot.com",
  messagingSenderId: "654343636275",
  appId: "1:654343636275:web:be7be8edf258480032aa46",
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

export default app;
