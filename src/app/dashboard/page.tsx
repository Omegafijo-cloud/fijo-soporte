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
import { Trash2 } from 'lucide-react';

import PlantillasGenericasTab from '@/components/tabs/PlantillasGenericasTab';
import PlantillasQuejasTab from '@/components/tabs/PlantillasQuejasTab';
import MemosWfTab from '@/components/tabs/MemosWfTab';
import MemosOrdenTab from '@/components/tabs/MemosOrdenTab';
import HerramientasTab from '@/components/tabs/HerramientasTab';
import TransferenciasTab from '@/components/tabs/TransferenciasTab';
import FloatingWidgets from '@/components/FloatingWidgets';
import { Progress } from '@/components/ui/progress';
import Timer from '@/components/Timer';
import OmegaLogo from '@/components/OmegaLogo';

// --- Tipos de Estado ---

type Notice = {
  id: number;
  title: string;
  url: string;
};

type CheckboxState = {
  [group: string]: { [label: string]: boolean };
};

type TransferItem = {
  service: string;
  value: string;
  isCustom?: boolean;
};

type MemoTemplate = {
  [key: string]: {
    fields: any[];
    checkboxes?: any;
  }
}

// Tipos para el estado global de la aplicación
type AppState = {
  activeTab?: string;
  activeSubTab?: string;
  
  // Respaldo y Widgets
  backupText?: string;
  notesText?: string;
  usersText?: string;

  // Avisos
  notices?: Notice[];

  // Estado de Pestañas
  plantillasGenericas_formData?: any;
  plantillasGenericas_checkboxes?: CheckboxState;
  plantillasGenericas_pruebasRealizadas?: string;

  plantillasQuejas_selectedTemplate?: string;
  plantillasQuejas_formData?: any;
  plantillasQuejas_checkboxValues?: CheckboxState;
  plantillasQuejas_pruebasCheckboxes?: CheckboxState;
  plantillasQuejas_pruebasRealizadas?: string;

  memosWf_templates?: MemoTemplate;
  memosWf_selectedTemplate?: string;
  memosWf_formData?: any;

  memosOrden_templates?: MemoTemplate;
  memosOrden_selectedTemplate?: string;
  memosOrden_formData?: any;
  
  herramientas_minutos?: string;

  transferencias_items?: TransferItem[];
  transferencias_newService?: string;
  transferencias_newValue?: string;
};


// --- Estados Iniciales ---

const initialNotices: Notice[] = [
  { 
    id: 1, 
    title: 'PROCESOS DE MIGRACIÓN (WF)', 
    url: 'https://docs.google.com/document/d/1wRIr2nK1L9_s1g_j_9J8F_8n_k6lV_Z5t3bV5z6X7C/edit' 
  },
  { 
    id: 2, 
    title: 'SEGUIMIENTO DE CASOS (DOC)', 
    url: 'https://docs.google.com/document/d/1Xy_Z-v_z_6kG_8s_k6L_v_Z5t3bV5z6X7C/edit'
  }
];

const initialPlantillasGenericasFormData = {
    idLlamada: '',
    nombreContacto: '',
    nIncidencia: '',
    inconveniente: '',
    tipoServicio: '',
};

const initialPlantillasGenericasCheckboxes: CheckboxState = {
    'Nivel Cero': { 'Saldos OK': false, 'No hay Fallas': false, 'No presenta bloqueo': false, 'No hay OS abiertas': false, 'No hay quejas': false },
    'GPON - ADSL - HFC': { 'Se verifica estado de las luces del router': false, 'Envio reset en UMP': false, 'Se Desconecta y Conecta Corriente': false, 'Se Desconecta y Conecta en otro tomacorriente': false, 'Se verifica Splitter': false, 'Cambio de baterías': false, 'Se verifica Coaxial bien apretado': false, 'Se verifica cortes o daños en la fibra': false, 'Se manda a realizar test de velocidad (00 Megas)': false, 'Se realiza Ping (0% perdido)': false, 'Estado de la ONT activo': false, 'Niveles SNR en Rojo': false, 'Luz LOS en ROJO': false, 'Se envia reboot en Axiros': false },
    'TV HFC - DTH - IPTV': { 'Se verifica Conexiones HDMI': false, 'Se Verifica Conexiones RCA': false, 'Se verifica cable Coaxial': false, 'XX Stb afectados': false, 'Se valida Serial No. XXXX': false, 'Mensaje que muestra Tv: XXX': false, 'Se Envia Comando XXXX': false, 'Se Envia Reset Fisico': false, 'Se verifica en la GUI, AMCO en verde': false },
    'Otros': { 'Se valida DPI ok, nombre completo ok, sin restricciones': false, 'Cliente no esta en Sitio': false, 'Cliente esta en Agencia': false, 'Cliente no quiere hacer pruebas': false, 'Se realiza cambio de contraseña con exito': false, 'Servicio funcionando de manera correcta': false, 'Se Genera Averia': false, 'Se envía reproceso': false },
};

const initialPlantillasQuejasCheckboxes: CheckboxState = {
  'Nivel Cero': { 'Saldos OK': false, 'No hay Fallas': false, 'No presenta bloqueo': false, 'No hay OS abiertas': false, 'No hay quejas': false },
  'GPON - ADSL - HFC': { 'Se verifica estado de las luces del router': false, 'Envio reset en UMP': false, 'Se Desconecta y Conecta Corriente': false, 'Se Desconecta y Conecta en otro tomacorriente': false, 'Se verifica Splitter': false, 'Cambio de baterías': false, 'Se verifica Coaxial bien apretado': false, 'Se verifica cortes o daños en la fibra': false, 'Se manda a realizar test de velocidad (00 Megas)': false, 'Se realiza Ping (0% perdido)': false, 'Estado de la ONT activo': false, 'Niveles SNR en Rojo': false, 'Luz LOS en ROJO': false, 'Se envia reboot en Axiros': false },
  'TV HFC - DTH - IPTV': { 'Se verifica Conexiones HDMI': false, 'Se Verifica Conexiones RCA': false, 'Se verifica cable Coaxial': false, 'XX Stb afectados': false, 'Se valida Serial No. XXXX': false, 'Mensaje que muestra Tv: XXX': false, 'Se Envia Comando XXXX': false, 'Se Envia Reset Fisico': false, 'Se verifica en la GUI, AMCO en verde': false },
  'Otros': { 'Se valida DPI ok, nombre completo ok, sin restricciones': false, 'Cliente no esta en Sitio': false, 'Cliente esta en Agencia': false, 'Cliente no quiere hacer pruebas': false, 'Se realiza cambio de contraseña con exito': false, 'Servicio funcionando de manera correcta': false, 'Se Genera Averia': false, 'Se envía reproceso': false },
};

const initialTransferItems: TransferItem[] = [
  { service: 'SERVICIO MOVIL', value: '123' },
  { service: 'COMERCIAL', value: '101' },
  { service: 'SOPORTE NIVEL 2', value: '103' },
];

const initialMemosWfTemplates: MemoTemplate = {
  'migracion gpon': {
    fields: [
      { id: 'tipoReporte', label: 'Tipo de reporte', type: 'text' },
      { id: 'aceptaMigracion', label: 'Acepta migración', type: 'text' },
      { id: 'facturaCon', label: 'Factura Con', type: 'text' },
      { id: 'titularServicio', label: 'Titular del servicio', type: 'text' },
      { id: 'contactoEnSitio', label: 'Contacto en sitio', type: 'text' },
      { id: 'noContacto', label: 'No. Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'horarioVisita', label: 'Horario de visita', type: 'text' },
      { id: 'comentario', label: 'Comentario', type: 'textarea' },
    ],
  },
  'inconvenientes con vpn': {
    fields: [
      { id: 'numeroServicio', label: 'NUMERO DE SERVICIO', type: 'text' },
      { id: 'tipoCpe', label: 'Tipo de CPE', type: 'text' },
      { id: 'macCableModem', label: 'MAC Cable Modem o CPE', type: 'text' },
      { id: 'problemaReportado', label: 'Problema reportado', type: 'text' },
      { id: 'nombreCliente', label: 'Nombre del cliente', type: 'text' },
      { id: 'telContacto', label: 'Tel Contacto', type: 'text' },
      { id: 'nombreVpn', label: 'Nombre completo herramienta o aplicativo de vpn', type: 'text' },
      { id: 'puertosUdpTcp', label: 'Puertos UDP y TCP que desee verificar', type: 'text' },
      { id: 'errorAplicativo', label: 'Numero o nombre de error que da el aplicativo', type: 'text' },
      { id: 'ipDestino', label: 'Si es VPN, hacía que IP intenta conectarse', type: 'text' },
      { id: 'macComputadora', label: 'MAC Address de la computadora', type: 'text' },
      { id: 'pruebasVpn', label: 'Pruebas(si se efectúan)', type: 'textarea' },
      { id: 'comentarioVpn', label: 'Comentario', type: 'textarea' },
    ],
  },
};

const initialMemosOrdenTemplates: MemoTemplate = {
  'cableado ethernet': {
    fields: [
      { id: 'asunto', label: 'ASUNTO', type: 'text' },
      { id: 'numeroServicio', label: 'NUMERO DE SERVICIO', type: 'text' },
      { id: 'nombreTitular', label: 'NOMBRE DE TITULAR', type: 'text' },
      { id: 'dpiTitular', label: 'DPI TITULAR', type: 'text' },
      { id: 'telefonoReferencia', label: 'TELEFONO REFERENCIA', type: 'text' },
      { id: 'direccionInstalacion', label: 'DIRECCIÓN INSTALACIÓN', type: 'text' },
      { id: 'horarioVisita', label: 'HORARIO DE VISITA', type: 'text' },
      { id: 'observaciones', label: 'OBSERVACIONES', type: 'textarea' },
      { id: 'tiendaCallCenter', label: 'TIENDA / CALL CENTER', type: 'text' },
    ],
  },
  'orden de repetidores': {
    fields: [
       { id: 'asunto', label: 'ASUNTO', type: 'text' },
      { id: 'numeroServicio', label: 'NUMERO DE SERVICIO', type: 'text' },
      { id: 'nombreTitular', label: 'NOMBRE DE TITULAR', type: 'text' },
      { id: 'dpiTitular', label: 'DPI TITULAR', type: 'text' },
      { id: 'telefonoReferencia', label: 'TELEFONO REFERENCIA', type: 'text' },
      { id: 'direccionInstalacion', label: 'DIRECCIÓN INSTALACIÓN', type: 'text' },
      { id: 'horarioVisita', label: 'HORARIO DE VISITA', type: 'text' },
      { id: 'observaciones', label: 'OBSERVACIONES', type: 'textarea' },
      { id: 'tiendaCallCenter', label: 'TIENDA / CALL CENTER', type: 'text' },
    ],
  },
};


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isInitialLoad = useRef(true);

  // --- Estados Centralizados ---
  const [activeTab, setActiveTab] = useState('plantillas');
  const [activeSubTab, setActiveSubTab] = useState('genericas');
  const [backupText, setBackupText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [usersText, setUsersText] = useState('');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Estado para Plantillas Genéricas
  const [plantillasGenericasFormData, setPlantillasGenericasFormData] = useState(initialPlantillasGenericasFormData);
  const [plantillasGenericasCheckboxes, setPlantillasGenericasCheckboxes] = useState<CheckboxState>(initialPlantillasGenericasCheckboxes);
  const [plantillasGenericasPruebas, setPlantillasGenericasPruebas] = useState('');

  // Estado para Plantillas de Quejas
  const [plantillasQuejasSelectedTemplate, setPlantillasQuejasSelectedTemplate] = useState('');
  const [plantillasQuejasFormData, setPlantillasQuejasFormData] = useState({});
  const [plantillasQuejasCheckboxValues, setPlantillasQuejasCheckboxValues] = useState<CheckboxState>({});
  const [plantillasQuejasPruebasCheckboxes, setPlantillasQuejasPruebasCheckboxes] = useState<CheckboxState>(initialPlantillasQuejasCheckboxes);
  const [plantillasQuejasPruebas, setPlantillasQuejasPruebas] = useState('');
  
  // Estado para Memos WF
  const [memosWfTemplates, setMemosWfTemplates] = useState<MemoTemplate>(initialMemosWfTemplates);
  const [memosWfSelectedTemplate, setMemosWfSelectedTemplate] = useState('');
  const [memosWfFormData, setMemosWfFormData] = useState({});

  // Estado para Memos Orden
  const [memosOrdenTemplates, setMemosOrdenTemplates] = useState<MemoTemplate>(initialMemosOrdenTemplates);
  const [memosOrdenSelectedTemplate, setMemosOrdenSelectedTemplate] = useState('');
  const [memosOrdenFormData, setMemosOrdenFormData] = useState({});
  
  // Estado para Herramientas
  const [herramientasMinutos, setHerramientasMinutos] = useState('');
  
  // Estado para Transferencias
  const [transferenciasItems, setTransferenciasItems] = useState<TransferItem[]>(initialTransferItems);
  const [transferenciasNewService, setTransferenciasNewService] = useState('');
  const [transferenciasNewValue, setTransferenciasNewValue] = useState('');


  // ----- Lógica de persistencia de datos -----

  const getAppState = useCallback((): AppState => {
    return {
      activeTab, activeSubTab, backupText, notesText, usersText, notices,
      plantillasGenericas_formData: plantillasGenericasFormData,
      plantillasGenericas_checkboxes: plantillasGenericasCheckboxes,
      plantillasGenericas_pruebasRealizadas: plantillasGenericasPruebas,
      plantillasQuejas_selectedTemplate: plantillasQuejasSelectedTemplate,
      plantillasQuejas_formData: plantillasQuejasFormData,
      plantillasQuejas_checkboxValues: plantillasQuejasCheckboxValues,
      plantillasQuejas_pruebasCheckboxes: plantillasQuejasPruebasCheckboxes,
      plantillasQuejas_pruebasRealizadas: plantillasQuejasPruebas,
      memosWf_templates: memosWfTemplates,
      memosWf_selectedTemplate: memosWfSelectedTemplate,
      memosWf_formData: memosWfFormData,
      memosOrden_templates: memosOrdenTemplates,
      memosOrden_selectedTemplate: memosOrdenSelectedTemplate,
      memosOrden_formData: memosOrdenFormData,
      herramientas_minutos: herramientasMinutos,
      transferencias_items: transferenciasItems,
      transferencias_newService: transferenciasNewService,
      transferencias_newValue: transferenciasNewValue,
    };
  }, [
      activeTab, activeSubTab, backupText, notesText, usersText, notices,
      plantillasGenericasFormData, plantillasGenericasCheckboxes, plantillasGenericasPruebas,
      plantillasQuejasSelectedTemplate, plantillasQuejasFormData, plantillasQuejasCheckboxValues,
      plantillasQuejasPruebasCheckboxes, plantillasQuejasPruebas,
      memosWfTemplates, memosWfSelectedTemplate, memosWfFormData, 
      memosOrdenTemplates, memosOrdenSelectedTemplate, memosOrdenFormData,
      herramientasMinutos, transferenciasItems, transferenciasNewService, transferenciasNewValue
  ]);

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
    }, 1500);
    return () => clearTimeout(handler);
  }, [saveStateToFirebase, isDataLoaded, getAppState]);


  // Cargar estado desde Firebase
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid, 'state', 'appState'), (docSnap) => {
        if (docSnap.exists() && isInitialLoad.current) {
          const data = docSnap.data() as AppState;
          // Cargar estado general
          if (data.activeTab) setActiveTab(data.activeTab);
          if (data.activeSubTab) setActiveSubTab(data.activeSubTab);
          if (data.backupText) setBackupText(data.backupText);
          if (data.notesText) setNotesText(data.notesText);
          if (data.usersText) setUsersText(data.usersText);
          if (data.notices) setNotices(data.notices);

          // Cargar estado de pestañas
          if (data.plantillasGenericas_formData) setPlantillasGenericasFormData(data.plantillasGenericas_formData);
          if (data.plantillasGenericas_checkboxes) setPlantillasGenericasCheckboxes(data.plantillasGenericas_checkboxes);
          if (data.plantillasGenericas_pruebasRealizadas) setPlantillasGenericasPruebas(data.plantillasGenericas_pruebasRealizadas);

          if(data.plantillasQuejas_selectedTemplate) setPlantillasQuejasSelectedTemplate(data.plantillasQuejas_selectedTemplate);
          if(data.plantillasQuejas_formData) setPlantillasQuejasFormData(data.plantillasQuejas_formData);
          if(data.plantillasQuejas_checkboxValues) setPlantillasQuejasCheckboxValues(data.plantillasQuejas_checkboxValues);
          if(data.plantillasQuejas_pruebasCheckboxes) setPlantillasQuejasPruebasCheckboxes(data.plantillasQuejas_pruebasCheckboxes);
          if(data.plantillasQuejas_pruebasRealizadas) setPlantillasQuejasPruebas(data.plantillasQuejas_pruebasRealizadas);
          
          if(data.memosWf_templates) setMemosWfTemplates(data.memosWf_templates);
          if(data.memosWf_selectedTemplate) setMemosWfSelectedTemplate(data.memosWf_selectedTemplate);
          if(data.memosWf_formData) setMemosWfFormData(data.memosWf_formData);
          
          if(data.memosOrden_templates) setMemosOrdenTemplates(data.memosOrden_templates);
          if(data.memosOrden_selectedTemplate) setMemosOrdenSelectedTemplate(data.memosOrden_selectedTemplate);
          if(data.memosOrden_formData) setMemosOrdenFormData(data.memosOrden_formData);

          if(data.herramientas_minutos) setHerramientasMinutos(data.herramientas_minutos);

          if(data.transferencias_items) setTransferenciasItems(data.transferencias_items);
          if(data.transferencias_newService) setTransferenciasNewService(data.transferencias_newService);
          if(data.transferencias_newValue) setTransferenciasNewValue(data.transferencias_newValue);
          
          isInitialLoad.current = false;
        } else if (!docSnap.exists()) {
             isInitialLoad.current = false;
        }
        setIsDataLoaded(true);
      });
      return () => unsub();
    } else {
        if (!authLoading) {
            setIsDataLoaded(true);
        }
    }
  }, [user, authLoading]);

  // Redireccionar si el usuario no está autenticado después de la carga
  useEffect(() => {
    if (authLoading || !isDataLoaded) return;
    if (!user) {
      router.push('/');
    }
  }, [authLoading, user, isDataLoaded, router]);


  // ----- Manejadores y otros -----

  const handleLogout = async () => {
    await saveStateToFirebase(); 
    await signOut(auth);
    router.push('/');
  };
  
    const formatUserName = (email: string | null | undefined): string => {
    if (!email) return '';
    const namePart = email.split('@')[0];
    const names = namePart.split('.');
    return names
      .map(name => name.charAt(0).toUpperCase() + name.slice(1))
      .join(' ');
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
  
  const handleDeleteNotice = (id: number) => {
    setNotices(prevNotices => prevNotices.filter(notice => notice.id !== id));
    toast({
      title: 'Aviso Eliminado',
      description: 'El aviso ha sido eliminado de la lista.',
    })
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
            <OmegaLogo className="w-12 h-12" />
            <h1 className="text-2xl font-bold">OMEGA</h1>
          </div>
          <p className="text-center text-muted-foreground">Cargando tu espacio de trabajo...</p>
          <Progress value={loadingProgress} className="w-full" />
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
           <OmegaLogo className="h-8 w-8" />
          <h1 className="text-xl font-bold">OMEGA - FIJO SOPORTE</h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium">{formatUserName(user.email)}</span>
          <Timer />
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
                    <PlantillasGenericasTab 
                        backupText={backupText}
                        setBackupText={setBackupText}
                        formData={plantillasGenericasFormData}
                        setFormData={setPlantillasGenericasFormData}
                        checkboxes={plantillasGenericasCheckboxes}
                        setCheckboxes={setPlantillasGenericasCheckboxes}
                        pruebasRealizadas={plantillasGenericasPruebas}
                        setPruebasRealizadas={setPlantillasGenericasPruebas}
                        initialCheckboxes={initialPlantillasGenericasCheckboxes}
                        initialFormData={initialPlantillasGenericasFormData}
                    />
                  </TabsContent>
                  <TabsContent value="quejas" className="p-6">
                    <PlantillasQuejasTab 
                        selectedTemplate={plantillasQuejasSelectedTemplate}
                        setSelectedTemplate={setPlantillasQuejasSelectedTemplate}
                        formData={plantillasQuejasFormData}
                        setFormData={setPlantillasQuejasFormData}
                        checkboxValues={plantillasQuejasCheckboxValues}
                        setCheckboxValues={setPlantillasQuejasCheckboxValues}
                        pruebasCheckboxes={plantillasQuejasPruebasCheckboxes}
                        setPruebasCheckboxes={setPlantillasQuejasPruebasCheckboxes}
                        pruebasRealizadas={plantillasQuejasPruebas}
                        setPruebasRealizadas={setPlantillasQuejasPruebas}
                        initialPruebasCheckboxState={initialPlantillasQuejasCheckboxes}
                    />
                  </TabsContent>
                  <TabsContent value="wf" className="p-6">
                    <MemosWfTab 
                      templates={memosWfTemplates}
                      setTemplates={setMemosWfTemplates}
                      selectedTemplate={memosWfSelectedTemplate}
                      setSelectedTemplate={setMemosWfSelectedTemplate}
                      formData={memosWfFormData}
                      setFormData={setMemosWfFormData}
                    />
                  </TabsContent>
                  <TabsContent value="orden" className="p-6">
                    <MemosOrdenTab 
                       templates={memosOrdenTemplates}
                       setTemplates={setMemosOrdenTemplates}
                       selectedTemplate={memosOrdenSelectedTemplate}
                       setSelectedTemplate={setMemosOrdenSelectedTemplate}
                       formData={memosOrdenFormData}
                       setFormData={setMemosOrdenFormData}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="herramientas" className="mt-4">
            <HerramientasTab 
              minutos={herramientasMinutos}
              setMinutos={setHerramientasMinutos}
            />
          </TabsContent>
          
          <TabsContent value="transferencias" className="mt-4">
            <TransferenciasTab 
               transferItems={transferenciasItems}
               setTransferItems={setTransferenciasItems}
               newService={transferenciasNewService}
               setNewService={setTransferenciasNewService}
               newValue={transferenciasNewValue}
               setNewValue={setNewValue}
            />
          </TabsContent>

          <TabsContent value="avisos" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Avisos Importantes</CardTitle>
                <CardDescription>Documentos importantes y recursos operativos de acceso rápido.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <Card key={notice.id}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <iframe 
                          src={notice.url}
                          className="w-full h-96 border rounded-md"
                          title={notice.title}
                        ></iframe>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No hay avisos para mostrar.</p>
                )}
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
