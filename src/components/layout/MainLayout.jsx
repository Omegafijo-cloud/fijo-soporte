// components/layout/MainLayout.jsx
'use client';

import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FirebaseContext } from '../../context/FirebaseContext';
import { AppStateContext } from '../../context/AppStateContext';

// Import tab components
import PlantillasGenericasTab from '../tabs/PlantillasGenericasTab';
import PlantillasQuejasTab from '../tabs/PlantillasQuejasTab';
import WFMemosTab from '../tabs/WFMemosTab';
import OrdenMemosTab from '../tabs/OrdenMemosTab';
import CalculadoraTMOTab from '../tabs/CalculadoraTMOTab';
import TransferenciasTab from '../tabs/TransferenciasTab';
import AvisosTab from '../tabs/AvisosTab';
import CopiaRespaldoTab from '../tabs/CopiaRespaldoTab';

// Import widget components
import NotesWidget from '../widgets/NotesWidget';
import UsersWidget from '../widgets/UsersWidget';
import CopilotWidget from '../widgets/CopilotWidget';
import ThemeWidget from '../widgets/ThemeWidget';

export default function MainLayout() {
    const { appData, switchTab, setConfirm } = useContext(AppStateContext);
    const { handleLogout } = useContext(FirebaseContext);
    const [openWidgetPanel, setOpenWidgetPanel] = useState(null);

    const onLogoutClick = () => {
        setConfirm({
            isOpen: true,
            message: '¿Estás seguro de que quieres cerrar sesión?',
            onConfirm: handleLogout,
        });
    };

    const toggleWidget = (widgetId) => {
        setOpenWidgetPanel(prev => (prev === widgetId ? null : widgetId));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [totalSeconds, setTotalSeconds] = useState(300); // Default 5 minutes
    const [initialSetMinutes, setInitialSetMinutes] = useState(5);
    const timerIntervalRef = useRef(null);

    useEffect(() => {
        setTotalSeconds(initialSetMinutes * 60);
    }, [initialSetMinutes]);

    const startTimer = () => {
        clearInterval(timerIntervalRef.current);
        if (totalSeconds <= 0) setTotalSeconds(initialSetMinutes * 60);
        if (totalSeconds <= 0) return;
        timerIntervalRef.current = setInterval(() => {
            setTotalSeconds(prev => {
                if (prev - 1 < 0) {
                    clearInterval(timerIntervalRef.current);
                    // setAlert({ isOpen: true, message: "Time's up!" }); // Handled by AppStateContext
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const stopTimer = () => clearInterval(timerIntervalRef.current);
    const resetTimer = () => {
        clearInterval(timerIntervalRef.current);
        setTotalSeconds(initialSetMinutes * 60);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 w-full bg-blue-800 text-white p-4 border-b-4 border-cyan-500 z-[1000] shadow-md flex flex-wrap items-center justify-between h-[70px] md:h-auto">
                <svg className="w-16 h-16 rounded-lg mr-4 md:mr-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="35" fill="var(--blanco)"/>
                    <circle cx="50" cy="50" r="30" fill="var(--azul-oscuro)"/>
                    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(-30 50 50)" stroke="var(--turquesa)" strokeWidth="3" fill="none"/>
                    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(30 50 50)" stroke="var(--morado)" strokeWidth="3" fill="none"/>
                    <circle cx="50" cy="50" r="40" stroke="var(--azul-oscuro)" strokeWidth="2" fill="none"/>
                    <circle cx="28" cy="58" r="5" fill="var(--turquesa)" className="electron-dot"/>
                    <circle cx="72" cy="42" r="5" fill="var(--blanco)" className="electron-dot"/>
                    <circle cx="28" cy="42" r="5" fill="var(--morado)" className="electron-dot"/>
                    <circle cx="72" cy="58" r="5" fill="var(--blanco)" className="electron-dot"/>
                    <circle cx="50" cy="10" r="5" fill="var(--turquesa)" className="electron-dot"/>
                    <circle cx="50" cy="90" r="5" fill="var(--blanco)" className="electron-dot"/>
                </svg>
                <span className="flex-grow text-center text-xl md:text-2xl lg:text-3xl font-bold text-white">OMEGA-FIJO SOPORTE</span>
                <div className="flex items-center gap-2 text-white text-lg font-medium ml-auto md:ml-4">
                    <span className="text-cyan-400 font-bold">{formatTime(totalSeconds)}</span>
                    <Input
                        type="number"
                        value={initialSetMinutes}
                        onChange={(e) => setInitialSetMinutes(parseInt(e.target.value) || 0)}
                        min="1"
                        placeholder="Min"
                        className="w-16 p-1 text-center bg-white bg-opacity-10 border border-cyan-500 rounded-md text-white text-base"
                    />
                    <div className="flex gap-1">
                        <Button onClick={startTimer} className="p-2 text-sm bg-cyan-500 text-blue-800 rounded-full hover:bg-cyan-600 transition-colors">▶️</Button>
                        <Button onClick={stopTimer} className="p-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">⏹️</Button>
                        <Button onClick={resetTimer} className="p-2 text-sm bg-cyan-500 text-blue-800 rounded-full hover:bg-cyan-600 transition-colors">🔄</Button>
                    </div>
                </div>
                <div className="flex gap-2 items-center ml-4">
                    <Button onClick={onLogoutClick} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
                        Salir
                    </Button>
                </div>
            </header>

            <div className="pt-[70px] w-full"> {/* Padding top to account for fixed header */}
                <Tabs value={appData.activeTabs.main} onValueChange={(value) => switchTab(value, appData.activeTabs.sub)} className="w-full">
                    <TabsList className="flex bg-gray-800 border-b border-purple-700 sticky top-[70px] z-[999] flex-wrap">
                        <TabsTrigger value="tab-plantillas" className="flex-grow text-center py-3 px-4 text-white font-medium text-base data-[state=active]:border-b-4 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:bg-gray-700">PLANTILLAS</TabsTrigger>
                        <TabsTrigger value="tab-herramientas" className="flex-grow text-center py-3 px-4 text-white font-medium text-base data-[state=active]:border-b-4 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:bg-gray-700">HERRAMIENTAS</TabsTrigger>
                        <TabsTrigger value="tab-transferencias" className="flex-grow text-center py-3 px-4 text-white font-medium text-base data-[state=active]:border-b-4 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:bg-gray-700">TRANSFERENCIAS</TabsTrigger>
                        <TabsTrigger value="tab-avisos" className="flex-grow text-center py-3 px-4 text-white font-medium text-base data-[state=active]:border-b-4 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:bg-gray-700">AVISOS</TabsTrigger>
                        <TabsTrigger value="tab-copia-respaldo" className="flex-grow text-center py-3 px-4 text-white font-medium text-base data-[state=active]:border-b-4 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:bg-gray-700">COPIA DE RESPALDO</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tab-plantillas" className="p-6 bg-transparent relative pb-20">
                        <Tabs value={appData.activeTabs.sub} onValueChange={(value) => switchTab(appData.activeTabs.main, value)} className="w-full">
                            <TabsList className="flex bg-gray-700 border-b border-cyan-500 sticky top-[115px] z-[999] flex-wrap">
                                <TabsTrigger value="sub-tab-genericas" className="flex-grow text-center py-2 px-3 text-gray-300 text-sm data-[state=active]:border-b-4 data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-600">PLANTILLAS GENERICAS</TabsTrigger>
                                <TabsTrigger value="sub-tab-quejas" className="flex-grow text-center py-2 px-3 text-gray-300 text-sm data-[state=active]:border-b-4 data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-600">PLANTILLAS DE QUEJAS</TabsTrigger>
                                <TabsTrigger value="sub-tab-wf" className="flex-grow text-center py-2 px-3 text-gray-300 text-sm data-[state=active]:border-b-4 data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-600">MEMOS DE WF</TabsTrigger>
                                <TabsTrigger value="sub-tab-orden" className="flex-grow text-center py-2 px-3 text-gray-300 text-sm data-[state=active]:border-b-4 data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-600">MEMOS DE ORDEN</TabsTrigger>
                            </TabsList>

                            <TabsContent value="sub-tab-genericas" className="p-6 pt-8">
                                <PlantillasGenericasTab />
                            </TabsContent>
                            <TabsContent value="sub-tab-quejas" className="p-6 pt-8">
                                <PlantillasQuejasTab />
                            </TabsContent>
                            <TabsContent value="sub-tab-wf" className="p-6 pt-8">
                                <WFMemosTab />
                            </TabsContent>
                            <TabsContent value="sub-tab-orden" className="p-6 pt-8">
                                <OrdenMemosTab />
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="tab-herramientas" className="p-6 bg-transparent relative pb-20">
                        <Tabs value={appData.activeTabs.sub} onValueChange={(value) => switchTab(appData.activeTabs.main, value)} className="w-full">
                            <TabsList className="flex bg-gray-700 border-b border-cyan-500 sticky top-[115px] z-[999] flex-wrap">
                                <TabsTrigger value="sub-tab-tmo" className="flex-grow text-center py-2 px-3 text-gray-300 text-sm data-[state=active]:border-b-4 data-[state=active]:border-purple-700 data-[state=active]:text-purple-700 data-[state=active]:bg-gray-600">CALCULADORA TMO</TabsTrigger>
                            </TabsList>
                            <TabsContent value="sub-tab-tmo" className="p-6 pt-8">
                                <CalculadoraTMOTab />
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="tab-transferencias" className="p-6 bg-transparent relative pb-20">
                        <TransferenciasTab />
                    </TabsContent>

                    <TabsContent value="tab-avisos" className="p-6 bg-transparent relative pb-20">
                        <AvisosTab />
                    </TabsContent>

                    <TabsContent value="tab-copia-respaldo" className="p-6 bg-transparent relative pb-20">
                        <CopiaRespaldoTab />
                    </TabsContent>
                </Tabs>
            </div>

            <footer className="mt-auto py-4 text-left pl-5 text-gray-500 italic text-sm font-bold">
                <strong>Desarrollado por: Keiner Valera.</strong>
            </footer>

            {/* Floating Widgets */}
            <div className="fixed bottom-2 right-2 flex gap-2 z-[9998] items-end flex-wrap justify-center">
                <Button onClick={() => toggleWidget('notes')} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-700 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105">
                    {openWidgetPanel === 'notes' ? '❌' : '📝'}
                </Button>
                <Button onClick={() => toggleWidget('users')} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                    {openWidgetPanel === 'users' ? '❌' : '👤'}
                </Button>
                <Button onClick={() => toggleWidget('copilot')} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                    {openWidgetPanel === 'copilot' ? '❌' : '💬'}
                </Button>
                <Button onClick={() => toggleWidget('theme')} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-500 transition-all duration-300 transform hover:scale-105">
                    {openWidgetPanel === 'theme' ? '❌' : '🎨'}
                </Button>
            </div>

            {openWidgetPanel === 'notes' && <NotesWidget />}
            {openWidgetPanel === 'users' && <UsersWidget />}
            {openWidgetPanel === 'copilot' && <CopilotWidget />}
            {openWidgetPanel === 'theme' && <ThemeWidget />}
        </div>
    );
}
