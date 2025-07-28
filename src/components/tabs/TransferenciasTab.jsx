// components/tabs/TransferenciasTab.jsx
'use client';

import React, { useState, useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

// Define defaultTransferItems here or import from a constants file
const defaultTransferItems = [
    { service: "SERVICIO MOVIL", value: "gt_movil_soporte" },
    { service: "COMERCIAL", value: "GT_RESIDENCIAL_INFORMACION" },
    { service: "CENTRO DE PAGOS", value: "GT_CENTRO DE PAGOS" },
    { service: "AGREGAR NUMERO A LA LLAMADA", value: "GT_RESIDENCIAL_SOPORTE_LINEA -" },
    { service: "CORPORATIVO", value: "24201414" },
    { service: "CAMBIO DE CONTRASEÑA Y DEMAS", value: "24201400" },
    { service: "LLAMADAS DESDE TIGO", value: "25028850" },
    { service: "WHATSAPP", value: "42147100" },
    { service: "migración gpon", value: "gt_quejas_migracion_gpon" }
];

export default function TransferenciasTab() {
    const { setAlert, setConfirm } = useContext(AppStateContext);
    const [customTransferItems, setCustomTransferItems] = useState([]); // This state is NOT persisted

    const handleAddTransfer = useCallback(() => {
        const service = prompt("Ingrese el SERVICIO para la nueva transferencia:");
        if (!service) return;
        const value = prompt("Ingrese el VALOR (número o nombre):");
        if (value === null) return;
        setCustomTransferItems(prev => [...prev, { service: service.trim(), value: value.trim() }]);
        setAlert({ isOpen: true, message: 'Transferencia agregada temporalmente.' });
    }, [setAlert]);

    const handleRemoveTransfer = useCallback((serviceToRemove) => {
        setConfirm({
            isOpen: true,
            message: `¿Eliminar la transferencia "${serviceToRemove}"?`,
            onConfirm: () => {
                setCustomTransferItems(prev => prev.filter(item => item.service !== serviceToRemove));
            },
        });
    }, [setConfirm]);

    const allTransfers = [...defaultTransferItems, ...customTransferItems];

    return (
        <div className="flex justify-center w-full">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-3xl">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    Transferencias
                </h3>
                <div className="transfers-list-container">
                    {allTransfers.length === 0 ? (
                        <p className="text-center text-gray-600 italic">No hay transferencias disponibles.</p>
                    ) : (
                        allTransfers.map((item, index) => (
                            <p key={index} className="transfers-list-item">
                                <strong className="text-blue-800">{item.service}:</strong> {item.value}
                                {index >= defaultTransferItems.length && (
                                    <Button onClick={() => handleRemoveTransfer(item.service)} className="ml-3 bg-red-500 text-white p-1 rounded-full text-xs w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">
                                        X
                                    </Button>
                                )}
                            </p>
                        ))
                    )}
                </div>
                <div className="mt-6 text-right">
                    <Button onClick={handleAddTransfer} className="bg-purple-700 text-white py-2 px-4 rounded-full text-sm shadow-md hover:bg-purple-800 transition-colors">
                        Agregar Transferencia
                    </Button>
                </div>
            </div>
        </div>
    );
}
