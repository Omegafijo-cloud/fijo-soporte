// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
