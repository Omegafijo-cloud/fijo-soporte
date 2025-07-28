'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    console.log('Email:', email, 'Password:', password);
    alert('Inicio de sesión no implementado. Revisa la consola para ver los datos.');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16">
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary))" strokeWidth="5" fill="none"/>
            <circle cx="50" cy="50" r="30" fill="hsl(var(--primary) / 0.1)"/>
            <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(-30 50 50)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="3" fill="none"/>
            <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(30 50 50)" stroke="hsl(var(--primary) / 0.7)" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="8" fill="hsl(var(--primary))"/>
          </svg>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            OMEGA - FIJO SOPORTE
          </h1>
        </div>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Iniciar Sesión</CardTitle>
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
            <Button type="submit" className="w-full h-12 text-lg font-bold">
              Acceder
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Solo los usuarios autorizados pueden iniciar sesión.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}