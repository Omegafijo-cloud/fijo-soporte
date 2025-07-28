// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { FirebaseProvider } from '../context/FirebaseContext';
import { AppStateProvider } from '../context/AppStateContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OMEGA - FIJO SOPORTE (Versión Corporativa)',
  description: 'Herramienta integral de soporte técnico',
};

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
