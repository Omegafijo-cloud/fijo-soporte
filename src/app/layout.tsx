// app/layout.js
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { FirebaseProvider } from '../context/FirebaseContext';
import { AppStateProvider } from '../context/AppStateContext';

const inter = Inter({ subsets: ['latin'] });

// Since we are using Context Providers, this layout needs to be a client component.
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppStateProvider>
          <FirebaseProvider>
            {children}
          </FirebaseProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
