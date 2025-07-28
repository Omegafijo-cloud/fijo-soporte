'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) {
    return null; // O un spinner de carga
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">¡Bienvenido!</CardTitle>
          <CardDescription className="text-center text-lg">
            Sesión iniciada como: {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} className="w-full h-12 text-lg font-bold" variant="destructive">
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
