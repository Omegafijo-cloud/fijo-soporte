'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { FilePenLine } from 'lucide-react';

type CheckboxState = {
  [group: string]: {
    [label: string]: boolean;
  };
};

type CheckboxConfig = {
    [group: string]: { [oldLabel: string]: string };
};

interface PlantillasGenericasTabProps {
    formData: any;
    setFormData: (data: any) => void;
    checkboxes: CheckboxState;
    checkboxConfig: CheckboxConfig;
    setCheckboxConfig: (config: CheckboxConfig) => void;
    pruebasRealizadasText: string;
    setPruebasRealizadasText: (text: string) => void;
    onCheckboxChange: (group: string, label: string, checked: boolean) => void;
    onCopy: (text: string) => void;
    onClear: () => void;
}

const EditableCheckboxLabel = ({ group, label, config, setConfig }: { group: string, label: string, config: CheckboxConfig, setConfig: (config: CheckboxConfig) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newLabel, setNewLabel] = useState(config[group]?.[label] || label);

    const handleSave = () => {
        const newConfig = {
            ...config,
            [group]: {
                ...config[group],
                [label]: newLabel
            }
        };
        setConfig(newConfig);
        setIsEditing(false);
    };
    
    const displayedLabel = config[group]?.[label] || label;

    return (
        <div className="flex items-center justify-between w-full">
            <Label htmlFor={`${group}-${label}`} className="font-normal flex-grow">
                {displayedLabel}
            </Label>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 shrink-0">
                        <FilePenLine className="h-3 w-3" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Opción</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="edit-label">Nuevo texto de la opción</Label>
                        <Input id="edit-label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default function PlantillasGenericasTab({ 
    formData,
    setFormData,
    checkboxes,
    checkboxConfig,
    setCheckboxConfig,
    pruebasRealizadasText,
    setPruebasRealizadasText,
    onCheckboxChange,
    onCopy,
    onClear
}: PlantillasGenericasTabProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleCopyClick = () => {
    const template = `ID de llamada: ${formData.idLlamada}
Nombre del contacto: ${formData.nombreContacto}
N° Incidencia: ${formData.nIncidencia}
Tipo Servicio: ${formData.tipoServicio}
Inconveniente: ${formData.inconveniente}

PRUEBAS REALIZADAS: ${pruebasRealizadasText}`;

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
                onCheckedChange={(checked) => onCheckboxChange(groupKey, label, checked as boolean)}
              />
              <EditableCheckboxLabel group={groupKey} label={label} config={checkboxConfig} setConfig={setCheckboxConfig} />
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
                value={pruebasRealizadasText}
                onChange={(e) => setPruebasRealizadasText(e.target.value)}
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
