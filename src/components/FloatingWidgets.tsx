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
import { hexToHsl } from '@/lib/utils';
import { Separator } from './ui/separator';

type ActiveWidget = 'notes' | 'users' | 'chat' | 'theme' | null;

interface FloatingWidgetsProps {
    notesText: string;
    setNotesText: (text: string) => void;
    usersText: string;
    setUsersText: (text: string) => void;
}

const defaultTheme = {
  primary: '222.2 47.4% 11.2%',
  background: '0 0% 100%',
  accent: '210 40% 96.1%',
};

const defaultThemeHex = {
    primary: '#1c3d5a',
    background: '#ffffff',
    accent: '#f0f2f5',
};

const colorPalettes = [
  { name: 'Omega', colors: { primary: '#1c3d5a', background: '#ffffff', accent: '#f0f2f5' } },
  { name: 'Abismo', colors: { primary: '#e2e8f0', background: '#0f172a', accent: '#1e293b' } },
  { name: 'Bosque', colors: { primary: '#2f6241', background: '#f0f5f1', accent: '#dbece2' } },
  { name: 'Amanecer', colors: { primary: '#c2410c', background: '#fff7ed', accent: '#ffedd5' } },
  { name: 'Corporativo', colors: { primary: '#2563eb', background: '#ffffff', accent: '#f0f9ff' } },
];


export default function FloatingWidgets({
    notesText,
    setNotesText,
    usersText,
    setUsersText,
}: FloatingWidgetsProps) {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);
  const { toast } = useToast();
  
  const [primaryColor, setPrimaryColor] = useState(defaultThemeHex.primary);
  const [backgroundColor, setBackgroundColor] = useState(defaultThemeHex.background);
  const [accentColor, setAccentColor] = useState(defaultThemeHex.accent);

  const applyTheme = (theme: {primary: string, background: string, accent: string}) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(theme.primary));
    root.style.setProperty('--background', hexToHsl(theme.background));
    root.style.setProperty('--accent', hexToHsl(theme.accent));
  };

  const handleSetPalette = (palette: { primary: string, background: string, accent: string }) => {
    setPrimaryColor(palette.primary);
    setBackgroundColor(palette.background);
    setAccentColor(palette.accent);
    applyTheme(palette);
    toast({
        title: `Tema ${colorPalettes.find(p => p.colors.primary === palette.primary)?.name} Aplicado`,
        description: 'La paleta de colores ha sido actualizada.',
    });
  }

  const handleColorChange = (colorType: 'primary' | 'background' | 'accent', value: string) => {
    let newTheme = { primary: primaryColor, background: backgroundColor, accent: accentColor };
    if (colorType === 'primary') {
      setPrimaryColor(value);
      newTheme.primary = value;
    } else if (colorType === 'background') {
      setBackgroundColor(value);
      newTheme.background = value;
    } else if (colorType === 'accent') {
        setAccentColor(value);
        newTheme.accent = value;
    }
    applyTheme(newTheme);
  };

  const handleRestoreDefaults = () => {
    setPrimaryColor(defaultThemeHex.primary);
    setBackgroundColor(defaultThemeHex.background);
    setAccentColor(defaultThemeHex.accent);
    const root = document.documentElement;
    root.style.setProperty('--primary', defaultTheme.primary);
    root.style.setProperty('--background', defaultTheme.background);
    root.style.setProperty('--accent', defaultTheme.accent);
     toast({
      title: 'Tema Restaurado',
      description: 'Los colores han vuelto a sus valores predeterminados.',
    });
  };

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
            <Card className="h-full overflow-y-auto">
                <CardHeader>
                    <CardTitle>Personalizar Tema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className='text-sm font-medium'>Paletas Predefinidas</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           {colorPalettes.map(palette => (
                                <Button key={palette.name} variant="outline" onClick={() => handleSetPalette(palette.colors)}>
                                    {palette.name}
                                </Button>
                           ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Label className='text-sm font-medium'>Colores Personalizados</Label>
                        <div className="space-y-3 mt-2">
                            <div className="space-y-2">
                                <Label>Color Primario</Label>
                                <Input type="color" value={primaryColor} onChange={(e) => handleColorChange('primary', e.target.value)} className="p-1 h-10"/>
                            </div>
                            <div className="space-y-2">
                                <Label>Color de Fondo</Label>
                                <Input type="color" value={backgroundColor} onChange={(e) => handleColorChange('background', e.target.value)} className="p-1 h-10"/>
                            </div>
                             <div className="space-y-2">
                                <Label>Color de Acento</Label>
                                <Input type="color" value={accentColor} onChange={(e) => handleColorChange('accent', e.target.value)} className="p-1 h-10"/>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <Button onClick={handleRestoreDefaults}>Restaurar Predeterminados</Button>
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
        <div className="p-4 pt-0 h-[50vh] sm:h-auto max-h-[50vh] sm:max-h-[70vh]">
          {renderWidgetContent()}
        </div>
      </div>
    </>
  );
}

    