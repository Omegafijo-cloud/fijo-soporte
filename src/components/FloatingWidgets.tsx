'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Notebook, Users, Palette, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { hexToHsl } from '@/lib/utils';
import { Separator } from './ui/separator';

type ActiveWidget = 'notes' | 'users' | 'theme' | null;

interface FloatingWidgetsProps {
    notesText: string;
    setNotesText: (text: string) => void;
    usersText: string;
    setUsersText: (text: string) => void;
}

const defaultThemeHsl = {
  primary: '236 65% 33%',
  secondary: '0 0% 94%',
  accent: '282 69% 38%',
  background: '0 0% 100%',
  foreground: '236 65% 13%',
};

const defaultThemeHex = {
    primary: '#1A237E',
    secondary: '#F0F0F0',
    accent: '#6A1B9A',
    background: '#FFFFFF',
    foreground: '#101436',
};

const colorPalettes = [
  { name: 'Omega', c: { primary: '#1A237E', secondary: '#F0F0F0', accent: '#6A1B9A', background: '#FFFFFF', foreground: '#101436' } },
  { name: 'Abismo', c: { primary: '#94a3b8', secondary: '#1e293b', accent: '#334155', background: '#0f172a', foreground: '#f8fafc' } },
  { name: 'Bosque', c: { primary: '#166534', secondary: '#dcfce7', accent: '#bbf7d0', background: '#f0fdf4', foreground: '#14532d' } },
  { name: 'Amanecer', c: { primary: '#c2410c', secondary: '#ffedd5', accent: '#fed7aa', background: '#fff7ed', foreground: '#7c2d12' } },
  { name: 'Medianoche', c: { primary: '#3b82f6', secondary: '#334155', accent: '#0ea5e9', background: '#1e293b', foreground: '#e2e8f0' } },
  { name: 'Esmeralda', c: { primary: '#059669', secondary: '#d1fae5', accent: '#6ee7b7', background: '#ecfdf5', foreground: '#065f46' } },
  { name: 'Rubí', c: { primary: '#dc2626', secondary: '#fee2e2', accent: '#fca5a5', background: '#fef2f2', foreground: '#991b1b' } },
];


export default function FloatingWidgets({
    notesText,
    setNotesText,
    usersText,
    setUsersText,
}: FloatingWidgetsProps) {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);
  const { toast } = useToast();
  
  const [colors, setColors] = useState(defaultThemeHex);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  const applyTheme = (themeColors: typeof defaultThemeHex) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(themeColors.primary));
    root.style.setProperty('--secondary', hexToHsl(themeColors.secondary));
    root.style.setProperty('--accent', hexToHsl(themeColors.accent));
    root.style.setProperty('--background', hexToHsl(themeColors.background));
    root.style.setProperty('--foreground', hexToHsl(themeColors.foreground));
    setColors(themeColors);
  };

  const handleSetPalette = (palette: typeof defaultThemeHex, name: string) => {
    applyTheme(palette);
    toast({
        title: `Tema '${name}' Aplicado`,
        description: 'La paleta de colores ha sido actualizada.',
    });
  }

  const handleColorChange = (colorType: keyof typeof colors, value: string) => {
    const newTheme = { ...colors, [colorType]: value };
    applyTheme(newTheme);
  };
  
  const handleRestoreDefaults = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary', defaultThemeHsl.primary);
    root.style.setProperty('--secondary', defaultThemeHsl.secondary);
    root.style.setProperty('--accent', defaultThemeHsl.accent);
    root.style.setProperty('--background', defaultThemeHsl.background);
    root.style.setProperty('--foreground', defaultThemeHsl.foreground);
    setColors(defaultThemeHex);
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
      case 'theme':
        return (
            <Card className="h-full overflow-y-auto">
                <CardHeader>
                    <CardTitle>Personalizar Tema</CardTitle>
                    <CardDescription>Elige una paleta o personaliza los colores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className='text-sm font-medium'>Paletas Predefinidas</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                           {colorPalettes.map(palette => (
                                <Button key={palette.name} variant="outline" onClick={() => handleSetPalette(palette.c, palette.name)} className="h-auto py-2">
                                    <div className="flex flex-col items-start gap-2 w-full">
                                        <span>{palette.name}</span>
                                        <div className="flex -space-x-1">
                                            <div className="w-5 h-5 rounded-full border" style={{backgroundColor: palette.c.primary}}></div>
                                            <div className="w-5 h-5 rounded-full border" style={{backgroundColor: palette.c.secondary}}></div>
                                            <div className="w-5 h-5 rounded-full border" style={{backgroundColor: palette.c.accent}}></div>
                                            <div className="w-5 h-5 rounded-full border" style={{backgroundColor: palette.c.background}}></div>
                                            <div className="w-5 h-5 rounded-full border" style={{backgroundColor: palette.c.foreground}}></div>
                                        </div>
                                    </div>
                                </Button>
                           ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <Label className='text-sm font-medium'>Colores Personalizados</Label>
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center justify-between">
                                <Label>Primario</Label>
                                <Input type="color" value={colors.primary} onChange={(e) => handleColorChange('primary', e.target.value)} className="p-1 h-10 w-24"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Secundario</Label>
                                <Input type="color" value={colors.secondary} onChange={(e) => handleColorChange('secondary', e.target.value)} className="p-1 h-10 w-24"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Acento</Label>
                                <Input type="color" value={colors.accent} onChange={(e) => handleColorChange('accent', e.target.value)} className="p-1 h-10 w-24"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Fondo</Label>
                                <Input type="color" value={colors.background} onChange={(e) => handleColorChange('background', e.target.value)} className="p-1 h-10 w-24"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Texto</Label>
                                <Input type="color" value={colors.foreground} onChange={(e) => handleColorChange('foreground', e.target.value)} className="p-1 h-10 w-24"/>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <Button onClick={handleRestoreDefaults} variant="outline" className="w-full">
                        Restaurar Predeterminados
                    </Button>
                </CardContent>
            </Card>
        );
      default:
        return null;
    }
  };

  const getButtonIcon = (widget: ActiveWidget | 'chat') => {
    if (activeWidget === widget || (widget === 'chat' && isCopilotOpen)) {
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
  
  const toggleCopilot = () => {
    setIsCopilotOpen(prev => !prev);
  }

  return (
    <>
      {/* Botones Flotantes */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
            size="icon"
            variant="outline"
            className="rounded-full h-14 w-14 shadow-lg bg-background"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
        >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        {(['notes', 'users', 'theme'] as ActiveWidget[]).map(widget => (
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
         <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={toggleCopilot}
            aria-label="Abrir widget de OMEGA Copilot"
        >
            {getButtonIcon('chat')}
        </Button>
      </div>
      
       {/* Panel de Copilot */}
      <div className={cn(
          "fixed bottom-24 right-4 z-40 transition-transform duration-300 ease-in-out w-96 h-[60vh] rounded-lg border-primary shadow-2xl overflow-hidden",
          isCopilotOpen ? 'translate-x-0' : 'translate-x-[150%]'
      )}>
            <iframe 
                src="https://copilotstudio.microsoft.com/environments/Default-35058e0b-9a5c-4d1c-aa8e-08d02cd58b1a/bots/cr32d_marketingDigitalPro/webchat?__version__=2"
                className="w-full h-full border-0"
                title="OMEGA Copilot"
            ></iframe>
      </div>


      {/* Panel de Widget Activo */}
      <div
        className={cn(
          "fixed bottom-24 left-0 right-0 z-40 transition-transform duration-300 ease-in-out",
          "sm:bottom-4 sm:left-auto sm:right-24 sm:top-auto sm:h-auto sm:w-96",
          activeWidget ? "translate-y-0" : "translate-y-[150%]"
        )}
      >
        <div className="p-4 pt-0 h-[60vh] sm:h-auto max-h-[60vh] sm:max-h-[70vh]">
          {renderWidgetContent()}
        </div>
      </div>
    </>
  );
}

    