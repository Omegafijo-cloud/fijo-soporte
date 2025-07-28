'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

const ALLOWED_DOMAINS = ['unireformada.edu.co', 'aliados.claro.com.gt', 'atlanticqi.com'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        if (userEmail) {
          const domain = userEmail.split('@')[1];
          if (ALLOWED_DOMAINS.includes(domain)) {
            setUser(user);
            // Ensure user document exists
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    createdAt: new Date(),
                });
                // Create the state subcollection document too
                await setDoc(doc(db, 'users', user.uid, 'state', 'appState'), {});
            }
          } else {
            // Domain not allowed, sign out user
            await signOut(auth);
            setUser(null);
            console.warn(`User with unauthorized domain ${domain} attempted to sign in.`);
          }
        } else {
          // No email associated with the account
           await signOut(auth);
           setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
