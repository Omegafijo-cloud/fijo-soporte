// app/page.tsx
'use client';

import React, { useContext, useEffect } from 'react';
import { FirebaseContext } from '../context/FirebaseContext'; 
import { AppStateContext } from '../context/AppStateContext';
import LoginPage from '../components/auth/LoginPage';
import MainLayout from '../components/layout/MainLayout';
import NeuronCanvas from '../components/common/NeuronCanvas';
import { CustomAlertDialog, CustomConfirmDialog, ImportantNoticeModal } from '../components/modals/Alerts';

export default function HomePage() {
  const firebaseContext = useContext(FirebaseContext);
  const appStateContext = useContext(AppStateContext);

  // Destructure all required functions and state from both contexts
  const { user, isAuthReady, handleLogin, setupFirestoreListener, db, handleLogout } = firebaseContext || {};
  const { appData, setAppData, alert, setAlert, confirm, setConfirm, noticeModalOpen, setNoticeModalOpen, defaultAppData, isInitialLoadRef, triggerSave } = appStateContext || {};

  // Effect to set up the Firestore listener when a user logs in
  useEffect(() => {
    if (user && db && setupFirestoreListener) {
      setNoticeModalOpen(true);
      const contextSetters = { setAppData, defaultAppData, isInitialLoadRef, setAlert };
      const unsubscribe = setupFirestoreListener(user.uid, contextSetters);
      
      // Cleanup listener on component unmount or user change
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else if (!user && setAppData) {
      // Reset app data if user logs out
      setAppData(defaultAppData);
    }
  }, [user, db, setupFirestoreListener, setAppData, defaultAppData, isInitialLoadRef, setAlert, setNoticeModalOpen]);


  // Effect to trigger auto-save when appData changes
  useEffect(() => {
    if (user && db) {
      triggerSave(db, user.uid);
    }
  }, [appData, triggerSave, user, db]);


  // Effect to apply theme from appData
  useEffect(() => {
    if (appData?.themeSettings) {
      Object.keys(appData.themeSettings).forEach(varName => {
        document.documentElement.style.setProperty(varName, appData.themeSettings[varName]);
      });
    }
  }, [appData?.themeSettings]);
  

  if (!isAuthReady || !appStateContext || !firebaseContext) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  // Pass alert setters to login/logout handlers
  const onLogin = (email, password) => handleLogin(email, password, setAlert);
  const onLogout = () => handleLogout(setAlert);

  return (
    <div className="min-h-screen flex flex-col font-roboto" style={{ backgroundColor: `var(--gris-claro)` }}>
      <NeuronCanvas themeSettings={appData.themeSettings} />

      {!user ? (
        <LoginPage handleLogin={onLogin} />
      ) : (
        <MainLayout handleLogout={onLogout} />
      )}

      <CustomAlertDialog
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <CustomConfirmDialog
        message={confirm.message}
        isOpen={confirm.isOpen}
        onConfirm={() => { if (confirm.onConfirm) confirm.onConfirm(); setConfirm({ ...confirm, isOpen: false }); }}
        onClose={() => setConfirm({ ...confirm, isOpen: false })}
      />
      <ImportantNoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />
    </div>
  );
}
