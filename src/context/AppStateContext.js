// context/AppStateContext.js
'use client';

import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseContext } from './FirebaseContext'; // Import FirebaseContext

// --- CONSTANTES GLOBALES Y CONFIGURACIÓN ---
export const defaultThemeSettings = {
    '--azul-oscuro': "#1A237E", '--morado': "#6A1B9A", '--turquesa': "#00BCD4",
    '--gris-claro': "#F0F0F0", '--blanco': "#FFFFFF", '--texto-oscuro': "#333333",
    '--texto-intermedio': "#555555", '--texto-claro': "#CCCCCC", '--rojo-claro': "#e74c3c",
    '--rojo-oscuro': "#c0392b", '--verde-claro': "#28a745", '--verde-oscuro': "#218838",
    '--neuron-color-1-rgb': "106, 27, 154", '--neuron-color-2-rgb': "0, 188, 212",
    '--neuron-color-3-rgb': "26, 35, 126", '--neuron-connection-rgb': "106, 27, 154"
};

export const defaultAppData = {
    themeSettings: defaultThemeSettings,
    notesContent: '',
    usersContent: '',
    genericFormData: { id: '', nombreCliente: '', numeroInconveniente: '', Inconveniente: '', tipoServicio: '', pruebasRealizadas: '' },
    memoQuejasData: { selectedType: '', fields: {}, checkboxValues: {} },
    wfMemosData: { selectedType: '', fields: {} },
    ordenMemosData: { selectedType: '', fields: {} },
    activeTabs: { main: 'tab-plantillas', sub: 'sub-tab-genericas' },
    backupTemplatesContent: '', // Not persisted, but part of appData for UI
};

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  const firebaseContext = useContext(FirebaseContext);
  const db = firebaseContext?.db;
  const userId = firebaseContext?.user?.uid;
  
  const [appData, setAppData] = useState(defaultAppData);
  const [isSaving, setIsSaving] = useState(false);
  const saveDataTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true); // Flag to prevent saving on initial load

  // Modals state
  const [alert, setAlert] = useState({ isOpen: false, message: '' });
  const [confirm, setConfirm] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  // Helper to get data for save (reads from appData state)
  const getUIDataForSave = useCallback(() => {
    return {
      themeSettings: appData.themeSettings,
      notesContent: appData.notesContent,
      usersContent: appData.usersContent,
      genericFormData: appData.genericFormData,
      memoQuejasData: appData.memoQuejasData,
      wfMemosData: appData.wfMemosData,
      ordenMemosData: appData.ordenMemosData,
      activeTabs: appData.activeTabs,
      // backupTemplatesContent and customTransferItems are explicitly NOT saved as per request
    };
  }, [appData]);

  // Auto-save trigger
  const triggerSave = useCallback(() => {
    if (isSaving || !userId || !db) return; // Ensure user and db are available
    clearTimeout(saveDataTimeoutRef.current);
    saveDataTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      const dataToSave = getUIDataForSave();
      const userDocRef = doc(db, 'users', userId, 'appState', 'data');
      try {
        await setDoc(userDocRef, dataToSave, { merge: true });
      } catch (error) {
        console.error("Error al guardar datos en Firestore:", error);
        setAlert({ isOpen: true, message: 'Error al guardar datos.' });
      } finally {
        setIsSaving(false);
      }
    }, 500);
  }, [isSaving, userId, db, getUIDataForSave, setAlert]);

  // Effect to trigger save on appData changes (debounced)
  useEffect(() => {
    // Only trigger save if not the initial load from Firebase
    if (!isInitialLoadRef.current) {
      triggerSave();
    } else {
      // After the first render, set isInitialLoadRef to false
      // This allows subsequent changes to trigger saves
      isInitialLoadRef.current = false;
    }
  }, [appData, triggerSave]);


  // UI State Updaters (passed down via context)
  const updateAppData = useCallback((key, value) => {
      setAppData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateGenericFormData = useCallback((field, value) => {
      setAppData(prev => ({
          ...prev,
          genericFormData: { ...prev.genericFormData, [field]: value }
      }));
  }, []);

  const updateMemoQuejasData = useCallback((key, value) => {
      setAppData(prev => ({
          ...prev,
          memoQuejasData: { ...prev.memoQuejasData, [key]: value }
      }));
  }, []);

  const updateWFMemosData = useCallback((key, value) => {
      setAppData(prev => ({
          ...prev,
          wfMemosData: { ...prev.wfMemosData, [key]: value }
      }));
  }, []);

  const updateOrdenMemosData = useCallback((key, value) => {
      setAppData(prev => ({
          ...prev,
          ordenMemosData: { ...prev.ordenMemosData, [key]: value }
      }));
  }, []);

  const updateThemeSettings = useCallback((key, value) => {
      setAppData(prev => ({
          ...prev,
          themeSettings: { ...prev.themeSettings, [key]: value }
      }));
  }, []);

  const switchTab = useCallback((mainTab, subTab) => {
      setAppData(prev => ({
          ...prev,
          activeTabs: { main: mainTab, sub: subTab }
      }));
  }, []);

  const contextValue = {
    appData,
    setAppData, // Exposed for FirebaseProvider to update directly from snapshot
    updateAppData,
    updateGenericFormData,
    updateMemoQuejasData,
    updateWFMemosData,
    updateOrdenMemosData,
    updateThemeSettings,
    switchTab,
    alert,
    setAlert,
    confirm,
    setConfirm,
    noticeModalOpen,
    setNoticeModalOpen,
    defaultAppData, // Also expose defaultAppData for resets
    isInitialLoadRef, // pass ref to be set by Firebase context on load
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateContext };
