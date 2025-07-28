// components/tabs/CopiaRespaldoTab.jsx
'use client';

import React, { useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

export default function CopiaRespaldoTab() {
    const { appData, updateAppData, setAlert, setConfirm } = useContext(AppStateContext);

    const handleCopyBackup = useCallback(() => {
        if (appData.backupTemplatesContent) {
            copyToClipboard(appData.backupTemplatesContent, 'Copia de respaldo copiada.', setAlert);
        } else {
            setAlert({ isOpen: true, message: 'No hay contenido en la copia de respaldo para copiar.' });
        }
    }, [appData.backupTemplatesContent, setAlert]);

    const handleClearBackup = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar la copia de respaldo?',
            onConfirm: () => {
                updateAppData('backupTemplatesContent', '');
            },
        });
    }, [setConfirm, updateAppData]);

    return (
        <div className="flex justify-center w-full">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-4xl">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    Copia de Respaldo
                </h3>
                <Textarea
                    id="backupTemplatesTextarea"
                    placeholder="Aquí se guardarán las plantillas copiadas como respaldo general..."
                    value={appData.backupTemplatesContent || ''}
                    onChange={(e) => updateAppData('backupTemplatesContent', e.target.value)}
                    className="backup-textarea"
                />
                <div className="flex justify-start gap-4 mt-8">
                    <Button onClick={handleCopyBackup} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Copiar Respaldo
                    </Button>
                    <Button onClick={handleClearBackup} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Limpiar Respaldo
                    </Button>
                </div>
            </div>
        </div>
    );
}
