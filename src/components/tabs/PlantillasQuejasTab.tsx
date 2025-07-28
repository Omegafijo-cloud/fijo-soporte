'use client';

import { useEffect } from 'react';
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

interface PlantillasQuejasTabProps {
    selectedTemplate: string;
    setSelectedTemplate: (value: string) => void;
    formData: { [key: string]: any };
    setFormData: (value: { [key: string]: any }) => void;
    checkboxValues: CheckboxState;
    setCheckboxValues: (value: CheckboxState) => void;
    pruebasCheckboxes: CheckboxState;
    setPruebasCheckboxes: (value: CheckboxState) => void;
    pruebasRealizadas: string;
    setPruebasRealizadas: (value: string) => void;
    initialPruebasCheckboxState: CheckboxState;
}

export default function PlantillasQuejasTab({
    selectedTemplate,
    setSelectedTemplate,
    formData,
    setFormData,
    checkboxValues,
    setCheckboxValues,
    pruebasCheckboxes,
    setPruebasCheckboxes,
    pruebasRealizadas,
    setPruebasRealizadas,
    initialPruebasCheckboxState,
}: PlantillasQuejasTabProps) {
  const { toast } = useToast();

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    // Resetear el estado al cambiar de plantilla
    setFormData({});
    setCheckboxValues({});
    setPruebasCheckboxes(initialPruebasCheckboxState);
    setPruebasRealizadas('');
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
    const newCheckboxes = {
      ...pruebasCheckboxes,
      [group]: {
        ...pruebasCheckboxes[group],
        [label]: checked,
      },
    };
    setPruebasCheckboxes(newCheckboxes);

    // Regenerar texto
    const allCheckedItems: string[] = [];
    for (const G in newCheckboxes) {
        const checkedItems = Object.keys(newCheckboxes[G])
          .filter((l) => newCheckboxes[G][l]);
        allCheckedItems.push(...checkedItems);
    }
    setPruebasRealizadas(allCheckedItems.join(', '));
  };

  useEffect(() => {
    const generatePruebasText = () => {
       const allCheckedItems: string[] = [];
      for (const group in pruebasCheckboxes) {
        if (pruebasCheckboxes[group]) {
          const checkedItems = Object.keys(pruebasCheckboxes[group])
            .filter((label) => pruebasCheckboxes[group][label]);
          allCheckedItems.push(...checkedItems);
        }
      }
      return allCheckedItems.join(', ');
    };
    const generatedText = generatePruebasText();
    if (pruebasRealizadas === generatedText || pruebasRealizadas === '') {
        setPruebasRealizadas(generatedText);
    }
  }, [pruebasCheckboxes, setPruebasRealizadas]);

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
    setPruebasRealizadas('');
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
  
  const renderPruebasCheckboxGroup = (title: string, groupKey: keyof CheckboxState) => (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          {pruebasCheckboxes[groupKey] && Object.keys(pruebasCheckboxes[groupKey]).map((label) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox 
                id={`pruebas-${groupKey}-${label}`} 
                checked={pruebasCheckboxes[groupKey][label] || false}
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
