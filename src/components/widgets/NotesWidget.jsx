// components/widgets/NotesWidget.jsx
'use client';

import React, { useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

export default function NotesWidget() {
    const { appData, updateAppData, setAlert, setConfirm } = useContext(AppStateContext);

    const handleCopyNotes = useCallback(() => {
        copyToClipboard(appData.notesContent, 'Notas copiadas.', setAlert);
    }, [appData.notesContent, setAlert]);

    const handleClearNotes = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar notas?',
            onConfirm: () => updateAppData('notesContent', ''),
        });
    }, [setConfirm, updateAppData]);

    return (
        <div className="widget-panel fixed bottom-[75px] right-2 w-80 max-h-[70vh] overflow-y-auto bg-white bg-opacity-95 p-6 rounded-2xl shadow-2xl flex flex-col border-t-4 border-t-cyan-500 animate-fadeInScale">
            <h3 className="text-center text-2xl font-bold text-blue-800 mb-4 pb-3 border-b border-purple-300">Notas Rápidas</h3>
            <Textarea
                id="notesArea"
                placeholder="Escribe tus notas aquí..."
                value={appData.notesContent}
                onChange={(e) => updateAppData('notesContent', e.target.value)}
                className="w-full flex-grow p-3 rounded-lg border border-gray-300 text-lg text-gray-800 min-h-[150px] focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
            />
            <div className="flex justify-end gap-3 mt-4">
                <Button onClick={handleCopyNotes} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
                    Copiar
                </Button>
                <Button onClick={handleClearNotes} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
                    Limpiar
                </Button>
            </div>
        </div>
    );
}
