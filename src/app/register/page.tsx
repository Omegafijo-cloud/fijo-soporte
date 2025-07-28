'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import NeuralNetworkAnimation from '@/components/NeuralNetworkAnimation';
import OmegaLogo from '@/components/OmegaLogo';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const allowedDomain = '@omega.com';

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.endsWith(allowedDomain)) {
      setError(`Solo se permiten correos con el dominio ${allowedDomain}.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este correo electrónico ya está en uso.');
          break;
        case 'auth/invalid-email':
          setError('El formato del correo electrónico no es válido.');
          break;
        case 'auth/weak-password':
          setError('La contraseña es demasiado débil.');
          break;
        default:
          setError('Ocurrió un error al intentar registrar la cuenta.');
      }
      setLoading(false);
    }
  };

  if (authLoading || user) {
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              OMEGA - FIJO SOPORTE
            </h1>
        </div>
        <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
             <div className="flex items-center justify-center gap-4">
               <OmegaLogo className="h-10 w-10" />
               <CardTitle className="text-3xl font-bold">Crear una cuenta</CardTitle>
            </div>
            <CardDescription className="text-center text-lg pt-2">
              Únete a Omega para empezar a trabajar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`tu-usuario${allowedDomain}`}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input 
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        required
                    />
                </div>

                <Button 
                    type="submit"
                    className="w-full h-12 text-lg font-bold"
                    disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
                {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/" className="font-semibold text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
