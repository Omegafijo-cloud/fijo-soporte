'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Define la estructura de las plantillas de memos
const memoTemplates = {
  'INTERNET DSL': {
    fields: [
      { id: 'luzPortadora', label: 'Luz Portadora', type: 'text' },
      { id: 'snr', label: 'SNR', type: 'text' },
      { id: 'atenuacion', label: 'Atenuación', type: 'text' },
      { id: 'problemaReportado', label: 'Problema Reportado', type: 'textarea' },
    ],
    checkboxes: {
      'Quien genera queja': ['TITULAR', 'TERCERO'],
    }
  },
  'TV DTH': {
    fields: [
      { id: 'calidadSenal', label: 'Calidad de Señal', type: 'text' },
      { id: 'codigoError', label: 'Código de Error', type: 'text' },
      { id: 'canalesAfectados', label: 'Canales Afectados', type: 'textarea' },
    ],
     checkboxes: {
      'Quien genera queja': ['TITULAR', 'TERCERO'],
    }
  },
  // Agrega más plantillas aquí
};

type CheckboxState = {
  [group: string]: {
    [label: string]: boolean;
  };
};

const initialPruebasCheckboxState: CheckboxState = {
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


export default function PlantillasQuejasTab() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [checkboxValues, setCheckboxValues] = useState<CheckboxState>({});
  const [pruebasRealizadas, setPruebasRealizadas] = useState('');
  const [pruebasCheckboxes, setPruebasCheckboxes] = useState<CheckboxState>(initialPruebasCheckboxState);
  const { toast } = useToast();

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    // Resetear el estado al cambiar de plantilla
    setFormData({});
    setCheckboxValues({});
    setPruebasCheckboxes(initialPruebasCheckboxState);
  };
  
  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (group: string, label: string, checked: boolean) => {
     setCheckboxValues((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [label]: checked,
      },
    }));
  };
  
  const handlePruebasCheckboxChange = (group: string, label: string, checked: boolean) => {
    setPruebasCheckboxes((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [label]: checked,
      },
    }));
  };

  useEffect(() => {
    const generatePruebasText = () => {
       const allCheckedItems: string[] = [];
      for (const group in pruebasCheckboxes) {
        const checkedItems = Object.keys(pruebasCheckboxes[group])
          .filter((label) => pruebasCheckboxes[group][label]);
        allCheckedItems.push(...checkedItems);
      }
      return allCheckedItems.join(', ');
    };
    setPruebasRealizadas(generatePruebasText());
  }, [pruebasCheckboxes]);

  const handleCopy = () => {
    if (!selectedTemplate) return;

    let template = `TIPO DE MEMO: ${selectedTemplate}\n\n`;

    // Añadir valores de los checkboxes de "quien genera"
    for (const group in checkboxValues) {
      const checkedItems = Object.keys(checkboxValues[group]).filter(label => checkboxValues[group][label]);
      if (checkedItems.length > 0) {
        template += `${group}: ${checkedItems.join(', ')}\n`;
      }
    }
    template += '\n';

    // Añadir valores de los campos de texto y textarea
    const templateFields = memoTemplates[selectedTemplate as keyof typeof memoTemplates].fields;
    templateFields.forEach(field => {
      template += `${field.label}: ${formData[field.id] || ''}\n`;
    });
    template += '\n';
    
    // Añadir pruebas realizadas
    template += `PRUEBAS REALIZADAS: ${pruebasRealizadas}`;

    navigator.clipboard.writeText(template.trim());
    toast({
      title: "Memo Copiado",
      description: "La plantilla del memo ha sido copiada al portapapeles.",
    });
  }

  const handleClear = () => {
    setSelectedTemplate('');
    setFormData({});
    setCheckboxValues({});
    setPruebasCheckboxes(initialPruebasCheckboxState);
    // El valor del select se controla externamente, así que al setear el state a '' se limpia.
  }

  const renderDynamicFields = () => {
    if (!selectedTemplate) return null;
    const template = memoTemplates[selectedTemplate as keyof typeof memoTemplates];
    if (!template) return null;

    return (
      <>
        {template.checkboxes && Object.entries(template.checkboxes).map(([group, labels]) => (
            <div key={group} className="space-y-2 mb-4">
                 <Label className="font-bold">{group}</Label>
                 <div className="flex gap-4">
                    {labels.map(label => (
                        <div key={label} className="flex items-center space-x-2">
                             <Checkbox 
                                id={`${group}-${label}`}
                                checked={checkboxValues[group]?.[label] || false}
                                onCheckedChange={(checked) => handleCheckboxChange(group, label, checked as boolean)}
                             />
                             <Label htmlFor={`${group}-${label}`} className="font-normal">{label}</Label>
                        </div>
                    ))}
                 </div>
            </div>
        ))}
        {template.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.id} value={formData[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            ) : (
              <Input id={field.id} type={field.type} value={formData[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            )}
          </div>
        ))}
      </>
    );
  };
  
  const renderPruebasCheckboxGroup = (title: string, groupKey: keyof typeof initialPruebasCheckboxState) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {Object.keys(pruebasCheckboxes[groupKey]).map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox 
                id={`pruebas-${groupKey}-${label}`} 
                checked={pruebasCheckboxes[groupKey][label]}
                onCheckedChange={(checked) => handlePruebasCheckboxChange(groupKey, label, checked as boolean)}
              />
              <Label htmlFor={`pruebas-${groupKey}-${label}`} className="font-normal">
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
            <CardTitle>Plantilla de Queja</CardTitle>
            <CardDescription>Seleccione un tipo de memo para generar el formulario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Memo de Queja</Label>
              <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una plantilla..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(memoTemplates).map(key => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedTemplate && (
                <div className="space-y-4 pt-4 border-t">
                    {renderDynamicFields()}
                     <div className="space-y-2">
                        <Label htmlFor="pruebasRealizadasMemo">PRUEBAS REALIZADAS</Label>
                        <Textarea 
                            id="pruebasRealizadasMemo" 
                            value={pruebasRealizadas} 
                            onChange={(e) => setPruebasRealizadas(e.target.value)}
                            rows={4}
                        />
                    </div>
                     <div className="flex gap-2">
                        <Button onClick={handleCopy}>Copiar Memo</Button>
                        <Button variant="outline" onClick={handleClear}>Limpiar Memo</Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

       {/* Columna Derecha: Checkboxes de Pruebas */}
       <div className="space-y-4">
        {renderPruebasCheckboxGroup('Nivel Cero', 'Nivel Cero')}
        {renderPruebasCheckboxGroup('GPON - ADSL - HFC', 'GPON - ADSL - HFC')}
        {renderPruebasCheckboxGroup('TV HFC - DTH - IPTV', 'TV HFC - DTH - IPTV')}
        {renderPruebasCheckboxGroup('Otros', 'Otros')}
      </div>
    </div>
  );
}
