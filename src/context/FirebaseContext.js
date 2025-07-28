// context/FirebaseContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth as firebaseAuth, db as firestoreDb } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const unsubscribeRef = React.useRef(null);

  // Auth Listener
  useEffect(() => {
    if (!firebaseAuth) { 
      setIsAuthReady(true);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (!currentUser && unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Firestore Listener Setup
  const setupFirestoreListener = useCallback((uid, setAppData, defaultAppData, setAlert) => {
    if (!uid || !firestoreDb) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const userDocRef = doc(firestoreDb, `artifacts/${appId}/users/${uid}/userData`, 'appState');

    unsubscribeRef.current = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const loadedData = docSnap.data();
        setAppData(prevData => ({
          ...defaultAppData,
          ...loadedData,
          themeSettings: loadedData.themeSettings || defaultAppData.themeSettings,
        }));
      } else {
        setAppData(defaultAppData);
      }
    }, (error) => {
      console.error("Error en el listener de Firestore:", error);
      if (setAlert) {
        setAlert({ isOpen: true, message: 'Error al cargar datos de Firebase.' });
      }
    });
    
    // Return the unsubscribe function for cleanup
    return unsubscribeRef.current;
  }, []);


  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      // Let the component calling this handle alerts.
      throw error;
    }
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Let the component calling this handle alerts.
      throw error;
    }
  }, []);


  const contextValue = {
    user,
    isAuthReady,
    auth: firebaseAuth,
    db: firestoreDb,
    userId: user?.uid,
    handleLogin,
    handleLogout,
    setupFirestoreListener, // Expose the listener setup function
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext };
