'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const initialCheckboxState = {
  nivelCero: {
    'Contraseña de router': false,
    'Reiniciar router': false,
    'Validar luces del router': false,
  },
  gponAdslHfc: {
    'Prueba de velocidad': false,
    'Verificar cableado': false,
    'Revisar configuración de red': false,
  },
  tvHfcDthIptv: {
    'Reiniciar decodificador': false,
    'Verificar señal': false,
    'Sincronizar control remoto': false,
  },
  otros: {
    'Consulta de facturación': false,
    'Actualización de datos': false,
  },
};

export default function PlantillasGenericasTab() {
  const [formData, setFormData] = useState({
    idLlamada: '',
    nombreContacto: '',
    nIncidencia: '',
    inconveniente: '',
    tipoServicio: '',
  });
  const [pruebasRealizadas, setPruebasRealizadas] = useState('');
  const [checkboxes, setCheckboxes] = useState(initialCheckboxState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const renderCheckboxGroup = (title: string, groupKey: keyof typeof initialCheckboxState) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {Object.keys(checkboxes[groupKey]).map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox id={`${groupKey}-${label}`} />
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
              <Textarea id="pruebasRealizadas" value={pruebasRealizadas} readOnly rows={8} className="bg-muted" />
            </div>
            <div className="flex gap-2">
              <Button>Copiar Plantilla</Button>
              <Button variant="outline">Limpiar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Checkboxes */}
      <div className="space-y-4">
        {renderCheckboxGroup('Nivel Cero', 'nivelCero')}
        {renderCheckboxGroup('GPON - ADSL - HFC', 'gponAdslHfc')}
        {renderCheckboxGroup('TV HFC - DTH - IPTV', 'tvHfcDthIptv')}
        {renderCheckboxGroup('Otros', 'otros')}
      </div>
    </div>
  );
}
