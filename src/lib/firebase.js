// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";




const firebaseConfig = {
  apiKey: "AIzaSyBlX4F1TNjG4ZVXcizC74MFBj6_fK6xQm8",
  authDomain: "uwo-3316-lab4.firebaseapp.com",
  projectId: "uwo-3316-lab4",
  storageBucket: "uwo-3316-lab4.appspot.com",
  messagingSenderId: "63363899298",
  appId: "1:63363899298:web:d06e9d16f9d9a771e01cfb",
  measurementId: "G-W8YQGGS7BQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
