// context/FirebaseContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '../lib/firebase'; // Import the initialized app

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const unsubscribeRef = React.useRef(null);
  
  // Initialize Firebase services
  useEffect(() => {
    if (app) {
      const authInstance = getAuth(app);
      setAuth(authInstance);
      setDb(getFirestore(app));

      const unsubscribeAuth = onAuthStateChanged(authInstance, (currentUser) => {
        setUser(currentUser);
        setIsAuthReady(true);
        // Clean up Firestore listener on logout
        if (!currentUser && unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      });

      return () => unsubscribeAuth();
    } else {
        setIsAuthReady(true); // If no app, still need to signal readiness
    }
  }, []);

  // Firestore Listener Setup - now expects context setters as arguments
  const setupFirestoreListener = useCallback((uid, { setAppData, defaultAppData, isInitialLoadRef, setAlert }) => {
    if (!uid || !db) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    const appId = 'claro-template-generator';
    const userDocRef = doc(db, 'artifacts', appId, 'users', uid, 'userData', 'appState');

    unsubscribeRef.current = onSnapshot(userDocRef, (docSnap) => {
      isInitialLoadRef.current = true; 
      if (docSnap.exists()) {
        const loadedData = docSnap.data();
        setAppData(prevData => ({
          ...defaultAppData,
          ...prevData,
          ...loadedData,
          themeSettings: loadedData.themeSettings || defaultAppData.themeSettings,
        }));
      } else {
        setAppData(defaultAppData);
      }
      setTimeout(() => { isInitialLoadRef.current = false; }, 500);
    }, (error) => {
      console.error("Error en el listener de Firestore:", error);
      if (setAlert) {
        setAlert({ isOpen: true, message: 'Error al cargar datos de Firebase.' });
      }
    });
    
    return unsubscribeRef.current;
  }, [db]);

  // Login handler
  const handleLogin = useCallback(async (email, password, setAlert) => {
    if (!auth) {
        if(setAlert) setAlert({isOpen: true, message: 'Servicio de autenticación no disponible.'});
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      if(setAlert) setAlert({isOpen: true, message: 'Credenciales incorrectas. Por favor, verifique.'})
    }
  }, [auth]);

  // Logout handler
  const handleLogout = useCallback(async (setAlert) => {
    if (!auth) {
        if(setAlert) setAlert({isOpen: true, message: 'Servicio de autenticación no disponible.'});
        return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if(setAlert) setAlert({isOpen: true, message: 'Error al cerrar sesión.'})
    }
  }, [auth]);


  const contextValue = {
    user,
    isAuthReady,
    auth,
    db,
    handleLogin,
    handleLogout,
    setupFirestoreListener,
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext };
