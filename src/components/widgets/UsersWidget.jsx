// components/widgets/UsersWidget.jsx
'use client';

import React, { useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

export default function UsersWidget() {
    const { appData, updateAppData, setAlert, setConfirm } = useContext(AppStateContext);

    const handleCopyUsers = useCallback(() => {
        copyToClipboard(appData.usersContent, 'Lista de usuarios copiada.', setAlert);
    }, [appData.usersContent, setAlert]);

    const handleClearUsers = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar lista de usuarios?',
            onConfirm: () => updateAppData('usersContent', ''),
        });
    }, [setConfirm, updateAppData]);

    return (
        <div className="widget-panel fixed bottom-[75px] right-2 w-80 max-h-[70vh] overflow-y-auto bg-white bg-opacity-95 p-6 rounded-2xl shadow-2xl flex flex-col border-t-4 border-t-purple-700 animate-fadeInScale">
            <h3 className="text-center text-2xl font-bold text-blue-800 mb-4 pb-3 border-b border-purple-300">Lista de Usuarios</h3>
            <Textarea
                id="usersArea"
                placeholder="Escribe tu lista de usuarios aquí..."
                value={appData.usersContent}
                onChange={(e) => updateAppData('usersContent', e.target.value)}
                className="w-full flex-grow p-3 rounded-lg border border-gray-300 text-lg text-gray-800 min-h-[150px] focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
            />
            <div className="flex justify-end gap-3 mt-4">
                <Button onClick={handleCopyUsers} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
                    Copiar
                </Button>
                <Button onClick={handleClearUsers} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
                    Limpiar
                </Button>
            </div>
        </div>
    );
}
