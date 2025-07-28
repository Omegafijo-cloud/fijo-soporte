'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

type CheckboxState = {
  [group: string]: {
    [label: string]: boolean;
  };
};

type RadioGroupState = {
    [group: string]: string;
}

interface PlantillasQuejasTabProps {
    templates: MemoTemplate;
    selectedTemplate: string;
    setSelectedTemplate: (value: string) => void;
    formData: { [key: string]: any };
    setFormData: (value: { [key: string]: any }) => void;
    checkboxValues: CheckboxState;
    setCheckboxValues: (value: CheckboxState) => void;
    pruebasCheckboxes: CheckboxState;
    pruebasRealizadasText: string;
    setPruebasRealizadasText: (text: string) => void;
    onPruebasCheckboxChange: (group: string, label: string, checked: boolean) => void;
    onCopy: (text: string) => void;
    onClear: () => void;
}

export default function PlantillasQuejasTab({
    templates,
    selectedTemplate,
    setSelectedTemplate,
    formData,
    setFormData,
    checkboxValues,
    setCheckboxValues,
    pruebasCheckboxes,
    pruebasRealizadasText,
    setPruebasRealizadasText,
    onPruebasCheckboxChange,
    onCopy,
    onClear,
}: PlantillasQuejasTabProps) {
  const [radioValues, setRadioValues] = useState<RadioGroupState>({});

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    onClear();
    setRadioValues({});
    const template = templates[templateKey];
    const initialData: { [key: string]: any } = {};
    if (template) {
        template.fields.forEach(field => {
            initialData[field.id] = field.defaultValue || '';
        });
    }
    setFormData(initialData);
  };
  
  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleRadioChange = (group: string, value: string) => {
    setRadioValues((prev) => ({
      ...prev,
      [group]: value,
    }));
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
  
  const handleCopyClick = () => {
    if (!selectedTemplate) return;

    let template = `TIPO DE MEMO: ${selectedTemplate}\n\n`;
    
    // Checkboxes
    for (const group in checkboxValues) {
      if(!checkboxValues[group]) continue;
      const checkedItems = Object.keys(checkboxValues[group]).filter(label => checkboxValues[group][label]);
      if (checkedItems.length > 0) {
        template += `${group}: ${checkedItems.join(', ')}\n`;
      }
    }
    
    // Radio Groups
     for (const group in radioValues) {
        if (radioValues[group]) {
            template += `${group}: ${radioValues[group]}\n`;
        }
    }
    template += '\n';

    const templateDefinition = templates[selectedTemplate as keyof typeof templates];
    templateDefinition.fields.forEach(field => {
      template += `${field.label}: ${formData[field.id] || ''}\n`;
    });
    template += '\n';
    
    template += `PRUEBAS REALIZADAS: ${pruebasRealizadasText}`;

    onCopy(template.trim());
  }


  const renderDynamicFields = () => {
    if (!selectedTemplate) return null;
    const template = templates[selectedTemplate as keyof typeof templates];
    if (!template) return null;

    return (
      <>
        {template.checkboxes && Object.entries(template.checkboxes).map(([group, labels]) => (
            <div key={group} className="space-y-2 mb-4">
                 <Label className="font-bold">{group}</Label>
                 <div className="flex flex-wrap gap-4">
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
         {template.radioGroups && Object.entries(template.radioGroups).map(([group, labels]) => (
            <div key={group} className="space-y-2 mb-4">
                <Label className="font-bold">{group}</Label>
                <RadioGroup 
                    value={radioValues[group]} 
                    onValueChange={(value) => handleRadioChange(group, value)}
                    className="flex flex-wrap gap-4"
                >
                    {labels.map(label => (
                        <div key={label} className="flex items-center space-x-2">
                            <RadioGroupItem value={label} id={`${group}-${label}`} />
                            <Label htmlFor={`${group}-${label}`} className="font-normal">{label}</Label>
                        </div>
                    ))}
                </RadioGroup>
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
                checked={pruebasCheckboxes[groupKey]?.[label] || false}
                onCheckedChange={(checked) => onPruebasCheckboxChange(groupKey, label, checked as boolean)}
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
                  {Object.keys(templates).map(key => (
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
                            value={pruebasRealizadasText}
                            onChange={(e) => setPruebasRealizadasText(e.target.value)}
                            rows={4}
                        />
                    </div>
                     <div className="flex gap-2">
                        <Button onClick={handleCopyClick}>Copiar Memo</Button>
                        <Button variant="outline" onClick={onClear}>Limpiar Memo</Button>
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
