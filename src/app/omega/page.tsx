'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, LogOut, FileText, Wrench, ArrowRightLeft, Megaphone, Save, StickyNote, Copy, Trash2, X, Users, MessageSquare, Palette, RotateCcw, Play, Square, RotateCw } from 'lucide-react';
import { PlantillasTab } from '@/components/plantillas-tab';
import { HerramientasTab } from '@/components/herramientas-tab';
import { TransferenciasTab } from '@/components/transferencias-tab';
import { AvisosTab } from '@/components/avisos-tab';
import { CopiaRespaldoTab } from '@/components/copia-respaldo-tab';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// -- Funciones para convertir HSL a Hex y viceversa --
const hslStringToObj = (hslStr: string) => {
    const [h, s, l] = hslStr.match(/\d+/g)?.map(Number) || [0, 0, 0];
    return { h, s, l };
};

const hslObjToCssVar = (hslObj: { h: number, s: number, l: number }) => {
    return `${hslObj.h} ${hslObj.s}% ${hslObj.l}%`;
};

const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return `#${[8, 4, 0].map(n =>
        Math.round(f(n) * 255).toString(16).padStart(2, '0')
    ).join('')}`;
};

const hexToHsl = (hex: string) => {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const defaultThemeColors = {
    background: { h: 240, s: 6, l: 10 },
    foreground: { h: 220, s: 13, l: 95 },
    primary: { h: 265, s: 70, l: 65 },
    accent: { h: 180, s: 80, l: 55 },
};


export default function OmegaPage() {
  const [activeTab, setActiveTab] = useState('plantillas');
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [quickNotes, setQuickNotes] = useState('');
  const [userList, setUserList] = useState('');
  const { toast } = useToast();
  
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  // State para los colores del tema
  const [themeColors, setThemeColors] = useState(defaultThemeColors);

  // Efecto para el temporizador
  useEffect(() => {
    if (isRunning) {
        timerRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timerRef.current!);
                    setIsRunning(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    } else {
        clearInterval(timerRef.current!);
    }

    return () => clearInterval(timerRef.current!);
  }, [isRunning]);

  // Efecto para aplicar los colores al DOM
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', hslObjToCssVar(themeColors.background));
    root.style.setProperty('--foreground', hslObjToCssVar(themeColors.foreground));
    root.style.setProperty('--primary', hslObjToCssVar(themeColors.primary));
    root.style.setProperty('--accent', hslObjToCssVar(themeColors.accent));
  }, [themeColors]);
  
  const handleWidgetToggle = (widgetName: string) => {
    setActiveWidget(prev => (prev === widgetName ? null : widgetName));
  };
  
  const handleCopyFromWidget = (content: string, title: string) => {
    if (!content) {
      toast({
        title: `Nada que copiar en ${title}`,
        variant: 'destructive',
      });
      return;
    }
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: `${title} copiado`,
        description: 'El contenido ha sido copiado al portapapeles.',
      });
    });
  };

  const handleClearWidget = (setter: (value: string) => void, title: string) => {
    setter('');
    toast({
      title: `${title} limpiado`,
      description: 'El contenido ha sido borrado.',
    });
  };

  const handleThemeColorChange = (colorName: keyof typeof themeColors, hexValue: string) => {
    setThemeColors(prev => ({
        ...prev,
        [colorName]: hexToHsl(hexValue)
    }));
  };

  const resetTheme = () => {
    setThemeColors(defaultThemeColors);
    toast({
        title: "Tema Restaurado",
        description: "Los colores han sido restaurados a sus valores por defecto.",
    });
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTimerStart = () => setIsRunning(true);
  const handleTimerStop = () => setIsRunning(false);
  const handleTimerReset = () => {
    setIsRunning(false);
    setTime(300); // Reset to 5 minutes
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'plantillas':
        return <PlantillasTab />;
      case 'herramientas':
        return <HerramientasTab />;
      case 'transferencias':
        return <TransferenciasTab />;
      case 'avisos':
        return <AvisosTab />;
      case 'copia-respaldo':
        return <CopiaRespaldoTab />;
      default:
        return <PlantillasTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Barra Superior Fija */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 bg-card border-b">
        <div className="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 10.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M12 5c-1.93 0-3.5 1.57-3.5 3.5S10.07 12 12 12s3.5-1.57 3.5-3.5S13.93 5 12 5zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5S12.83 10 12 10z"/></svg>
          <h1 className="text-xl font-bold text-foreground">OMEGA-FIJO SOPORTE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
            <Timer className="h-6 w-6 text-primary" />
            <span className="font-mono text-lg font-semibold">{formatTime(time)}</span>
          </div>
          <div className='flex items-center gap-1'>
             <Button variant="ghost" size="icon" onClick={handleTimerStart} disabled={isRunning}><Play className="h-5 w-5"/></Button>
             <Button variant="ghost" size="icon" onClick={handleTimerStop} disabled={!isRunning}><Square className="h-5 w-5"/></Button>
             <Button variant="ghost" size="icon" onClick={handleTimerReset}><RotateCw className="h-5 w-5"/></Button>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>
      
      {/* Contenedor Principal */}
      <main className="flex flex-col flex-1 w-full pt-16">
        {/* Navegación por Pestañas */}
        <nav className="sticky top-16 z-40 flex justify-center w-full h-14 bg-card border-b">
          <div className="flex items-center gap-8 px-4">
            <button onClick={() => setActiveTab('plantillas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'plantillas' ? 'active' : ''}`}>
              <FileText className="h-5 w-5" /> PLANTILLAS
            </button>
            <button onClick={() => setActiveTab('herramientas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'herramientas' ? 'active' : ''}`}>
              <Wrench className="h-5 w-5" /> HERRAMIENTAS
            </button>
            <button onClick={() => setActiveTab('transferencias')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'transferencias' ? 'active' : ''}`}>
              <ArrowRightLeft className="h-5 w-5" /> TRANSFERENCIAS
            </button>
            <button onClick={() => setActiveTab('avisos')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'avisos' ? 'active' : ''}`}>
              <Megaphone className="h-5 w-5" /> AVISOS
            </button>
            <button onClick={() => setActiveTab('copia-respaldo')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'copia-respaldo' ? 'active' : ''}`}>
              <Save className="h-5 w-5" /> COPIA DE RESPALDO
            </button>
          </div>
        </nav>
        
        {/* Contenido de la Pestaña Activa */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Card>
                <CardContent className="p-0">
                    {renderTabContent()}
                </CardContent>
            </Card>
        </div>
      </main>

      {/* Widgets Inferiores Flotantes */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
         {/* Panel de Notas Rápidas */}
         {activeWidget === 'notas' && (
          <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-center">Notas Rápidas</h4>
              <Textarea 
                placeholder="Escribe tus notas aquí..." 
                rows={8}
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
              />
              <div className="flex justify-between gap-2">
                <Button size="sm" onClick={() => handleCopyFromWidget(quickNotes, 'Notas Rápidas')} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copiar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleClearWidget(setQuickNotes, 'Notas Rápidas')} className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" /> Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Panel de Lista de Usuarios */}
        {activeWidget === 'usuarios' && (
          <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-center">Lista de Usuarios</h4>
              <Textarea 
                placeholder="Mantén tu lista de usuarios aquí..." 
                rows={8}
                value={userList}
                onChange={(e) => setUserList(e.target.value)}
              />
              <div className="flex justify-between gap-2">
                <Button size="sm" onClick={() => handleCopyFromWidget(userList, 'Lista de Usuarios')} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" /> Copiar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleClearWidget(setUserList, 'Lista de Usuarios')} className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" /> Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Panel de Copilot Chat */}
        {activeWidget === 'copilot' && (
            <Card className="w-96 h-[60vh] shadow-lg animate-in slide-in-from-bottom-10 flex flex-col">
                <CardContent className="p-2 flex-1">
                    <iframe
                        src="https://copilotstudio.microsoft.com/environments/Default-35058e0b-9a5c-4d1c-aa8e-08d02cd58b1a/bots/cr32d_marketingDigitalPro/webchat?__version__=2"
                        className="w-full h-full border-0"
                        title="Copilot Chat"
                    ></iframe>
                </CardContent>
            </Card>
        )}

        {/* Panel de Personalizar Tema */}
        {activeWidget === 'theme' && (
            <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
                <CardContent className="p-4 space-y-4">
                    <h4 className="font-semibold text-center">Personalizar Tema</h4>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label>Fondo</Label>
                            <Input type="color" value={hslToHex(themeColors.background.h, themeColors.background.s, themeColors.background.l)} onChange={(e) => handleThemeColorChange('background', e.target.value)} className="p-1 h-10" />
                        </div>
                        <div className="space-y-1">
                            <Label>Texto</Label>
                            <Input type="color" value={hslToHex(themeColors.foreground.h, themeColors.foreground.s, themeColors.foreground.l)} onChange={(e) => handleThemeColorChange('foreground', e.target.value)} className="p-1 h-10" />
                        </div>
                        <div className="space-y-1">
                            <Label>Primario</Label>
                            <Input type="color" value={hslToHex(themeColors.primary.h, themeColors.primary.s, themeColors.primary.l)} onChange={(e) => handleThemeColorChange('primary', e.target.value)} className="p-1 h-10" />
                        </div>
                        <div className="space-y-1">
                            <Label>Acento</Label>
                            <Input type="color" value={hslToHex(themeColors.accent.h, themeColors.accent.s, themeColors.accent.l)} onChange={(e) => handleThemeColorChange('accent', e.target.value)} className="p-1 h-10" />
                        </div>
                    </div>
                    <Button onClick={resetTheme} variant="outline" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
                    </Button>
                </CardContent>
            </Card>
        )}

        {/* Botones de Toggle para Widgets */}
        <div className="flex justify-end gap-3">
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => handleWidgetToggle('notas')}
            variant={activeWidget === 'notas' ? 'default' : 'secondary'}
            title="Notas Rápidas"
          >
            {activeWidget === 'notas' ? <X /> : <StickyNote />}
          </Button>
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => handleWidgetToggle('usuarios')}
            variant={activeWidget === 'usuarios' ? 'default' : 'secondary'}
            title="Lista de Usuarios"
          >
            {activeWidget === 'usuarios' ? <X /> : <Users />}
          </Button>
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => handleWidgetToggle('copilot')}
            variant={activeWidget === 'copilot' ? 'default' : 'secondary'}
            title="Copilot Chat"
          >
            {activeWidget === 'copilot' ? <X /> : <MessageSquare />}
          </Button>
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => handleWidgetToggle('theme')}
            variant={activeWidget === 'theme' ? 'default' : 'secondary'}
            title="Personalizar Tema"
          >
            {activeWidget === 'theme' ? <X /> : <Palette />}
          </Button>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        Desarrollado por: Keiner Valera
      </footer>
    </div>
  );
}
