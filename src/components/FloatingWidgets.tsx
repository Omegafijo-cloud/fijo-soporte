'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Notebook, Users, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActiveWidget = 'notes' | 'users' | 'chat' | 'theme' | null;

export default function FloatingWidgets() {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);

  const toggleWidget = (widget: ActiveWidget) => {
    setActiveWidget(prev => (prev === widget ? null : widget));
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
              <Textarea placeholder="Escribe tus notas aquí..." rows={8} />
              <div className="flex gap-2 mt-4">
                <Button>Copiar Notas</Button>
                <Button variant="outline">Limpiar</Button>
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
                    <Textarea placeholder="Mantén una lista de usuarios aquí..." rows={8} />
                    <div className="flex gap-2 mt-4">
                        <Button>Copiar Lista</Button>
                        <Button variant="outline">Limpiar</Button>
                    </div>
                </CardContent>
            </Card>
        );
      case 'chat':
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Copilot Chat</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>El chatbot se mostrará aquí.</p>
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
                    <div>
                        <Label>Color Primario</Label>
                        <Input type="color" defaultValue="#0d0e38" />
                    </div>
                    <div>
                        <Label>Color de Fondo</Label>
                        <Input type="color" defaultValue="#f0f2f5" />
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
          >
            {getButtonIcon(widget)}
          </Button>
        ))}
      </div>

      {/* Panel de Widget Activo */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out",
          activeWidget ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="p-4 pt-0 h-[40vh]">
          {renderWidgetContent()}
        </div>
      </div>
    </>
  );
}
