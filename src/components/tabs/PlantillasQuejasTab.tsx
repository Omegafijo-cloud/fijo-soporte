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
  'Nivel Cero (Memos)': {
    'Reinicio de equipo': false,
    'Validación de cableado': false,
  },
  'GPON - ADSL - HFC (Memos)': {
    'Prueba de velocidad (Memo)': false,
    'Verificar ONT/Router': false,
  },
  'TV HFC - DTH - IPTV (Memos)': {
    'Reinicio de decodificador (Memo)': false,
    'Verificar conexiones de video': false,
  },
  'Otros (Memos)': {
    'Consulta de facturación (Memo)': false,
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
      let text = '';
      for (const group in pruebasCheckboxes) {
        const checkedItems = Object.keys(pruebasCheckboxes[group]).filter(
          (label) => pruebasCheckboxes[group][label]
        );
        if (checkedItems.length > 0) {
          text += `${group.toUpperCase()}:\n- ${checkedItems.join('\n- ')}\n\n`;
        }
      }
      return text.trim();
    };
    setPruebasRealizadas(generatePruebasText());
  }, [pruebasCheckboxes]);


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
                        <Textarea id="pruebasRealizadasMemo" value={pruebasRealizadas} readOnly rows={8} className="bg-muted" />
                    </div>
                     <div className="flex gap-2">
                        <Button>Copiar Memo</Button>
                        <Button variant="outline" onClick={() => handleTemplateChange('')}>Limpiar Memo</Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>

       {/* Columna Derecha: Checkboxes de Pruebas */}
       <div className="space-y-4">
        {renderPruebasCheckboxGroup('Nivel Cero (Memos)', 'Nivel Cero (Memos)')}
        {renderPruebasCheckboxGroup('GPON - ADSL - HFC (Memos)', 'GPON - ADSL - HFC (Memos)')}
        {renderPruebasCheckboxGroup('TV HFC - DTH - IPTV (Memos)', 'TV HFC - DTH - IPTV (Memos)')}
        {renderPruebasCheckboxGroup('Otros (Memos)', 'Otros (Memos)')}
      </div>
    </div>
  );
}
