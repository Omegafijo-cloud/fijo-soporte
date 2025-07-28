'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CopiaRespaldoTab() {
  const [backupText, setBackupText] = useState('');
  const { toast } = useToast();

  const handleCopy = () => {
    if (!backupText) {
      toast({
        title: "Nada que copiar",
        description: "El área de respaldo está vacía.",
        variant: "destructive",
      });
      return;
    }
    navigator.clipboard.writeText(backupText).then(() => {
      toast({
        title: "Respaldo Copiado",
        description: "El contenido ha sido copiado al portapapeles.",
      });
    }).catch(err => {
      console.error("Error al copiar:", err);
      toast({
        title: "Error",
        description: "No se pudo copiar el respaldo.",
        variant: "destructive",
      });
    });
  };

  const handleClear = () => {
    setBackupText('');
    toast({
      title: "Respaldo Limpio",
      description: "Se ha borrado el contenido del área de respaldo.",
    });
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>Copia de Respaldo</CardTitle>
          <CardDescription>
            Guarda aquí copias de seguridad de plantillas o cualquier texto importante.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-textarea">Contenido del Respaldo:</Label>
            <Textarea
              id="backup-textarea"
              rows={15}
              placeholder="Pega o escribe aquí tu texto de respaldo..."
              value={backupText}
              onChange={(e) => setBackupText(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Respaldo
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Respaldo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
