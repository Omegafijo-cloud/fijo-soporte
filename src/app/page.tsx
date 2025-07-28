'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithPopup, OAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NeuralNetworkAnimation from '@/components/NeuralNetworkAnimation';
import OmegaLogo from '@/components/OmegaLogo';

const ALLOWED_DOMAINS = ['unireformada.edu.co', 'aliados.claro.com.gt', 'atlanticqi.com'];

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loadingMicrosoft, setLoadingMicrosoft] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleMicrosoftSignIn = async () => {
    setLoadingMicrosoft(true);
    setError(null);
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
        // Optional: prompt=select_account forces account selection
        prompt: 'select_account',
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      if (!userEmail) {
        throw new Error("No se pudo obtener el correo del usuario.");
      }
      
      const domain = userEmail.split('@')[1];
      if (!ALLOWED_DOMAINS.includes(domain)) {
        await signOut(auth);
        setError(`El dominio '${domain}' no está autorizado para acceder a esta aplicación.`);
        setLoadingMicrosoft(false);
        return;
      }
      
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Ya existe una cuenta con el mismo correo electrónico pero con un método de inicio de sesión diferente.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('El proceso de inicio de sesión fue cancelado.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión con Microsoft.');
      }
    } finally {
        setLoadingMicrosoft(false);
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
               <CardTitle className="text-3xl font-bold">Omega iniciar sesión</CardTitle>
            </div>
            <CardDescription className="text-center text-lg pt-2">
              Accede con tu cuenta de Microsoft
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                <Button 
                    onClick={handleMicrosoftSignIn} 
                    className="w-full h-12 text-lg font-bold"
                    disabled={loadingMicrosoft}
                >
                  {loadingMicrosoft ? 'Iniciando...' : 'Iniciar sesión con Microsoft'}
                </Button>
                {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Solo los usuarios con dominios autorizados pueden iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
