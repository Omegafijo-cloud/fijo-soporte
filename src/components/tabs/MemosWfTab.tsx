'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const predefinedWfMemos = {
  'migracion gpon': {
    fields: [
      { id: 'tipoReporte', label: 'Tipo de reporte', type: 'text', defaultValue: 'Migración' },
      { id: 'aceptaMigracion', label: 'Acepta migración', type: 'select', options: ['SI', 'NO'] },
      { id: 'observacionesMigracion', label: 'Observaciones', type: 'textarea' },
    ],
  },
  'inconvenientes con vpn': {
    fields: [
      { id: 'nombreVpn', label: 'Nombre de la VPN', type: 'text' },
      { id: 'errorVpn', label: 'Error que presenta', type: 'text' },
      { id: 'desdeCuandoVpn', label: 'Desde cuando presenta el inconveniente', type: 'text' },
      { id: 'pruebasVpn', label: 'Pruebas realizadas', type: 'textarea' },
    ],
  },
};

interface MemosWfTabProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  formData: { [key: string]: any };
  setFormData: (value: { [key: string]: any }) => void;
}

export default function MemosWfTab({ 
  selectedTemplate, 
  setSelectedTemplate, 
  formData, 
  setFormData 
}: MemosWfTabProps) {
  const { toast } = useToast();

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    // Pre-fill default values
    const template = predefinedWfMemos[templateKey as keyof typeof predefinedWfMemos];
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

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({...prev, [id]: value}));
  }
  
  const handleCopy = () => {
    if (!selectedTemplate) return;

    let template = `TIPO DE MEMO DE WF: ${selectedTemplate}\n\n`;
    
    const templateFields = predefinedWfMemos[selectedTemplate as keyof typeof predefinedWfMemos].fields;
    templateFields.forEach(field => {
      template += `${field.label}: ${formData[field.id] || ''}\n`;
    });

    navigator.clipboard.writeText(template);
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
    const template = predefinedWfMemos[selectedTemplate as keyof typeof predefinedWfMemos];
    if (!template) return null;

    return (
      <div className="space-y-4">
        {template.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.id} value={formData[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            ) : field.type === 'select' ? (
                <Select onValueChange={(value) => handleSelectChange(field.id, value)} value={formData[field.id] || ''}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Seleccione ${field.label}...`} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
              <Input id={field.id} type={field.type} value={formData[field.id] || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} readOnly={!!field.defaultValue} />
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
          <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una plantilla..." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(predefinedWfMemos).map(key => (
                <SelectItem key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
