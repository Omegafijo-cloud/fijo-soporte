'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

type MemoTemplate = {
  [key: string]: {
    fields: any[];
  }
}

interface MemosWfTabProps {
  templates: MemoTemplate;
  setTemplates: (templates: MemoTemplate) => void;
  selectedTemplate: string;
  setSelectedTemplate: (value: string) => void;
  formData: { [key: string]: any };
  setFormData: (value: { [key: string]: any }) => void;
  onCopy: (text: string) => void;
  onClear: () => void;
}

export default function MemosWfTab({ 
  templates,
  setTemplates,
  selectedTemplate, 
  setSelectedTemplate, 
  formData, 
  setFormData,
  onCopy,
  onClear,
}: MemosWfTabProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = templates[templateKey];
    const initialData: { [key: string]: any } = {};
    if (template) {
        template.fields.forEach(field => {
          initialData[field.id] = field.defaultValue || '';
        });
    }
    setFormData(initialData);
  };
  
  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) {
        toast({ title: 'Error', description: 'El nombre de la plantilla no puede estar vacío.', variant: 'destructive' });
        return;
    }
    const newKey = newTemplateName.trim().toLowerCase().replace(/\s+/g, ' ');
    if (templates[newKey]) {
        toast({ title: 'Error', description: 'Ya existe una plantilla con este nombre.', variant: 'destructive' });
        return;
    }
    setTemplates({
        ...templates,
        [newKey]: { fields: [{ id: 'asunto', label: 'Asunto', type: 'text' }] }
    });
    setNewTemplateName('');
    setIsAddDialogOpen(false);
    toast({ title: 'Éxito', description: 'Plantilla añadida correctamente.' });
  }

  const handleRemoveTemplate = (e: React.MouseEvent, templateKey: string) => {
    e.stopPropagation();
    const newTemplates = { ...templates };
    delete newTemplates[templateKey];
    setTemplates(newTemplates);
    if (selectedTemplate === templateKey) {
        setSelectedTemplate('');
        setFormData({});
    }
    toast({ title: 'Éxito', description: 'Plantilla eliminada correctamente.' });
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleCopyClick = () => {
    if (!selectedTemplate) return;

    let templateText = `TIPO DE MEMO DE WF: ${selectedTemplate.toUpperCase()}\n\n`;
    
    const template = templates[selectedTemplate];
    
    template.fields.forEach(field => {
      templateText += `${field.label}: ${formData[field.id] || ''}\n`;
    });

    onCopy(templateText.trim());
  };


  const renderDynamicFields = () => {
    if (!selectedTemplate) return null;
    const template = templates[selectedTemplate];
    if (!template) return null;

    return (
      <div className="space-y-4">
        {template.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.id} value={formData[field.id] ?? ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
            ) : (
              <Input id={field.id} type={field.type} value={formData[field.id] ?? ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />
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
          <div className="flex gap-2">
            <Select onValueChange={handleTemplateChange} value={selectedTemplate}>
                <SelectTrigger>
                <SelectValue placeholder="Seleccione una plantilla..." />
                </SelectTrigger>
                <SelectContent>
                {Object.keys(templates).map(key => (
                     <div key={key} className="relative flex items-center">
                        <SelectItem value={key} className="w-full pr-8">
                           <span className="capitalize">{key}</span>
                        </SelectItem>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-destructive/10" 
                          onClick={(e) => handleRemoveTemplate(e, key)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Añadir</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir Nueva Plantilla de WF</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="new-template-name-wf">Nombre de la Plantilla</Label>
                        <Input id="new-template-name-wf" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddTemplate}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {selectedTemplate && (
          <div className="space-y-4 pt-4 border-t">
            {renderDynamicFields()}
            <div className="flex gap-2">
              <Button onClick={handleCopyClick}>Copiar Memo WF</Button>
              <Button variant="outline" onClick={onClear}>Limpiar</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
