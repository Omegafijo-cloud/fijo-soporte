'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [activeTab, setActiveTab] = useState('plantillas');
    const [activeWidget, setActiveWidget] = useState<string | null>(null);
    const [quickNotes, setQuickNotes] = useState('');
    const [userList, setUserList] = useState('');
    const { toast } = useToast();

    const [duration, setDuration] = useState(5);
    const [time, setTime] = useState(duration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [themeColors, setThemeColors] = useState(defaultThemeColors);

    // useCallback para la función de guardado para evitar re-creaciones
    const saveData = useCallback(async () => {
        if (!user || isSaving) return;

        setIsSaving(true);
        const dataToSave = {
            quickNotes,
            userList,
            themeColors,
            duration,
        };

        try {
            const userDocRef = doc(db, 'users', user.uid, 'appState', 'main');
            await setDoc(userDocRef, dataToSave, { merge: true });
        } catch (error) {
            console.error("Error al guardar datos:", error);
            toast({ title: "Error de guardado", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    }, [user, isSaving, quickNotes, userList, themeColors, duration, toast]);

    const triggerSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveData();
        }, 1500); // Guardar 1.5 segundos después de la última edición
    }, [saveData]);

    // Cargar datos al iniciar
    useEffect(() => {
        if (!user) return;

        let unsubscribe: (() => void) | undefined;

        const loadData = async () => {
            const userDocRef = doc(db, 'users', user.uid, 'appState', 'main');
            
            // Usar onSnapshot para actualizaciones en tiempo real
            unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setQuickNotes(data.quickNotes || '');
                    setUserList(data.userList || '');
                    setThemeColors(data.themeColors || defaultThemeColors);
                    setDuration(data.duration || 5);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error al cargar datos:", error);
                toast({ title: "Error al cargar datos", variant: "destructive"});
                setLoading(false);
            });
        };

        loadData();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, toast]);
    
    // Autoguardado cuando el estado cambia
    useEffect(() => {
        if (!loading && user) {
            triggerSave();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickNotes, userList, themeColors, duration]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (isRunning && time > 0) {
            timerRef.current = setInterval(() => setTime(prev => prev - 1), 1000);
        } else if (time <= 0 && isRunning) {
            if(timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            toast({ title: "¡Tiempo agotado!" });
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, time, toast]);

    useEffect(() => {
        setTime(duration * 60);
        if (isRunning) {
            setIsRunning(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration]);

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
            toast({ title: `Nada que copiar en ${title}`, variant: 'destructive' });
            return;
        }
        navigator.clipboard.writeText(content).then(() => {
            toast({ title: `${title} copiado`, description: 'El contenido ha sido copiado.' });
        });
    };

    const handleClearWidget = (setter: React.Dispatch<React.SetStateAction<string>>, title: string) => {
        setter('');
        toast({ title: `${title} limpiado`, description: 'El contenido ha sido borrado.' });
    };

    const handleThemeColorChange = (colorName: keyof typeof themeColors, hexValue: string) => {
        setThemeColors(prev => ({ ...prev, [colorName]: hexToHsl(hexValue) }));
    };

    const resetTheme = () => {
        setThemeColors(defaultThemeColors);
        toast({ title: "Tema Restaurado", description: "Los colores han sido restaurados." });
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleTimerStart = () => setIsRunning(true);
    const handleTimerStop = () => setIsRunning(false);
    const handleTimerReset = () => {
        setIsRunning(false);
        setTime(duration * 60);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDuration = parseInt(e.target.value, 10);
        if (!isNaN(newDuration) && newDuration > 0) {
            setDuration(newDuration);
        } else if (e.target.value === '') {
            setDuration(0);
        }
    };

    const handleLogout = async () => {
        try {
            await saveData(); // Asegurarse de guardar antes de salir
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast({ title: "Error", description: "No se pudo cerrar la sesión.", variant: "destructive" });
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'plantillas': return <PlantillasTab />;
            case 'herramientas': return <HerramientasTab />;
            case 'transferencias': return <TransferenciasTab />;
            case 'avisos': return <AvisosTab />;
            case 'copia-respaldo': return <CopiaRespaldoTab />;
            default: return <PlantillasTab />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="space-y-4 w-full max-w-4xl p-8">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-14 w-3/4 mx-auto" />
                    <div className="p-8"><Card><CardContent className="p-6"><Skeleton className="h-96 w-full" /></CardContent></Card></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
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
                        <Input type="number" value={duration} onChange={handleDurationChange} className="w-20 h-9 text-center" min="1" placeholder="Mins" />
                        <Button variant="ghost" size="icon" onClick={handleTimerStart} disabled={isRunning || time <= 0}><Play className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" onClick={handleTimerStop} disabled={!isRunning}><Square className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" onClick={handleTimerReset}><RotateCw className="h-5 w-5"/></Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} disabled={isSaving}>
                      {isSaving ? 'Guardando...' : <><LogOut className="mr-2 h-4 w-4" /> Salir</>}
                    </Button>
                </div>
            </header>
            
            <main className="flex flex-col flex-1 w-full pt-16">
                <nav className="sticky top-16 z-40 flex justify-center w-full h-14 bg-card border-b">
                    <div className="flex items-center gap-8 px-4">
                        <button onClick={() => setActiveTab('plantillas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'plantillas' ? 'active' : ''}`}><FileText className="h-5 w-5" /> PLANTILLAS</button>
                        <button onClick={() => setActiveTab('herramientas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'herramientas' ? 'active' : ''}`}><Wrench className="h-5 w-5" /> HERRAMIENTAS</button>
                        <button onClick={() => setActiveTab('transferencias')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'transferencias' ? 'active' : ''}`}><ArrowRightLeft className="h-5 w-5" /> TRANSFERENCIAS</button>
                        <button onClick={() => setActiveTab('avisos')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'avisos' ? 'active' : ''}`}><Megaphone className="h-5 w-5" /> AVISOS</button>
                        <button onClick={() => setActiveTab('copia-respaldo')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'copia-respaldo' ? 'active' : ''}`}><Save className="h-5 w-5" /> COPIA DE RESPALDO</button>
                    </div>
                </nav>
                
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Card><CardContent className="p-0">{renderTabContent()}</CardContent></Card>
                </div>
            </main>

            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
                {activeWidget === 'notas' && (
                    <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
                        <CardContent className="p-4 space-y-3">
                            <h4 className="font-semibold text-center">Notas Rápidas</h4>
                            <Textarea placeholder="Escribe tus notas aquí..." rows={8} value={quickNotes} onChange={(e) => setQuickNotes(e.target.value)} />
                            <div className="flex justify-between gap-2">
                                <Button size="sm" onClick={() => handleCopyFromWidget(quickNotes, 'Notas Rápidas')} className="flex-1"><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleClearWidget(setQuickNotes, 'Notas Rápidas')} className="flex-1"><Trash2 className="mr-2 h-4 w-4" /> Limpiar</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {activeWidget === 'usuarios' && (
                    <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
                        <CardContent className="p-4 space-y-3">
                            <h4 className="font-semibold text-center">Lista de Usuarios</h4>
                            <Textarea placeholder="Mantén tu lista de usuarios aquí..." rows={8} value={userList} onChange={(e) => setUserList(e.target.value)} />
                            <div className="flex justify-between gap-2">
                                <Button size="sm" onClick={() => handleCopyFromWidget(userList, 'Lista de Usuarios')} className="flex-1"><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleClearWidget(setUserList, 'Lista de Usuarios')} className="flex-1"><Trash2 className="mr-2 h-4 w-4" /> Limpiar</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeWidget === 'copilot' && (
                    <Card className="w-96 h-[60vh] shadow-lg animate-in slide-in-from-bottom-10 flex flex-col">
                        <CardContent className="p-2 flex-1">
                            <iframe src="https://copilotstudio.microsoft.com/environments/Default-35058e0b-9a5c-4d1c-aa8e-08d02cd58b1a/bots/cr32d_marketingDigitalPro/webchat?__version__=2" className="w-full h-full border-0" title="Copilot Chat"></iframe>
                        </CardContent>
                    </Card>
                )}

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
                            <Button onClick={resetTheme} variant="outline" className="w-full"><RotateCcw className="mr-2 h-4 w-4" /> Restaurar</Button>
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end gap-3">
                    <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => handleWidgetToggle('notas')} variant={activeWidget === 'notas' ? 'default' : 'secondary'} title="Notas Rápidas">{activeWidget === 'notas' ? <X /> : <StickyNote />}</Button>
                    <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => handleWidgetToggle('usuarios')} variant={activeWidget === 'usuarios' ? 'default' : 'secondary'} title="Lista de Usuarios">{activeWidget === 'usuarios' ? <X /> : <Users />}</Button>
                    <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => handleWidgetToggle('copilot')} variant={activeWidget === 'copilot' ? 'default' : 'secondary'} title="Copilot Chat">{activeWidget === 'copilot' ? <X /> : <MessageSquare />}</Button>
                    <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => handleWidgetToggle('theme')} variant={activeWidget === 'theme' ? 'default' : 'secondary'} title="Personalizar Tema">{activeWidget === 'theme' ? <X /> : <Palette />}</Button>
                </div>
            </div>

            <footer className="py-4 text-center text-sm text-muted-foreground">
                Desarrollado por: Keiner Valera
            </footer>
        </div>
    );
}
