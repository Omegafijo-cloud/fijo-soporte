'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NeuralNetworkAnimation from '@/components/NeuralNetworkAnimation';
import OmegaLogo from '@/components/OmegaLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Credenciales inválidas. Por favor, revise su correo y contraseña.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico no es válido.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión.');
      }
    }
  };

  if (loading || user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <p>Verificando sesión...</p>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
       <div className="absolute inset-0 z-0">
         <NeuralNetworkAnimation />
       </div>
       <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
             <OmegaLogo className="h-16 w-16 text-white" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              OMEGA - FIJO SOPORTE
            </h1>
          </div>
        </div>
        <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Omega iniciar sesión</CardTitle>
            <CardDescription className="text-center text-lg">
              Accede a tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-lg"
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg font-bold">
                Acceder
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Solo los usuarios autorizados pueden iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
