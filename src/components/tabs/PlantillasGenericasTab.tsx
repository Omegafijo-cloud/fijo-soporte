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
    'Contraseña de router': false,
    'Reiniciar router': false,
    'Validar luces del router': false,
  },
  'GPON - ADSL - HFC': {
    'Prueba de velocidad': false,
    'Verificar cableado': false,
    'Revisar configuración de red': false,
  },
  'TV HFC - DTH - IPTV': {
    'Reiniciar decodificador': false,
    'Verificar señal': false,
    'Sincronizar control remoto': false,
  },
  Otros: {
    'Consulta de facturación': false,
    'Actualización de datos': false,
  },
};

const initialFormData = {
    idLlamada: '',
    nombreContacto: '',
    nIncidencia: '',
    inconveniente: '',
    tipoServicio: '',
}

export default function PlantillasGenericasTab() {
  const [formData, setFormData] = useState(initialFormData);
  const [pruebasRealizadas, setPruebasRealizadas] = useState('');
  const [checkboxes, setCheckboxes] = useState<CheckboxState>(initialCheckboxState);
  const { toast } = useToast();

  useEffect(() => {
    const generatePruebasText = () => {
      let text = '';
      for (const group in checkboxes) {
        const checkedItems = Object.keys(checkboxes[group]).filter(
          (label) => checkboxes[group][label]
        );
        if (checkedItems.length > 0) {
          text += `${group.toUpperCase()}:\n- ${checkedItems.join('\n- ')}\n\n`;
        }
      }
      return text.trim();
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

PRUEBAS REALIZADAS:
${pruebasRealizadas}`;

    navigator.clipboard.writeText(template);
    toast({
      title: "Copiado",
      description: "La plantilla ha sido copiada al portapapeles.",
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
              <Textarea id="pruebasRealizadas" value={pruebasRealizadas} readOnly rows={10} className="bg-muted" />
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
