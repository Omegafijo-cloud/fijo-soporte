'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Notebook, Users, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ActiveWidget = 'notes' | 'users' | 'chat' | 'theme' | null;

export default function FloatingWidgets() {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);
  const [notesText, setNotesText] = useState('');
  const [usersText, setUsersText] = useState('');
  const { toast } = useToast();

  const toggleWidget = (widget: ActiveWidget) => {
    setActiveWidget(prev => (prev === widget ? null : widget));
  };
  
  const handleCopyNotes = () => {
    if (!notesText) return;
    navigator.clipboard.writeText(notesText);
    toast({
      title: 'Notas Copiadas',
      description: 'Tus notas rápidas han sido copiadas al portapapeles.',
    });
  };
  
  const handleCopyUsers = () => {
    if (!usersText) return;
    navigator.clipboard.writeText(usersText);
    toast({
      title: 'Lista Copiada',
      description: 'La lista de usuarios ha sido copiada al portapapeles.',
    });
  };

  const renderWidgetContent = () => {
    switch (activeWidget) {
      case 'notes':
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Escribe tus notas aquí..." 
                rows={8}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCopyNotes}>Copiar Notas</Button>
                <Button variant="outline" onClick={() => setNotesText('')}>Limpiar</Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'users':
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                      placeholder="Mantén una lista de usuarios aquí..." 
                      rows={8}
                      value={usersText}
                      onChange={(e) => setUsersText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleCopyUsers}>Copiar Lista</Button>
                        <Button variant="outline" onClick={() => setUsersText('')}>Limpiar</Button>
                    </div>
                </CardContent>
            </Card>
        );
      case 'chat':
        return (
            <Card className="h-full flex items-center justify-center">
                <CardHeader>
                    <CardTitle>Copilot Chat</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">El chatbot se mostrará aquí.</p>
                </CardContent>
            </Card>
        );
      case 'theme':
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Personalizar Tema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Color Primario</Label>
                        <Input type="color" defaultValue="#6A1B9A" className="p-1 h-10"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Color de Fondo</Label>
                        <Input type="color" defaultValue="#00BCD4" className="p-1 h-10"/>
                    </div>
                     <div className="space-y-2">
                        <Label>Color de Acento</Label>
                        <Input type="color" defaultValue="#1A237E" className="p-1 h-10"/>
                    </div>
                    <Button>Restaurar Predeterminados</Button>
                </CardContent>
            </Card>
        );
      default:
        return null;
    }
  };

  const getButtonIcon = (widget: ActiveWidget) => {
    if (activeWidget === widget) {
      return <X className="h-6 w-6" />;
    }
    switch (widget) {
      case 'notes':
        return <Notebook className="h-6 w-6" />;
      case 'users':
        return <Users className="h-6 w-6" />;
      case 'chat':
        return <MessageSquare className="h-6 w-6" />;
      case 'theme':
        return <Palette className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Botones Flotantes */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {(['notes', 'users', 'chat', 'theme'] as ActiveWidget[]).map(widget => (
          <Button
            key={widget}
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => toggleWidget(widget)}
            aria-label={`Abrir widget de ${widget}`}
          >
            {getButtonIcon(widget)}
          </Button>
        ))}
      </div>

      {/* Panel de Widget Activo */}
      <div
        className={cn(
          "fixed bottom-24 left-0 right-0 z-40 transition-transform duration-300 ease-in-out",
          "sm:bottom-4 sm:left-auto sm:right-24 sm:top-auto sm:h-auto sm:w-96",
          activeWidget ? "translate-y-0" : "translate-y-[150%]"
        )}
      >
        <div className="p-4 pt-0 h-[50vh] sm:h-auto max-h-[50vh]">
          {renderWidgetContent()}
        </div>
      </div>
    </>
  );
}
