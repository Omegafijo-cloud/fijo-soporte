'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type CheckboxState = {
  [group: string]: {
    [label: string]: boolean;
  };
};

const initialCheckboxState: CheckboxState = {
    'Nivel Cero': {
        'Saldos OK': false,
        'No hay Fallas': false,
        'No presenta bloqueo': false,
        'No hay OS abiertas': false,
        'No hay quejas': false,
    },
    'GPON - ADSL - HFC': {
        'Se verifica estado de las luces del router': false,
        'Envio reset en UMP': false,
        'Se Desconecta y Conecta Corriente': false,
        'Se Desconecta y Conecta en otro tomacorriente': false,
        'Se verifica Splitter': false,
        'Cambio de baterías': false,
        'Se verifica Coaxial bien apretado': false,
        'Se verifica cortes o daños en la fibra': false,
        'Se manda a realizar test de velocidad (00 Megas)': false,
        'Se realiza Ping (0% perdido)': false,
        'Estado de la ONT activo': false,
        'Niveles SNR en Rojo': false,
        'Luz LOS en ROJO': false,
        'Se envia reboot en Axiros': false,
    },
    'TV HFC - DTH - IPTV': {
        'Se verifica Conexiones HDMI': false,
        'Se Verifica Conexiones RCA': false,
        'Se verifica cable Coaxial': false,
        'XX Stb afectados': false,
        'Se valida Serial No. XXXX': false,
        'Mensaje que muestra Tv: XXX': false,
        'Se Envia Comando XXXX': false,
        'Se Envia Reset Fisico': false,
        'Se verifica en la GUI, AMCO en verde': false,
    },
    'Otros': {
        'Se valida DPI ok, nombre completo ok, sin restricciones': false,
        'Cliente no esta en Sitio': false,
        'Cliente esta en Agencia': false,
        'Cliente no quiere hacer pruebas': false,
        'Se realiza cambio de contraseña con exito': false,
        'Servicio funcionando de manera correcta': false,
        'Se Genera Averia': false,
        'Se envía reproceso': false,
    },
};

const initialFormData = {
    idLlamada: '',
    nombreContacto: '',
    nIncidencia: '',
    inconveniente: '',
    tipoServicio: '',
}

interface PlantillasGenericasTabProps {
    backupText: string;
    setBackupText: (text: string) => void;
}

export default function PlantillasGenericasTab({ backupText, setBackupText }: PlantillasGenericasTabProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [pruebasRealizadas, setPruebasRealizadas] = useState('');
  const [checkboxes, setCheckboxes] = useState<CheckboxState>(initialCheckboxState);
  const { toast } = useToast();

  useEffect(() => {
    const generatePruebasText = () => {
      const allCheckedItems: string[] = [];
      for (const group in checkboxes) {
        const checkedItems = Object.keys(checkboxes[group]).filter(
          (label) => checkboxes[group][label]
        );
        allCheckedItems.push(...checkedItems);
      }
      return allCheckedItems.join(', ');
    };
    setPruebasRealizadas(generatePruebasText());
  }, [checkboxes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (group: string, label: string, checked: boolean) => {
    setCheckboxes((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [label]: checked,
      },
    }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setCheckboxes(initialCheckboxState);
  }

  const handleCopy = () => {
    const template = `ID de llamada: ${formData.idLlamada}
Nombre del contacto: ${formData.nombreContacto}
N° Incidencia: ${formData.nIncidencia}
Tipo Servicio: ${formData.tipoServicio}
Inconveniente: ${formData.inconveniente}

PRUEBAS REALIZADAS: ${pruebasRealizadas}`;

    const newBackupText = `${template}\n\n--------------------------------------\n\n${backupText}`;
    setBackupText(newBackupText);

    navigator.clipboard.writeText(template.trim());
    toast({
      title: "Copiado y Respaldado",
      description: "La plantilla ha sido copiada y guardada en la copia de respaldo.",
    })
  }

  const renderCheckboxGroup = (title: string, groupKey: keyof typeof initialCheckboxState) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {Object.keys(checkboxes[groupKey]).map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox 
                id={`${groupKey}-${label}`} 
                checked={checkboxes[groupKey][label]}
                onCheckedChange={(checked) => handleCheckboxChange(groupKey, label, checked as boolean)}
              />
              <Label htmlFor={`${groupKey}-${label}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Columna Izquierda: Formulario Principal */}
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Plantilla Genérica</CardTitle>
            <CardDescription>Rellene los campos para generar la plantilla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idLlamada">ID de llamada</Label>
                <Input id="idLlamada" value={formData.idLlamada} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombreContacto">Nombre del contacto</Label>
                <Input id="nombreContacto" value={formData.nombreContacto} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nIncidencia">N° Incidencia</Label>
                <Input id="nIncidencia" value={formData.nIncidencia} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoServicio">Tipo Servicio</Label>
                <Input id="tipoServicio" value={formData.tipoServicio} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inconveniente">Inconveniente</Label>
              <Textarea id="inconveniente" value={formData.inconveniente} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pruebasRealizadas">PRUEBAS REALIZADAS</Label>
              <Textarea 
                id="pruebasRealizadas" 
                value={pruebasRealizadas} 
                onChange={(e) => setPruebasRealizadas(e.target.value)}
                rows={4} 
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopy}>Copiar Plantilla</Button>
              <Button onClick={handleClear} variant="outline">Limpiar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Checkboxes */}
      <div className="space-y-4">
        {renderCheckboxGroup('Nivel Cero', 'Nivel Cero')}
        {renderCheckboxGroup('GPON - ADSL - HFC', 'GPON - ADSL - HFC')}
        {renderCheckboxGroup('TV HFC - DTH - IPTV', 'TV HFC - DTH - IPTV')}
        {renderCheckboxGroup('Otros', 'Otros')}
      </div>
    </div>
  );
}
