// context/FirebaseContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { auth as firebaseAuth, db as firestoreDb } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AppStateContext } from './AppStateContext'; // We need this for the alert setter

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const unsubscribeRef = React.useRef(null);
  
  // Get setAlert from AppStateContext to show login/logout errors
  const { setAlert } = useContext(AppStateContext);

  // Firestore Listener Setup
  const setupFirestoreListener = useCallback((uid, { setAppData, defaultAppData, isInitialLoadRef }) => {
    if (!uid || !firestoreDb) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const userDocRef = doc(firestoreDb, 'users', uid, 'appState', 'data');

    unsubscribeRef.current = onSnapshot(userDocRef, (docSnap) => {
      isInitialLoadRef.current = true; // Set flag to prevent saving on this load
      if (docSnap.exists()) {
        const loadedData = docSnap.data();
        setAppData(prevData => ({
          ...defaultAppData,
          ...prevData, // Keep existing non-persistent state
          ...loadedData,
          themeSettings: loadedData.themeSettings || defaultAppData.themeSettings,
        }));
      } else {
        setAppData(defaultAppData);
      }
       // After the first load, set isInitialLoadRef to false
      setTimeout(() => { isInitialLoadRef.current = false; }, 500);
    }, (error) => {
      console.error("Error en el listener de Firestore:", error);
      if (setAlert) {
        setAlert({ isOpen: true, message: 'Error al cargar datos de Firebase.' });
      }
    });
    
    // Return the unsubscribe function for cleanup
    return unsubscribeRef.current;
  }, [setAlert]); // setAlert is a dependency now

  // Auth Listener is now simpler, the coordination happens in HomePage
  useEffect(() => {
    if (!firebaseAuth) { 
      setIsAuthReady(true);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    return () => unsubscribeAuth();
  }, []);


  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      setAlert({isOpen: true, message: 'Credenciales incorrectas. Por favor, verifique.'})
    }
  }, [setAlert]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setAlert({isOpen: true, message: 'Error al cerrar sesión.'})
    }
  }, [setAlert]);


  const contextValue = {
    user,
    isAuthReady,
    auth: firebaseAuth,
    db: firestoreDb,
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
