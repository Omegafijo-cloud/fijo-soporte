// context/FirebaseContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '../lib/firebase'; // Import the initialized app
import { AppStateContext } from './AppStateContext'; // Import AppStateContext

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const unsubscribeRef = React.useRef(null);
  
  const appStateContext = useContext(AppStateContext);

  // Initialize Firebase services
  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
      setDb(getFirestore(app));
    }
  }, []);

  // Firestore Listener Setup
  const setupFirestoreListener = useCallback((uid, { setAppData, defaultAppData, isInitialLoadRef }) => {
    if (!uid || !db) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const appId = 'claro-template-generator'; // Replace with a dynamic app ID if needed
    const userDocRef = doc(db, 'artifacts', appId, 'users', uid, 'userData', 'appState');

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
      if (appStateContext?.setAlert) {
        appStateContext.setAlert({ isOpen: true, message: 'Error al cargar datos de Firebase.' });
      }
    });
    
    // Return the unsubscribe function for cleanup
    return unsubscribeRef.current;
  }, [db, appStateContext]); // setAlert is a dependency now

  // Auth Listener
  useEffect(() => {
    if (!auth) { 
      setIsAuthReady(true);
      return;
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser && unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);


  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    if (!auth) {
        if(appStateContext?.setAlert) appStateContext.setAlert({isOpen: true, message: 'Servicio de autenticación no disponible.'});
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      if(appStateContext?.setAlert) appStateContext.setAlert({isOpen: true, message: 'Credenciales incorrectas. Por favor, verifique.'})
    }
  }, [auth, appStateContext]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    if (!auth) {
        if(appStateContext?.setAlert) appStateContext.setAlert({isOpen: true, message: 'Servicio de autenticación no disponible.'});
        return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if(appStateContext?.setAlert) appStateContext.setAlert({isOpen: true, message: 'Error al cerrar sesión.'})
    }
  }, [auth, appStateContext]);


  const contextValue = {
    user,
    isAuthReady,
    auth,
    db,
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
