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
import { doc, setDoc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';
import 'intro.js/introjs.css';
import introJs from 'intro.js';

import PlantillasGenericasTab from '@/components/tabs/PlantillasGenericasTab';
import PlantillasQuejasTab from '@/components/tabs/PlantillasQuejasTab';
import MemosWfTab from '@/components/tabs/MemosWfTab';
import MemosOrdenTab from '@/components/tabs/MemosOrdenTab';
import HerramientasTab from '@/components/tabs/HerramientasTab';
import TransferenciasTab from '@/components/tabs/TransferenciasTab';
import ArchivosTab from '@/components/tabs/ArchivosTab';
import FloatingWidgets from '@/components/FloatingWidgets';
import { Progress } from '@/components/ui/progress';
import Timer from '@/components/Timer';
import OmegaLogo from '@/components/OmegaLogo';
import NeuralNetworkAnimation from '@/components/NeuralNetworkAnimation';

// --- Tipos de Estado ---

type Notice = {
  id: number;
  title: string;
  url: string;
};

type CheckboxState = {
  [group: string]: { [label: string]: boolean };
};

type CheckboxConfig = {
    [group: string]: { [oldLabel: string]: string };
};

type TransferItem = {
  service: string;
  value: string;
  isCustom?: boolean;
};

type TemplateField = {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  defaultValue?: string;
};

type TemplateCheckboxGroup = {
  [group: string]: string[];
};

type TemplateRadioGroup = {
  [group: string]: string[];
};

type BaseTemplate = {
  fields: TemplateField[];
  checkboxes?: TemplateCheckboxGroup;
  radioGroups?: TemplateRadioGroup;
};

type MemoTemplate = {
  [key: string]: BaseTemplate;
}

type ArchivoItem = {
  id: string;
  title: string;
  content: string;
};

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
  
  // Tutorial
  tutorialCompleted?: boolean;

  // Estado de Pestañas
  plantillasGenericas_formData?: any;
  plantillasGenericas_checkboxes?: CheckboxState;
  plantillasGenericas_checkboxConfig?: CheckboxConfig;
  plantillasGenericas_pruebasRealizadas?: string;
  plantillasGenericas_orderedPruebas?: string[];

  plantillasQuejas_templates?: MemoTemplate;
  plantillasQuejas_selectedTemplate?: string;
  plantillasQuejas_formData?: any;
  plantillasQuejas_checkboxValues?: CheckboxState;
  plantillasQuejas_pruebasCheckboxes?: CheckboxState;
  plantillasQuejas_checkboxConfig?: CheckboxConfig;
  plantillasQuejas_pruebasRealizadas?: string;
  plantillasQuejas_orderedPruebas?: string[];

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
  
  archivos_items?: ArchivoItem[];
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

const initialPlantillasQuejasTemplates: MemoTemplate = {
  'INTERNET DSL': {
    fields: [
      { id: 'snr', label: 'SNR', type: 'textarea' },
      { id: 'velocidadCurrent', label: 'Velocidad Current igual a Pisa', type: 'text' },
      { id: 'problemaReportado', label: 'Problema Reportado', type: 'textarea' },
      { id: 'contactoEnSitio', label: 'Contacto En Sitio', type: 'text' },
      { id: 'telContacto', label: 'Tel Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    },
    radioGroups: {
      'Luz Portadora': ['Fija', 'Apagada', 'Intermitente'],
      'Luz Internet': ['Fija', 'Apagada', 'Intermitente'],
      'Estado del Puerto': ['UP', 'DOWN', 'DORMANT'],
      'Estatus de niveles': ['Correctos', 'Erroneos'],
      'Canal dañado': ['Datos', 'Voz', 'Todos'],
    }
  },
  'TV DTH': {
    fields: [
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'noTvsAfectados', label: 'No. Tvs Afectados', type: 'text' },
      { id: 'serieStb', label: 'Serie STB', type: 'text' },
      { id: 'smartCard', label: 'Smart Card', type: 'text' },
      { id: 'modeloStb', label: 'Modelo STB', type: 'text' },
      { id: 'mensajeMuestraTv', label: 'Mensaje Que Muestra Tv', type: 'text' },
      { id: 'contactoEnSitio', label: 'Contacto En Sitio', type: 'text' },
      { id: 'telContacto', label: 'Tel. Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
     checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    }
  },
   'TV HFC': {
    fields: [
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'noTvsAfectados', label: 'No. Tvs Afectados', type: 'text' },
      { id: 'noSerieStb', label: 'No. Serie Stb', type: 'text' },
      { id: 'mensajeMuestraTv', label: 'Mensaje Que Muestra Tv', type: 'text' },
      { id: 'contactoEnSitio', label: 'Contacto En Sitio', type: 'text' },
      { id: 'telContacto', label: 'Tel. Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    },
  },
  'INTERNET HFC/LINEA': {
    fields: [
      { id: 'nivelesSenal', label: 'Niveles De Señal', type: 'text' },
      { id: 'nivelesRuido', label: 'Niveles De Ruido', type: 'text' },
      { id: 'macAddress', label: 'Mac Address', type: 'text' },
      { id: 'problemaReportado', label: 'Problema Reportado', type: 'textarea' },
      { id: 'contactoEnSitio', label: 'Contacto En Sitio', type: 'text' },
      { id: 'telContacto', label: 'Tel. Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    },
    radioGroups: {
      'Estado del Puerto': ['UP', 'DOWN', 'DORMANT'],
      'Luz portadora': ['fija', 'intermitente', 'apagada'],
      'Luz online': ['fija', 'intermitente', 'apagada'],
      'Estatus de niveles': ['Correctos', 'Erroneos'],
    },
  },
  'LINEA FIJA': {
    fields: [
      { id: 'alLevantarAuricular', label: 'Al Levantar El Auricular', type: 'text' },
      { id: 'cuandoLeLlaman', label: 'Cuando Le Llaman', type: 'text' },
      { id: 'contacto', label: 'Contacto', type: 'text' },
      { id: 'telReferencia', label: 'Tel Referencia', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
      'Diagnóstico': ['Sin tono', 'Tono ocupado', 'Ruido en la línea', 'No saca llamadas', 'No entran llamadas', 'Llamadas se cortan'],
    },
  },
  'GPON/LINEA': {
    fields: [
      { id: 'problemaReportado', label: 'Problema Reportado', type: 'textarea' },
      { id: 'contactoEnSitio', label: 'Contacto En Sitio', type: 'text' },
      { id: 'telContacto', label: 'Tel De Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    },
    radioGroups: {
      'Estatus de niveles:': ['Correctos', 'Erroneos'],
      'Canal Dañado': ['Datos', 'Voz', 'Todos'],
      'PON': ['fija', 'apagada', 'intermitente'],
      'LOS': ['fija', 'apagada', 'roja'],
    },
  },
  'IPTV': {
    fields: [
      { id: 'numeroSerie', label: 'Número de Serie', type: 'text' },
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'mensajeMuestraTv', label: 'Mensaje Que Muestra Tv', type: 'text' },
      { id: 'descripcion', label: 'Descripción', type: 'textarea' },
      { id: 'nombreCliente', label: 'Nombre Cliente', type: 'text' },
      { id: 'numeroContacto', label: 'Número De Contacto', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
      { id: 'queja', label: 'Queja', type: 'text' },
      { id: 'id', label: 'ID', type: 'text' },
    ],
    checkboxes: {
      'Quien genera queja': ['Telefónico', 'Corporativo'],
    },
  },
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
  'filtrado mac': {
    fields: [
      { id: 'problemaReportado', label: 'Problema reportado', type: 'text' },
      { id: 'numeroServicio', label: 'Número de Servicio', type: 'text' },
      { id: 'nombreCliente', label: 'Nombre del cliente', type: 'text' },
      { id: 'telContacto', label: 'Tel Contacto', type: 'text' },
      { id: 'macAddress', label: 'MAC Address', type: 'text' },
      { id: 'pruebas', label: 'Pruebas(si se efectúan)', type: 'textarea' },
      { id: 'comentario', label: 'Comentario', type: 'textarea' },
    ]
  },
  'cita incumplida': {
    fields: [
      { id: 'noOrden', label: 'No. Orden', type: 'text' },
      { id: 'nombreContacto', label: 'Nombre contacto', type: 'text' },
      { id: 'numeroReferencia', label: 'Numero de referencia', type: 'text' },
      { id: 'fechaVisita', label: 'Fecha de visita', type: 'text' },
      { id: 'horaVisita', label: 'Hora de visita', type: 'text' },
      { id: 'gestorDespacho', label: 'Gestor de Despacho que atendió la llamada', type: 'text' },
      { id: 'orden', label: 'Orden', type: 'text' },
      { id: 'tipoOrden', label: 'tipo de orden', type: 'text' },
      { id: 'tecnologia', label: 'tecnología', type: 'text' },
      { id: 'region', label: 'Región', type: 'text' },
      { id: 'fechaNuevaVisita', label: 'fecha de nueva visita', type: 'text' },
      { id: 'horarioAmPm', label: 'horario am/pm', type: 'text' },
      { id: 'nombreCliente', label: 'Nombre de cliente', type: 'text' },
      { id: 'descripcion', label: 'Descripción', type: 'textarea' },
    ]
  },
  'vencido comercial': {
    fields: [
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
    ]
  },
  'vencido operaciones': {
    fields: [
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea' },
    ]
  },
  'locucion mora activa': {
    fields: [
      { id: 'nombreReporta', label: 'Nombre de quien reporta', type: 'text' },
      { id: 'numeroAfectado', label: 'Número afectado', type: 'text' },
      { id: 'telRef', label: 'Tel de Ref', type: 'text' },
      { id: 'osGenerada', label: 'O/S generada', type: 'text' },
      { id: 'fechaPago', label: 'Fecha de pago', type: 'text' },
      { id: 'ivr', label: 'IVR', type: 'text' },
      { id: 'observaciones', label: 'Observaciones', type: 'textarea' },
    ]
  },
  'claro video': {
    fields: [
      { id: 'nombreCliente', label: 'Nombre del Cliente', type: 'text' },
      { id: 'numeroTelefonico', label: 'Número telefónico', type: 'text' },
      { id: 'correoElectronico', label: 'Correo electrónico a registrar', type: 'text' },
      { id: 'problemaReporta', label: 'Qué problema reporta', type: 'textarea' },
      { id: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'text' },
      { id: 'telefonosContacto', label: 'Telefonos de contacto', type: 'text' },
      { id: 'plataforma', label: 'Plataforma donde está tratando de registrarse', type: 'text' },
    ]
  },
  'reparación en tiempo vencido': {
    fields: [
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea' },
    ]
  },
  'mala atención al tecnico': {
    fields: [
      { id: 'motivo', label: 'Motivo', type: 'text' },
      { id: 'numeroAfectado', label: 'Número afectado', type: 'text' },
      { id: 'nombreCompletoCliente', label: 'Nombre completo del cliente', type: 'text' },
      { id: 'nombreReporta', label: 'Nombre de quien reporta', type: 'text' },
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'fechaSolicitud', label: 'Fecha de solicitud', type: 'text' },
      { id: 'servicioContratado', label: 'Servicio contratado', type: 'text' },
      { id: 'direccionInstalacion', label: 'Dirección de instalación', type: 'text' },
      { id: 'descripcionReclamo', label: 'Descripción del reclamo', type: 'textarea' },
    ]
  },
  'sin acceso a guía interactiva': {
    fields: [
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'correoClaroVideo', label: 'Correo Claro Video', type: 'text' },
      { id: 'planPaquete', label: 'Plan o paquete contratado', type: 'text' },
      { id: 'checkAmcoPle', label: 'Check AMCO y PLE', type: 'text' },
      { id: 'mensajeTv', label: 'Mensaje que muestra TV', type: 'text' },
      { id: 'numeroContacto', label: 'Número de contacto', type: 'text' },
      { id: 'cliente', label: 'Cliente', type: 'text' },
      { id: 'descripcion', label: 'Descripción', type: 'textarea' },
      { id: 'pruebasRealizadas', label: 'Pruebas realizadas', type: 'textarea' },
    ]
  },
  'reparacion en plazo vigente': {
    fields: [
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea', defaultValue: 'Seguimiento a queja en tiempo Vigente' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text', defaultValue: '8:00 a 5:00' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea', defaultValue: 'Cl Indica que no ha llegado el técnico y le urge, por favor verificar.' },
    ]
  }
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
  'instalacion en plazo vigente': {
    fields: [
      { id: 'telefonoReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea', defaultValue: 'Seguimiento a orden en tiempo Vigente' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text', defaultValue: '8:00 a 5:00' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea', defaultValue: 'Cliente solicita informacion sobre instalacion, se encuentra en tiempo vigente' },
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
  const [plantillasGenericasCheckboxConfig, setPlantillasGenericasCheckboxConfig] = useState<CheckboxConfig>({});
  const [plantillasGenericasOrderedPruebas, setPlantillasGenericasOrderedPruebas] = useState<string[]>([]);
  const [plantillasGenericasPruebasRealizadas, setPlantillasGenericasPruebasRealizadas] = useState('');


  // Estado para Plantillas de Quejas
  const [plantillasQuejasTemplates, setPlantillasQuejasTemplates] = useState<MemoTemplate>(initialPlantillasQuejasTemplates);
  const [plantillasQuejasSelectedTemplate, setPlantillasQuejasSelectedTemplate] = useState('');
  const [plantillasQuejasFormData, setPlantillasQuejasFormData] = useState({});
  const [plantillasQuejasCheckboxValues, setPlantillasQuejasCheckboxValues] = useState<CheckboxState>({});
  const [plantillasQuejasPruebasCheckboxes, setPlantillasQuejasPruebasCheckboxes] = useState<CheckboxState>(initialPlantillasQuejasCheckboxes);
  const [plantillasQuejasCheckboxConfig, setPlantillasQuejasCheckboxConfig] = useState<CheckboxConfig>({});
  const [plantillasQuejasOrderedPruebas, setPlantillasQuejasOrderedPruebas] = useState<string[]>([]);
  const [plantillasQuejasPruebasRealizadas, setPlantillasQuejasPruebasRealizadas] = useState('');

  
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
  
  // Estado para Archivos
  const [archivosItems, setArchivosItems] = useState<ArchivoItem[]>([]);


  // ----- Lógica de persistencia de datos -----

  const getAppState = useCallback((): AppState => {
    return {
      activeTab, activeSubTab, backupText, notesText, usersText, notices,
      plantillasGenericas_formData: plantillasGenericasFormData,
      plantillasGenericas_checkboxes: plantillasGenericasCheckboxes,
      plantillasGenericas_checkboxConfig: plantillasGenericasCheckboxConfig,
      plantillasGenericas_orderedPruebas: plantillasGenericasOrderedPruebas,
      plantillasGenericas_pruebasRealizadas: plantillasGenericasPruebasRealizadas,
      plantillasQuejas_templates: plantillasQuejasTemplates,
      plantillasQuejas_selectedTemplate: plantillasQuejasSelectedTemplate,
      plantillasQuejas_formData: plantillasQuejasFormData,
      plantillasQuejas_checkboxValues: plantillasQuejasCheckboxValues,
      plantillasQuejas_pruebasCheckboxes: plantillasQuejasPruebasCheckboxes,
      plantillasQuejas_checkboxConfig: plantillasQuejasCheckboxConfig,
      plantillasQuejas_orderedPruebas: plantillasQuejasOrderedPruebas,
      plantillasQuejas_pruebasRealizadas: plantillasQuejasPruebasRealizadas,
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
      archivos_items: archivosItems,
    };
  }, [
      activeTab, activeSubTab, backupText, notesText, usersText, notices,
      plantillasGenericasFormData, plantillasGenericasCheckboxes, plantillasGenericasCheckboxConfig, plantillasGenericasOrderedPruebas, plantillasGenericasPruebasRealizadas,
      plantillasQuejasTemplates, plantillasQuejasSelectedTemplate, plantillasQuejasFormData, plantillasQuejasCheckboxValues,
      plantillasQuejasPruebasCheckboxes, plantillasQuejasCheckboxConfig, plantillasQuejasOrderedPruebas, plantillasQuejasPruebasRealizadas,
      memosWfTemplates, memosWfSelectedTemplate, memosWfFormData, 
      memosOrdenTemplates, memosOrdenSelectedTemplate, memosOrdenFormData,
      herramientasMinutos, transferenciasItems, transferenciasNewService, transferenciasNewValue,
      archivosItems,
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
          
          if (data.activeTab) setActiveTab(data.activeTab);
          if (data.activeSubTab) setActiveSubTab(data.activeSubTab);
          if (data.backupText) setBackupText(data.backupText);
          if (data.notesText) setNotesText(data.notesText);
          if (data.usersText) setUsersText(data.usersText);
          if (data.notices) setNotices(data.notices);

          if (data.plantillasGenericas_formData) setPlantillasGenericasFormData(data.plantillasGenericas_formData);
          if (data.plantillasGenericas_checkboxes) setPlantillasGenericasCheckboxes(data.plantillasGenericas_checkboxes);
          if (data.plantillasGenericas_checkboxConfig) setPlantillasGenericasCheckboxConfig(data.plantillasGenericas_checkboxConfig);
          if (data.plantillasGenericas_orderedPruebas) setPlantillasGenericasOrderedPruebas(data.plantillasGenericas_orderedPruebas);
          if (data.plantillasGenericas_pruebasRealizadas) setPlantillasGenericasPruebasRealizadas(data.plantillasGenericas_pruebasRealizadas);

          if(data.plantillasQuejas_templates) setPlantillasQuejasTemplates(data.plantillasQuejas_templates);
          if(data.plantillasQuejas_selectedTemplate) setPlantillasQuejasSelectedTemplate(data.plantillasQuejas_selectedTemplate);
          if(data.plantillasQuejas_formData) setPlantillasQuejasFormData(data.plantillasQuejas_formData);
          if(data.plantillasQuejas_checkboxValues) setPlantillasQuejasCheckboxValues(data.plantillasQuejas_checkboxValues);
          if(data.plantillasQuejas_pruebasCheckboxes) setPlantillasQuejasPruebasCheckboxes(data.plantillasQuejas_pruebasCheckboxes);
          if (data.plantillasQuejas_checkboxConfig) setPlantillasQuejasCheckboxConfig(data.plantillasQuejas_checkboxConfig);
          if (data.plantillasQuejas_orderedPruebas) setPlantillasQuejasOrderedPruebas(data.plantillasQuejas_orderedPruebas);
          if (data.plantillasQuejas_pruebasRealizadas) setPlantillasQuejasPruebasRealizadas(data.plantillasQuejas_pruebasRealizadas);

          
          if(data.memosWf_templates) setMemosWfTemplates(data.memosWf_templates);
          if (data.memosWf_selectedTemplate && data.memosWf_templates && data.memosWf_templates[data.memosWf_selectedTemplate]) {
              setMemosWfSelectedTemplate(data.memosWf_selectedTemplate);
              const template = data.memosWf_templates[data.memosWf_selectedTemplate];
              const initialData: { [key: string]: any } = {};
              template.fields.forEach(field => {
                  initialData[field.id] = field.defaultValue || '';
              });
              const mergedData = { ...initialData, ...data.memosWf_formData };
              setMemosWfFormData(mergedData);
          } else if (data.memosWf_formData) {
              setMemosWfFormData(data.memosWf_formData);
          }
          
          if(data.memosOrden_templates) setMemosOrdenTemplates(data.memosOrden_templates);
           if (data.memosOrden_selectedTemplate && data.memosOrden_templates && data.memosOrden_templates[data.memosOrden_selectedTemplate]) {
              setMemosOrdenSelectedTemplate(data.memosOrden_selectedTemplate);
              const template = data.memosOrden_templates[data.memosOrden_selectedTemplate];
              const initialData: { [key: string]: any } = {};
              template.fields.forEach(field => {
                  initialData[field.id] = field.defaultValue || '';
              });
              const mergedData = { ...initialData, ...data.memosOrden_formData };
              setMemosOrdenFormData(mergedData);
          } else if (data.memosOrden_formData) {
              setMemosOrdenFormData(data.memosOrden_formData);
          }

          if(data.herramientas_minutos) setHerramientasMinutos(data.herramientas_minutos);

          if(data.transferencias_items) setTransferenciasItems(data.transferencias_items);
          if(data.transferencias_newService) setTransferenciasNewService(data.transferencias_newService);
          if(data.transferencias_newValue) setTransferenciasNewValue(data.transferencias_newValue);
          
          if(data.archivos_items) setArchivosItems(data.archivos_items);
          
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

    // ----- Tutorial -----
    useEffect(() => {
        const checkAndRunTutorial = async () => {
            if (user && isDataLoaded && !isInitialLoad.current) {
                const docRef = doc(db, 'users', user.uid, 'state', 'appState');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && !docSnap.data()?.tutorialCompleted) {
                    setTimeout(() => {
                        const intro = introJs();
                        intro.setOptions({
                            steps: [
                                {
                                    element: '#main-tabs',
                                    title: 'Pestañas Principales',
                                    intro: 'Aquí puedes navegar entre las diferentes secciones de la aplicación como Plantillas, Herramientas, Archivos y más.',
                                    position: 'bottom'
                                },
                                {
                                    element: '#sub-tabs',
                                    title: 'Sub-Pestañas de Plantillas',
                                    intro: 'Dentro de Plantillas, puedes elegir entre diferentes tipos como Genéricas, de Quejas, y Memos.',
                                    position: 'bottom'
                                },
                                {
                                    element: '#timer-widget',
                                    title: 'Temporizador',
                                    intro: 'Usa este temporizador para llevar un control de tus llamadas o tareas. Puedes configurarlo haciendo clic en él.',
                                    position: 'left'
                                },
                                {
                                    element: '#floating-widgets-container',
                                    title: 'Widgets Flotantes',
                                    intro: 'Estos botones te dan acceso rápido a notas, listas de usuarios, personalización del tema y el Copilot de OMEGA. ¡Pruébalos!',
                                    position: 'left'
                                },
                            ],
                            showBullets: false,
                            showStepNumbers: true,
                            exitOnOverlayClick: false,
                            doneLabel: 'Entendido, ¡no mostrar más!',
                        });

                        intro.oncomplete(async () => {
                            await updateDoc(docRef, { tutorialCompleted: true });
                        });
                        intro.onexit(async () => {
                            await updateDoc(docRef, { tutorialCompleted: true });
                        });

                        intro.start();
                    }, 500); // Pequeño retraso para asegurar que los elementos estén renderizados
                }
            }
        };

        checkAndRunTutorial();
    }, [user, isDataLoaded]);

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

  // ----- Manejadores de Plantillas Globales -----

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const newBackupText = `${text}\n\n--------------------------------------\n\n${backupText}`;
    setBackupText(newBackupText);
    toast({
      title: "Copiado y Respaldado",
      description: "La plantilla ha sido copiada y guardada en la copia de respaldo.",
    });
  };

  const handleClearGeneric = () => {
    setPlantillasGenericasFormData(initialPlantillasGenericasFormData);
    setPlantillasGenericasCheckboxes(initialPlantillasGenericasCheckboxes);
    setPlantillasGenericasOrderedPruebas([]);
    setPlantillasGenericasPruebasRealizadas('');
  };
  
  const handleGenericasCheckboxChange = (group: string, label: string, checked: boolean) => {
    const newCheckboxes = {
        ...plantillasGenericasCheckboxes,
        [group]: { ...plantillasGenericasCheckboxes[group], [label]: checked }
    };
    setPlantillasGenericasCheckboxes(newCheckboxes);
    
    const displayedLabel = plantillasGenericasCheckboxConfig[group]?.[label] || label;

    let newOrderedPruebas;
    if (checked) {
      newOrderedPruebas = [...plantillasGenericasOrderedPruebas, displayedLabel];
    } else {
      newOrderedPruebas = plantillasGenericasOrderedPruebas.filter(item => item !== displayedLabel);
    }
    
    setPlantillasGenericasOrderedPruebas(newOrderedPruebas);
    setPlantillasGenericasPruebasRealizadas(newOrderedPruebas.join(', '));
  };


  const handleClearQuejas = () => {
    setPlantillasQuejasFormData({});
    setPlantillasQuejasCheckboxValues({});
    setPlantillasQuejasPruebasCheckboxes(initialPlantillasQuejasCheckboxes);
    setPlantillasQuejasOrderedPruebas([]);
    setPlantillasQuejasPruebasRealizadas('');
  };

  const handleQuejasCheckboxChange = (group: string, label: string, checked: boolean) => {
    const newCheckboxes = {
        ...plantillasQuejasPruebasCheckboxes,
        [group]: { ...plantillasQuejasPruebasCheckboxes[group], [label]: checked }
    };
    setPlantillasQuejasPruebasCheckboxes(newCheckboxes);

    const displayedLabel = plantillasQuejasCheckboxConfig[group]?.[label] || label;

    let newOrderedPruebas;
    if (checked) {
        newOrderedPruebas = [...plantillasQuejasOrderedPruebas, displayedLabel];
    } else {
        newOrderedPruebas = plantillasQuejasOrderedPruebas.filter(item => item !== displayedLabel);
    }

    setPlantillasQuejasOrderedPruebas(newOrderedPruebas);
    setPlantillasQuejasPruebasRealizadas(newOrderedPruebas.join(', '));
  };

  const handleClearMemosWf = () => {
      const template = memosWfTemplates[memosWfSelectedTemplate];
      const initialData: { [key: string]: any } = {};
      if (template) {
          template.fields.forEach(field => {
              initialData[field.id] = field.defaultValue || '';
          });
      }
      setMemosWfFormData(initialData);
  }
  
  const handleClearMemosOrden = () => {
      const template = memosOrdenTemplates[memosOrdenSelectedTemplate];
      const initialData: { [key: string]: any } = {};
      if (template) {
          template.fields.forEach(field => {
              initialData[field.id] = field.defaultValue || '';
          });
      }
      setMemosOrdenFormData(initialData);
  }

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
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="absolute inset-0 z-0">
        <NeuralNetworkAnimation />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-2">
            <OmegaLogo className="h-8 w-8" />
            <h1 className="text-xl font-bold">OMEGA - FIJO SOPORTE</h1>
            </div>
            <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{formatUserName(user.email)}</span>
            <div id="timer-widget">
              <Timer />
            </div>
            <Button onClick={handleLogout} variant="destructive" size="sm">
                Salir
            </Button>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" id="main-tabs">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="plantillas">PLANTILLAS</TabsTrigger>
                <TabsTrigger value="herramientas">HERRAMIENTAS</TabsTrigger>
                <TabsTrigger value="transferencias">TRANSFERENCIAS</TabsTrigger>
                <TabsTrigger value="archivos">ARCHIVOS</TabsTrigger>
                <TabsTrigger value="avisos">AVISOS</TabsTrigger>
                <TabsTrigger value="respaldo">COPIA DE RESPALDO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plantillas" className="mt-4">
                <Card>
                <CardContent className="p-0">
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full" id="sub-tabs">
                    <TabsList className="grid w-full grid-cols-4 rounded-t-lg rounded-b-none">
                        <TabsTrigger value="genericas">PLANTILLAS GENERICAS</TabsTrigger>
                        <TabsTrigger value="quejas">PLANTILLAS DE QUEJAS</TabsTrigger>
                        <TabsTrigger value="wf">MEMOS DE WF</TabsTrigger>
                        <TabsTrigger value="orden">MEMOS DE ORDEN</TabsTrigger>
                    </TabsList>
                    <TabsContent value="genericas" className="p-6">
                        <PlantillasGenericasTab 
                            formData={plantillasGenericasFormData}
                            setFormData={setPlantillasGenericasFormData}
                            checkboxes={plantillasGenericasCheckboxes}
                            checkboxConfig={plantillasGenericasCheckboxConfig}
                            setCheckboxConfig={setPlantillasGenericasCheckboxConfig}
                            onCheckboxChange={handleGenericasCheckboxChange}
                            pruebasRealizadasText={plantillasGenericasPruebasRealizadas}
                            setPruebasRealizadasText={setPlantillasGenericasPruebasRealizadas}
                            onCopy={handleCopyToClipboard}
                            onClear={handleClearGeneric}
                        />
                    </TabsContent>
                    <TabsContent value="quejas" className="p-6">
                        <PlantillasQuejasTab 
                            templates={plantillasQuejasTemplates}
                            selectedTemplate={plantillasQuejasSelectedTemplate}
                            setSelectedTemplate={setPlantillasQuejasSelectedTemplate}
                            formData={plantillasQuejasFormData}
                            setFormData={setPlantillasQuejasFormData}
                            checkboxValues={plantillasQuejasCheckboxValues}
                            setCheckboxValues={setPlantillasQuejasCheckboxValues}
                            pruebasCheckboxes={plantillasQuejasPruebasCheckboxes}
                            checkboxConfig={plantillasQuejasCheckboxConfig}
                            setCheckboxConfig={setPlantillasQuejasCheckboxConfig}
                            onPruebasCheckboxChange={handleQuejasCheckboxChange}
                            pruebasRealizadasText={plantillasQuejasPruebasRealizadas}
                            setPruebasRealizadasText={setPlantillasQuejasPruebasRealizadas}
                            onCopy={handleCopyToClipboard}
                            onClear={handleClearQuejas}
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
                            onCopy={handleCopyToClipboard}
                            onClear={handleClearMemosWf}
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
                            onCopy={handleCopyToClipboard}
                            onClear={handleClearMemosOrden}
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
                setNewValue={setTransferenciasNewValue}
                />
            </TabsContent>
            
            <TabsContent value="archivos" className="mt-4">
                <ArchivosTab 
                  items={archivosItems}
                  setItems={setArchivosItems}
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
    </div>
  );
}
