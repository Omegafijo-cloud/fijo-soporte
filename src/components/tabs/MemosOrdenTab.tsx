'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const predefinedOrdenMemos = {
  'cableado ethernet': {
    fields: [
      { id: 'puntosRed', label: 'Puntos de red a instalar', type: 'text' },
      { id: 'distanciaCableado', label: 'Distancia de cableado (metros)', type: 'text' },
      { id: 'observacionesOrden', label: 'Observaciones', type: 'textarea' },
    ],
  },
  'orden de repetidores': {
    fields: [
      { id: 'cantidadRepetidores', label: 'Cantidad de Repetidores', type: 'text' },
      { id: 'modeloRepetidor', label: 'Modelo de Repetidor', type: 'text' },
      { id: 'ubicacionInstalacion', label: 'Ubicación de instalación', type: 'textarea' },
    ],
  },
};

interface MemosOrdenTabProps {
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  formData: { [key: string]: any };
  setFormData: (value: { [key: string]: any }) => void;
}

export default function MemosOrdenTab({
  selectedTemplate,
  setSelectedTemplate,
  formData,
  setFormData
}: MemosOrdenTabProps) {
  const { toast } = useToast();

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setFormData({});
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleCopy = () => {
    if (!selectedTemplate) return;

    let template = `TIPO DE MEMO DE ORDEN: ${selectedTemplate}\n\n`;
    
    const templateFields = predefinedOrdenMemos[selectedTemplate as keyof typeof predefinedOrdenMemos].fields;
    templateFields.forEach(field => {
      template += `${field.label}: ${formData[field.id] || ''}\n`;
    });

    navigator.clipboard.writeText(template);
    toast({
      title: "Memo de Orden Copiado",
      description: "La plantilla del memo ha sido copiada al portapapeles.",
    });
  };

  const handleClear = () => {
    setSelectedTemplate('');
    setFormData({});
  };

  const renderDynamicFields = () => {
    if (!selectedTemplate) return null;
    const template = predefinedOrdenMemos[selectedTemplate as keyof typeof predefinedOrdenMemos];
    if (!template) return null;

    return (
      <div className="space-y-4">
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
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memos de Orden</CardTitle>
        <CardDescription>Seleccione una plantilla para generar el memo de orden.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Memo</Label>
          <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una plantilla..." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(predefinedOrdenMemos).map(key => (
                <SelectItem key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTemplate && (
          <div className="space-y-4 pt-4 border-t">
            {renderDynamicFields()}
            <div className="flex gap-2">
              <Button onClick={handleCopy}>Copiar Memo de Orden</Button>
              <Button variant="outline" onClick={handleClear}>Limpiar Memo de Orden</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
