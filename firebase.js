import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWmnVarQHI1yatnkdKh0vYhDG2EyZcHDw",
  authDomain: "react-notes-d0841.firebaseapp.com",
  projectId: "react-notes-d0841",
  storageBucket: "react-notes-d0841.appspot.com",
  messagingSenderId: "591631765168",
  appId: "1:591631765168:web:bb3f490766c75abd407575",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
