// lib/firebase/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBZhWsp5JODo0m1fcnUCw0w-SdVWK5RFzk",
    authDomain: "omega---fijo-soporte.firebaseapp.com",
    projectId: "omega---fijo-soporte",
    storageBucket: "omega---fijo-soporte.appspot.com",
    messagingSenderId: "725387515426",
    appId: "1:725387515426:web:3fcd5944419093e8dadc7b",
    measurementId: "G-HQ4R55SDNZ"
};

// Initialize Firebase only once
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);


// Safely export global variables
const getAppId = () => {
    return typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
}

const getFirebaseConfig = () => {
    return typeof __firebase_config !== 'undefined' ? __firebase_config : JSON.stringify(firebaseConfig);
}

export { app, auth, db, getAppId, getFirebaseConfig };
