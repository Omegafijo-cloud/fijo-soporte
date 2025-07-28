'use client';

import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

import PlantillasGenericasTab from '@/components/tabs/PlantillasGenericasTab';
import PlantillasQuejasTab from '@/components/tabs/PlantillasQuejasTab';
import MemosWfTab from '@/components/tabs/MemosWfTab';
import MemosOrdenTab from '@/components/tabs/MemosOrdenTab';
import HerramientasTab from '@/components/tabs/HerramientasTab';
import TransferenciasTab from '@/components/tabs/TransferenciasTab';
import FloatingWidgets from '@/components/FloatingWidgets';
import NeuralNetworkAnimation from '@/components/NeuralNetworkAnimation';
import { Progress } from '@/components/ui/progress';

// Tipos para el estado
type AppState = {
  backupText?: string;
  activeTab?: string;
  activeSubTab?: string;
  notesText?: string;
  usersText?: string;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isInitialLoad = useRef(true);

  // Estados Centralizados
  const [backupText, setBackupText] = useState('');
  const [activeTab, setActiveTab] = useState('plantillas');
  const [activeSubTab, setActiveSubTab] = useState('genericas');
  const [notesText, setNotesText] = useState('');
  const [usersText, setUsersText] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ----- Lógica de persistencia de datos -----

  const getAppState = useCallback((): AppState => {
    return {
      backupText,
      activeTab,
      activeSubTab,
      notesText,
      usersText,
    };
  }, [backupText, activeTab, activeSubTab, notesText, usersText]);

  const saveStateToFirebase = useCallback(async () => {
    if (!user || !isDataLoaded) return;
    const appState = getAppState();
    try {
      await setDoc(doc(db, 'users', user.uid, 'state', 'appState'), appState, { merge: true });
    } catch (error) {
      console.error("Error saving state to Firebase:", error);
      toast({
        title: 'Error de Guardado',
        description: 'No se pudo guardar el estado de la aplicación.',
        variant: 'destructive',
      });
    }
  }, [user, getAppState, isDataLoaded, toast]);
  
  // Debounce para el guardado
  useEffect(() => {
    if (isInitialLoad.current || !isDataLoaded) return;
    const handler = setTimeout(() => {
      saveStateToFirebase();
    }, 1500); // Guardar 1.5s después del último cambio
    return () => clearTimeout(handler);
  }, [saveStateToFirebase, isDataLoaded, backupText, activeTab, activeSubTab, notesText, usersText]);


  // Cargar estado desde Firebase
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid, 'state', 'appState'), (docSnap) => {
        if (docSnap.exists() && isInitialLoad.current) {
          const data = docSnap.data() as AppState;
          if (data.backupText) setBackupText(data.backupText);
          if (data.activeTab) setActiveTab(data.activeTab);
          if (data.activeSubTab) setActiveSubTab(data.activeSubTab);
          if (data.notesText) setNotesText(data.notesText);
          if (data.usersText) setUsersText(data.usersText);
          
          isInitialLoad.current = false;
        } else if (!docSnap.exists()) {
             isInitialLoad.current = false;
        }
        setIsDataLoaded(true);
      });
      return () => unsub();
    } else {
        // Si no hay usuario, marcamos la carga como completa para que la redirección pueda ocurrir.
        if (!authLoading) {
            setIsDataLoaded(true);
        }
    }
  }, [user, authLoading]);

  // Redireccionar si el usuario no está autenticado después de la carga
  useEffect(() => {
    if (authLoading || !isDataLoaded) return; // Espera a que la carga inicial termine
    if (!user) {
      router.push('/');
    }
  }, [authLoading, user, isDataLoaded, router]);


  // ----- Manejadores y otros -----

  const handleLogout = async () => {
    await saveStateToFirebase(); // Guardar el estado final antes de salir
    await signOut(auth);
    router.push('/');
  };

  const handleCopyBackup = () => {
    if (!backupText) return;
    navigator.clipboard.writeText(backupText);
    toast({
      title: 'Copia de Respaldo Copiada',
      description: 'El contenido ha sido copiado al portapapeles.',
    });
  };

  const handleClearBackup = () => {
    setBackupText('');
  };

  useEffect(() => {
    if (authLoading || !isDataLoaded) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [authLoading, isDataLoaded]);

  if (authLoading || !isDataLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-center gap-4">
            <NeuralNetworkAnimation width={50} height={50} />
            <h1 className="text-2xl font-bold">OMEGA</h1>
          </div>
          <p className="text-center text-muted-foreground">Cargando tu espacio de trabajo...</p>
          <Progress value={loadingProgress} className="w-full" />
        </div>
      </div>
    );
  }
  
  if (!user) return null; // Previene el renderizado del dashboard si no hay usuario

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
           <NeuralNetworkAnimation width={40} height={40} />
          <h1 className="text-xl font-bold">OMEGA - FIJO SOPORTE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">00:00:00</div>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Salir
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="plantillas">PLANTILLAS</TabsTrigger>
            <TabsTrigger value="herramientas">HERRAMIENTAS</TabsTrigger>
            <TabsTrigger value="transferencias">TRANSFERENCIAS</TabsTrigger>
            <TabsTrigger value="avisos">AVISOS</TabsTrigger>
            <TabsTrigger value="respaldo">COPIA DE RESPALDO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plantillas" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
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
            <HerramientasTab />
          </TabsContent>
          
          <TabsContent value="transferencias" className="mt-4">
            <TransferenciasTab />
          </TabsContent>

          <TabsContent value="avisos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Avisos Importantes</CardTitle>
                <CardDescription>Documentos importantes y recursos operativos de acceso rápido.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">PROCESOS DE MIGRACIÓN (WF)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <iframe 
                      src="https://docs.google.com/document/d/e/2PACX-1vR-y_zq_xO0qA1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_1/pub?embedded=true" 
                      className="w-full h-96 border rounded-md"
                      title="Procesos de Migración"
                    ></iframe>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEGUIMIENTO DE CASOS (DOC)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <iframe 
                      src="https://docs.google.com/document/d/e/2PACX-1vR-y_zq_xO0qA1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_1Z0Z_2/pub?embedded=true"
                      className="w-full h-96 border rounded-md"
                      title="Seguimiento de Casos"
                    ></iframe>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="respaldo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Copia de Respaldo</CardTitle>
                <CardDescription>Almacena copias de seguridad de texto importante. El contenido se borra al cerrar sesión.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Pegue aquí el texto que desea respaldar..." 
                  rows={20}
                  value={backupText}
                  onChange={(e) => setBackupText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCopyBackup}>Copiar Respaldo</Button>
                  <Button variant="outline" onClick={handleClearBackup}>Limpiar Respaldo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <FloatingWidgets 
        notesText={notesText}
        setNotesText={setNotesText}
        usersText={usersText}
        setUsersText={setUsersText}
      />

      <footer className="p-4 text-center text-xs text-muted-foreground">
        Desarrollado por: Keiner Valera
      </footer>
    </div>
  );
}
