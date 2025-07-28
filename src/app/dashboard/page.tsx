'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PlantillasGenericasTab from '@/components/tabs/PlantillasGenericasTab';
import PlantillasQuejasTab from '@/components/tabs/PlantillasQuejasTab';
import MemosWfTab from '@/components/tabs/MemosWfTab';
import MemosOrdenTab from '@/components/tabs/MemosOrdenTab';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    // This will be handled by the AuthContext and router logic, so we can return null
    // or a redirect component. For now, let's prevent rendering if no user.
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Barra Superior Fija */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
           <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
            <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary))" strokeWidth="5" fill="none"/>
            <circle cx="50" cy="50" r="30" fill="hsl(var(--primary) / 0.1)"/>
            <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(-30 50 50)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="3" fill="none"/>
            <ellipse cx="50" cy="50" rx="40" ry="20" transform="rotate(30 50 50)" stroke="hsl(var(--primary) / 0.7)" strokeWidth="3" fill="none"/>
            <circle cx="50" cy="50" r="8" fill="hsl(var(--primary))"/>
          </svg>
          <h1 className="text-xl font-bold">OMEGA - FIJO SOPORTE</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Placeholder para el temporizador */}
          <div className="text-sm font-medium">00:00:00</div>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Salir
          </Button>
        </div>
      </header>

      {/* Contenido Principal con Pestañas */}
      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="plantillas" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="plantillas">PLANTILLAS</TabsTrigger>
            <TabsTrigger value="herramientas">HERRAMIENTAS</TabsTrigger>
            <TabsTrigger value="transferencias">TRANSFERENCIAS</TabsTrigger>
            <TabsTrigger value="avisos">AVISOS</TabsTrigger>
            <TabsTrigger value="respaldo">COPIA DE RESPALDO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plantillas" className="mt-4">
            <Card>
              <CardContent className="p-0"> {/* Changed padding to 0 to allow full-width tabs */}
                <Tabs defaultValue="genericas" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-t-lg rounded-b-none">
                    <TabsTrigger value="genericas">PLANTILLAS GENERICAS</TabsTrigger>
                    <TabsTrigger value="quejas">PLANTILLAS DE QUEJAS</TabsTrigger>
                    <TabsTrigger value="wf">MEMOS DE WF</TabsTrigger>
                    <TabsTrigger value="orden">MEMOS DE ORDEN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="genericas" className="p-6">
                    <PlantillasGenericasTab />
                  </TabsContent>
                  <TabsContent value="quejas" className="p-6">
                    <PlantillasQuejasTab />
                  </TabsContent>
                  <TabsContent value="wf" className="p-6">
                    <MemosWfTab />
                  </TabsContent>
                  <TabsContent value="orden" className="p-6">
                    <MemosOrdenTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="herramientas" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Herramientas</CardTitle>
                <CardDescription>Utilidades para optimizar el trabajo.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Aquí irá la Calculadora TMO y otras herramientas.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transferencias" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transferencias</CardTitle>
                <CardDescription>Gestión de destinos de transferencia.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Aquí irá la lista de transferencias predefinidas y personalizadas.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avisos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Avisos</CardTitle>
                <CardDescription>Documentos importantes y recursos operativos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Aquí irán los visores de documentos.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="respaldo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Copia de Respaldo</CardTitle>
                <CardDescription>Almacena copias de seguridad de texto importante.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Aquí irá el área de texto para la copia de respaldo.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Placeholder para la firma del desarrollador */}
      <footer className="p-4 text-center text-xs text-muted-foreground">
        Desarrollado por: Keiner Valera
      </footer>
    </div>
  );
}
