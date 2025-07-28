'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, MessageSquare, Notebook, Users, Palette, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { hexToHsl } from '@/lib/utils';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { copilotChat, Message } from '@/ai/flows/chat';


type ActiveWidget = 'notes' | 'users' | 'chat' | 'theme' | null;

interface FloatingWidgetsProps {
    notesText: string;
    setNotesText: (text: string) => void;
    usersText: string;
    setUsersText: (text: string) => void;
}

const defaultTheme = {
  primary: '236 65% 33%',
  background: '0 0% 100%',
  accent: '282 69% 38%',
};

const defaultThemeHex = {
    primary: '#1A237E',
    background: '#FFFFFF',
    accent: '#6A1B9A',
};

const colorPalettes = [
  { name: 'Omega', colors: { primary: '#1A237E', background: '#FFFFFF', accent: '#6A1B9A' } },
  { name: 'Abismo', colors: { primary: '#e2e8f0', background: '#0f172a', accent: '#94a3b8' } },
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
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);


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
  
  const handleChatSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || isChatLoading) return;
      
      const newUserMessage: Message = { role: 'user', content: chatInput };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setChatInput('');
      setIsChatLoading(true);

      try {
        const response = await copilotChat({ history: messages, prompt: chatInput });
        const newAiMessage: Message = { role: 'model', content: response };
        setMessages([...newMessages, newAiMessage]);
      } catch (error) {
        console.error("Error from AI chat:", error);
        toast({
            title: 'Error de Copilot',
            description: 'No se pudo obtener una respuesta del asistente.',
            variant: 'destructive',
        });
      } finally {
        setIsChatLoading(false);
      }
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
             <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>OMEGA Copilot</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    {message.role === 'model' && <Bot className="h-6 w-6 text-primary" />}
                                    <div className={cn('rounded-lg p-3 max-w-xs', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                        <p className="text-sm">{message.content}</p>
                                    </div>
                                    {message.role === 'user' && <User className="h-6 w-6" />}
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex items-start gap-3 justify-start">
                                    <Bot className="h-6 w-6 text-primary animate-pulse" />
                                    <div className="rounded-lg p-3 bg-muted">
                                        <p className="text-sm">Pensando...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleChatSubmit} className="flex gap-2 border-t pt-4">
                        <Input 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           placeholder="Pregúntale algo al Copilot..."
                           disabled={isChatLoading}
                        />
                        <Button type="submit" size="icon" disabled={isChatLoading}>
                           <Send className="h-4 w-4" />
                        </Button>
                    </form>
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
        <div className="p-4 pt-0 h-[60vh] sm:h-auto max-h-[60vh] sm:max-h-[70vh]">
          {renderWidgetContent()}
        </div>
      </div>
    </>
  );
}
