// context/FirebaseContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { auth as firebaseAuth, db as firestoreDb } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AppStateContext } from './AppStateContext'; // Import AppStateContext

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { setAppData, defaultAppData, setAlert, setNoticeModalOpen } = useContext(AppStateContext);
  const userIdRef = React.useRef(null);
  const unsubscribeRef = React.useRef(null);

  // Auth Listener
  useEffect(() => {
    if (!firebaseAuth) { // Ensure Firebase is initialized
      setIsAuthReady(true);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      userIdRef.current = currentUser ? currentUser.uid : null;
      setIsAuthReady(true); // Firebase auth is ready

      if (currentUser) {
        setNoticeModalOpen(true);
        setupFirestoreListener(currentUser.uid);
      } else {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        setAppData(defaultAppData); // Reset appData to default if user logs out
      }
    });

    return () => unsubscribeAuth();
  }, [setAppData, defaultAppData, setNoticeModalOpen]);

  // Firestore Listener
  const setupFirestoreListener = useCallback((uid) => {
    if (!uid || !firestoreDb) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Use global __app_id
    const userDocRef = doc(firestoreDb, `artifacts/${appId}/users/${uid}/userData`, 'appState');

    unsubscribeRef.current = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const loadedData = docSnap.data();
        setAppData(prevData => ({
          ...defaultAppData, // Start with defaults to ensure non-persisted items are reset
          ...loadedData, // Overlay loaded data
          themeSettings: loadedData.themeSettings || defaultAppData.themeSettings, // Ensure theme is loaded or defaulted
        }));
      } else {
        setAppData(defaultAppData); // If no document exists, reset to default appData
      }
    }, (error) => {
      console.error("Error en el listener de Firestore:", error);
      setAlert({ isOpen: true, message: 'Error al cargar datos de Firebase.' });
    });
  }, [setAppData, defaultAppData, setAlert]);


  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    if (!email || !password) {
      setAlert({ isOpen: true, message: 'Por favor, ingrese correo y contraseña.' });
      return;
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      let errorMessage = 'Error al iniciar sesión. Por favor, verifique sus credenciales.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Credenciales inválidas. Usuario o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Formato de correo electrónico inválido.';
      }
      setAlert({ isOpen: true, message: errorMessage });
    }
  }, [setAlert]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setAlert({ isOpen: true, message: 'Error al cerrar sesión.' });
    }
  }, [setAlert]);


  const contextValue = {
    user,
    isAuthReady,
    auth: firebaseAuth,
    db: firestoreDb,
    userId: userIdRef.current,
    handleLogin,
    handleLogout,
  };

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext };
