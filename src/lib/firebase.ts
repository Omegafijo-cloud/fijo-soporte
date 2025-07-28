// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZhWsp5JODo0m1fcnUCw0w-SdVWK5RFzk",
  authDomain: "omega---fijo-soporte.firebaseapp.com",
  projectId: "omega---fijo-soporte",
  storageBucket: "omega---fijo-soporte.appspot.com",
  messagingSenderId: "725387515426",
  appId: "1:725387515426:web:3fcd5944419093e8dadc7b",
  measurementId: "G-HQ4R55SDNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
