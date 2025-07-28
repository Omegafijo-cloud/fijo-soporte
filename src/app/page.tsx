// app/page.js
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

  // Since FirebaseProvider is now a child, it might not be ready on first render.
  const { user, isAuthReady, handleLogin } = firebaseContext || {};
  const { appData, alert, setAlert, confirm, setConfirm, noticeModalOpen, setNoticeModalOpen } = appStateContext || {};

  // Set CSS variables for theme on initial load and when themeSettings change
  useEffect(() => {
    if (appData?.themeSettings) {
      Object.keys(appData.themeSettings).forEach(varName => {
        document.documentElement.style.setProperty(varName, appData.themeSettings[varName]);
      });
    }
  }, [appData?.themeSettings]);

  if (!isAuthReady || !appStateContext) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-roboto" style={{ backgroundColor: `var(--gris-claro)` }}>
      <NeuronCanvas themeSettings={appData.themeSettings} />

      {!user ? (
        <LoginPage handleLogin={handleLogin} setAlert={setAlert} />
      ) : (
        <MainLayout />
      )}

      <CustomAlertDialog
        message={alert.message}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
      <CustomConfirmDialog
        message={confirm.message}
        isOpen={confirm.isOpen}
        onConfirm={() => { confirm.onConfirm(); setConfirm({ ...confirm, isOpen: false }); }}
        onClose={() => setConfirm({ ...confirm, isOpen: false })}
      />
      <ImportantNoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />
    </div>
  );
}
