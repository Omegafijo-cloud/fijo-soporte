'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type CheckboxState = {
  [group: string]: {
    [label: string]: boolean;
  };
};

interface PlantillasGenericasTabProps {
    formData: any;
    setFormData: (data: any) => void;
    checkboxes: CheckboxState;
    setCheckboxes: (state: CheckboxState) => void;
    pruebasRealizadas: string;
    setPruebasRealizadas: (text: string) => void;
    onCopy: (text: string) => void;
    onClear: () => void;
}

export default function PlantillasGenericasTab({ 
    formData,
    setFormData,
    checkboxes,
    setCheckboxes,
    pruebasRealizadas,
    setPruebasRealizadas,
    onCopy,
    onClear
}: PlantillasGenericasTabProps) {

  useEffect(() => {
    const generatePruebasText = () => {
      const allCheckedItems: string[] = [];
      for (const group in checkboxes) {
        if (checkboxes[group]) {
            const checkedItems = Object.keys(checkboxes[group]).filter(
              (label) => checkboxes[group][label]
            );
            allCheckedItems.push(...checkedItems);
        }
      }
      return allCheckedItems.join(', ');
    };
    
    const generatedText = generatePruebasText();
    const isManuallyEdited = pruebasRealizadas !== generatedText && pruebasRealizadas !== '';
    if (!isManuallyEdited) {
      setPruebasRealizadas(generatedText);
    }
  }, [checkboxes, setPruebasRealizadas]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (group: string, label: string, checked: boolean) => {
    const newCheckboxes = {
      ...checkboxes,
      [group]: {
        ...checkboxes[group],
        [label]: checked,
      },
    };
    setCheckboxes(newCheckboxes);
    
     const allCheckedItems: string[] = [];
      for (const G in newCheckboxes) {
        if (newCheckboxes[G]) {
            const checkedItems = Object.keys(newCheckboxes[G]).filter(
              (l) => newCheckboxes[G][l]
            );
            allCheckedItems.push(...checkedItems);
        }
      }
    setPruebasRealizadas(allCheckedItems.join(', '));

  };

  const handleCopyClick = () => {
    const template = `ID de llamada: ${formData.idLlamada}
Nombre del contacto: ${formData.nombreContacto}
N° Incidencia: ${formData.nIncidencia}
Tipo Servicio: ${formData.tipoServicio}
Inconveniente: ${formData.inconveniente}

PRUEBAS REALIZADAS: ${pruebasRealizadas}`;

    onCopy(template.trim());
  }

  const renderCheckboxGroup = (title: string, groupKey: keyof CheckboxState) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {checkboxes[groupKey] && Object.keys(checkboxes[groupKey]).map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox 
                id={`${groupKey}-${label}`} 
                checked={checkboxes[groupKey]?.[label] || false}
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
              <Button onClick={handleCopyClick}>Copiar Plantilla</Button>
              <Button onClick={onClear} variant="outline">Limpiar</Button>
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
