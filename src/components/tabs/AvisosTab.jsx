// components/tabs/AvisosTab.jsx
'use client';

import React, { useCallback } from 'react';
import { Button } from '../ui/button';

export default function AvisosTab() {
    const loadDocumentInIframe = useCallback((iframeId, docUrl) => {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
            iframe.src = docUrl;
        }
    }, []);

    return (
        <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
            <div className="document-viewer-box">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    PROCESOS DE MIGRACIÓN
                </h3>
                <div className="document-iframe-container">
                    <iframe
                        id="docIframe1"
                        src=""
                        className="document-iframe"
                        title="Procesos de Migración"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML += '<div class="iframe-error-message">No se pudo cargar el documento. Verifique los permisos o el enlace.</div>';
                        }}
                    ></iframe>
                </div>
                <div className="text-center mt-6">
                    <Button onClick={() => loadDocumentInIframe('docIframe1', 'https://docs.google.com/document/d/e/2PACX-1vQbmQQdlbeHkpEMA9CwGFWUwj7gq4pR6Prx7fHng1MOUGqNUGUuRUUc94qogeiHj6Bu1MavE3wzpUDZ/pub?embedded=true')}
                        className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm">
                        Cargar PROCESOS DE MIGRACIÓN (WF)
                    </Button>
                </div>
            </div>

            <div className="document-viewer-box">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    SEGUIMIENTO DE CASOS
                </h3>
                <div className="document-iframe-container">
                    <iframe
                        id="docIframe2"
                        src=""
                        className="document-iframe"
                        title="Seguimiento de Casos"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML += '<div class="iframe-error-message">No se pudo cargar el documento. Verifique los permisos o el enlace.</div>';
                        }}
                    ></iframe>
                </div>
                <div className="text-center mt-6">
                    <Button onClick={() => loadDocumentInIframe('docIframe2', 'https://docs.google.com/document/d/e/2PACX-1vRketVsJaYapfC4lwnzYr1ndlm6WoCUmRsAY0TQEzYMVfhd3kXOwyuY-jWZG4YAx7qeqUWH50t_0-0Q/pub?embedded=true')}
                        className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm">
                        Cargar Documento 2 (DOC)
                    </Button>
                </div>
            </div>
        </div>
    );
}
