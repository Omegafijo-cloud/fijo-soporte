'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const predefinedWfMemos = {
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
    ],
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
    ],
  },
  'vencido comercial': {
    fields: [
      { id: 'telReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
    ],
  },
  'velocidad mal configurada': {
    fields: [
      { id: 'noContacto', label: 'No. Contacto', type: 'text' },
      { id: 'inconvenienteReportado', label: 'Inconveniente reportado', type: 'text' },
      { id: 'virtualReportado', label: 'Virtual Reportado', type: 'text' },
      { id: 'velocidadPisa', label: 'Velocidad Config PISA', type: 'text' },
      { id: 'velocidadUmp', label: 'Velocidad config UMP', type: 'text' },
    ],
  },
  'vencido operaciones': {
    fields: [
      { id: 'telReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea' },
    ],
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
    ],
  },
  'bloqueo mayor a 2 horas': {
    fields: [
      { id: 'nombreReporta', label: 'Nombre de quien reporta', type: 'text' },
      { id: 'servicioLiberar', label: 'Servicio a liberar', type: 'text' },
      { id: 'noAfectado', label: 'No. afectado', type: 'text' },
      { id: 'tipoBloqueo', label: 'Tipo de bloqueo', type: 'text' },
      { id: 'telRef', label: 'Tel de Ref', type: 'text' },
      { id: 'horaPago', label: 'Hora de Pago', type: 'text' },
      { id: 'reincidente', label: 'Reincidente', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
    ],
  },
  'daño a la infraestructura': {
    fields: [
      { id: 'contacto', label: 'Contacto', type: 'text' },
      { id: 'telContacto', label: 'Teléfono de contacto', type: 'text' },
      { id: 'direccionDanio', label: 'Dirección de daño', type: 'text' },
      { id: 'danioReporta', label: 'Daño que reporta', type: 'textarea' },
    ],
  },
  'claro video': {
    fields: [
      { id: 'nombreCliente', label: 'Nombre del Cliente', type: 'text' },
      { id: 'numeroTelefonico', label: 'Número telefónico', type: 'text' },
      { id: 'correoRegistrar', label: 'Correo electrónico a registrar', type: 'text' },
      { id: 'problemaReporta', label: 'Qué problema reporta', type: 'textarea' },
      { id: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'text' },
      { id: 'telefonosContacto', label: 'Telefonos de contacto', type: 'text' },
      { id: 'plataformaRegistro', label: 'Plataforma donde está tratando de registrarse', type: 'text' },
    ],
  },
  'reparación en tiempo vencido': {
    fields: [
      { id: 'telReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'noOs', label: 'No. de O/S', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea' },
    ],
  },
  'mala atención al tecnico': {
    fields: [
      { id: 'motivo', label: 'Motivo', type: 'text' },
      { id: 'numeroAfectado', label: 'Número afectado', type: 'text' },
      { id: 'nombreCompletoCliente', label: 'Nombre completo del cliente', type: 'text' },
      { id: 'nombreReporta', label: 'Nombre de quien reporta', type: 'text' },
      { id: 'telReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'fechaSolicitud', label: 'Fecha de solicitud', type: 'text' },
      { id: 'servicioContratado', label: 'Servicio contratado', type: 'text' },
      { id: 'direccionInstalacion', label: 'Dirección de instalación', type: 'text' },
      { id: 'descripcionReclamo', label: 'Descripción del reclamo', type: 'textarea' },
    ],
  },
  'check en rojo': {
    fields: [
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'correoClaroVideo', label: 'Correo Claro Video', type: 'text' },
      { id: 'planContratado', label: 'Plan o paquete contratado', type: 'text' },
      { id: 'checkErrorGui', label: 'Check con error en GUI', type: 'text' },
      { id: 'numeroContacto', label: 'Número de contacto', type: 'text' },
      { id: 'cliente', label: 'Cliente', type: 'text' },
      { id: 'descripcion', label: 'Descripción', type: 'textarea' },
      { id: 'pruebasRealizadas', label: 'Pruebas realizadas', type: 'textarea' },
    ],
  },
  'sin acceso a guía interactiva': {
    fields: [
      { id: 'numero', label: 'Número', type: 'text' },
      { id: 'correoClaroVideo', label: 'Correo Claro Video', type: 'text' },
      { id: 'planContratado', label: 'Plan o paquete contratado', type: 'text' },
      { id: 'checkAmcoPle', label: 'Check AMCO y PLE', type: 'text' },
      { id: 'mensajeTv', label: 'Mensaje que muestra TV', type: 'text' },
      { id: 'numeroContacto', label: 'Número de contacto', type: 'text' },
      { id: 'cliente', label: 'Cliente', type: 'text' },
      { id: 'descripcion', label: 'Descripción', type: 'textarea' },
      { id: 'pruebasRealizadas', label: 'Pruebas realizadas', type: 'textarea' },
    ],
  },
  'configuración wifi': {
    fields: [
      { id: 'quienGeneraQueja', label: 'Quien genera queja', type: 'text' },
      { id: 'luzPon', label: 'Luz Pon', type: 'text' },
      { id: 'luzLos', label: 'Luz Los', type: 'text' },
      { id: 'serie', label: 'Serie', type: 'text' },
      { id: 'canalDañado', label: 'Canal dañado', type: 'text' },
      { id: 'problemaReportado', label: 'Problema reportado', type: 'textarea' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea' },
      { id: 'contactoEnSitio', label: 'Contacto en sitio', type: 'text' },
      { id: 'telefonosReferencias', label: 'Teléfonos de referencias', type: 'text' },
      { id: 'direccion', label: 'Dirección', type: 'text' },
    ],
  },
  'reparación en plazo vigente': {
    fields: [
      { id: 'telReferencia', label: 'Teléfono de referencia', type: 'text' },
      { id: 'comentarios', label: 'Comentarios', type: 'textarea', defaultValue: 'Seguimiento a queja en tiempo Vigente' },
      { id: 'noQueja', label: 'No. Queja', type: 'text' },
      { id: 'horaVisita', label: 'Hora visita', type: 'text', defaultValue: '8:00 a 5:00' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizadas', type: 'textarea', defaultValue: 'Cl Indica que no ha llegado el técnico y le urge, por favor verificar.' },
    ],
  },
  'otros wf': {
    fields: [
      { id: 'nombreContacto', label: 'Nombre de contacto', type: 'text' },
      { id: 'telReferencia', label: 'Teléfonos de referencia', type: 'text' },
      { id: 'noOrdenQueja', label: 'Numero de orden y/o queja', type: 'text' },
      { id: 'inconvenienteCliente', label: 'Inconveniente del cliente', type: 'textarea' },
      { id: 'pruebasRealizadas', label: 'Pruebas Realizada', type: 'textarea' },
    ],
  },
};

type MemoTemplate = {
  [key: string]: {
    fields: any[];
  }
}

interface MemosWfTabProps {
  templates: MemoTemplate;
  setTemplates: (templates: MemoTemplate) => void;
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  formData: { [key: string]: any };
  setFormData: (value: { [key: string]: any }) => void;
}

export default function MemosWfTab({ 
  templates,
  setTemplates,
  selectedTemplate, 
  setSelectedTemplate, 
  formData, 
  setFormData 
}: MemosWfTabProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = templates[templateKey] || predefinedWfMemos[templateKey as keyof typeof predefinedWfMemos];
    const initialData: { [key: string]: any } = {};
    if (template) {
        template.fields.forEach(field => {
            if (field.defaultValue) {
                initialData[field.id] = field.defaultValue;
            }
        });
    }
    setFormData(initialData);
  };
  
  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) {
        toast({ title: 'Error', description: 'El nombre de la plantilla no puede estar vacío.', variant: 'destructive' });
        return;
    }
    const newKey = newTemplateName.trim().toLowerCase().replace(/\s+/g, ' ');
    if (templates[newKey]) {
        toast({ title: 'Error', description: 'Ya existe una plantilla con este nombre.', variant: 'destructive' });
        return;
    }
    setTemplates({
        ...templates,
        [newKey]: { fields: [{ id: 'asunto', label: 'Asunto', type: 'text' }] }
    });
    setNewTemplateName('');
    setIsAddDialogOpen(false);
    toast({ title: 'Éxito', description: 'Plantilla añadida correctamente.' });
  }

  const handleRemoveTemplate = (templateKey: string) => {
    const newTemplates = { ...templates };
    delete newTemplates[templateKey];
    setTemplates(newTemplates);
    if (selectedTemplate === templateKey) {
        setSelectedTemplate('');
        setFormData({});
    }
    toast({ title: 'Éxito', description: 'Plantilla eliminada correctamente.' });
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleCopy = () => {
    if (!selectedTemplate) return;

    let templateText = `TIPO DE MEMO DE WF: ${selectedTemplate}\n\n`;
    
    const template = templates[selectedTemplate] || predefinedWfMemos[selectedTemplate as keyof typeof predefinedWfMemos];
    
    template.fields.forEach(field => {
      templateText += `${field.label}: ${formData[field.id] || field.defaultValue || ''}\n`;
    });

    navigator.clipboard.writeText(templateText);
    toast({
      title: "Memo WF Copiado",
      description: "La plantilla del memo ha sido copiada al portapapeles.",
    });
  };

  const handleClear = () => {
    setSelectedTemplate('');
    setFormData({});
  };

  const renderDynamicFields = () => {
    if (!selectedTemplate) return null;
    const template = templates[selectedTemplate] || predefinedWfMemos[selectedTemplate as keyof typeof predefinedWfMemos];
    if (!template) return null;

    return (
      <div className="space-y-4">
        {template.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.id} value={formData[field.id] ?? field.defaultValue ?? ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            ) : (
              <Input id={field.id} type={field.type} value={formData[field.id] ?? field.defaultValue ?? ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memos de WF</CardTitle>
        <CardDescription>Seleccione una plantilla para generar el memo de Workforce.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Memo</Label>
          <div className="flex gap-2">
            <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
                <SelectTrigger>
                <SelectValue placeholder="Seleccione una plantilla..." />
                </SelectTrigger>
                <SelectContent>
                {Object.keys(templates).map(key => (
                     <SelectItem key={key} value={key}>
                        <div className="flex items-center justify-between w-full">
                           <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                             <Button variant="ghost" size="icon" className="h-5 w-5 ml-4" onClick={(e) => { e.stopPropagation(); handleRemoveTemplate(key); }}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Añadir</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir Nueva Plantilla de WF</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="new-template-name">Nombre de la Plantilla</Label>
                        <Input id="new-template-name" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddTemplate}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {selectedTemplate && (
          <div className="space-y-4 pt-4 border-t">
            {renderDynamicFields()}
            <div className="flex gap-2">
              <Button onClick={handleCopy}>Copiar Memo WF</Button>
              <Button variant="outline" onClick={handleClear}>Limpiar Memo WF</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
