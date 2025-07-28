// components/tabs/OrdenMemosTab.jsx
'use client';

import React, { useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

// Define predefinedOrdenMemos here or import from a constants file
const predefinedOrdenMemos = {
    "cableado ethernet": [{ label: "ASUNTO", type: "text", id: "orden_ethernet_asunto" }, { label: "NUMERO DE SERVICIO", type: "text", id: "orden_ethernet_num_servicio" }, { label: "NOMBRE DE TITULAR", type: "text", id: "orden_ethernet_nombre_titular" }, { label: "DPI TITULAR", type: "text", id: "orden_ethernet_dpi_titular" }, { label: "TELEFONO REFERENCIA", type: "text", id: "orden_ethernet_tel_referencia" }, { label: "DIRECCIÓN INSTALACIÓN", type: "text", id: "orden_ethernet_direccion" }, { label: "HORARIO DE VISITA", type: "text", id: "orden_ethernet_horario_visita" }, { label: "OBSERVACIONES", type: "textarea", id: "orden_ethernet_observaciones" }, { label: "TIENDA / CALL CENTER", type: "text", id: "orden_ethernet_tienda" }],
    "orden de repetidores": [{ label: "ASUNTO", type: "text", id: "orden_repetidores_asunto" }, { label: "NUMERO DE SERVICIO", type: "text", id: "orden_repetidores_num_servicio" }, { label: "NOMBRE DE TITULAR", type: "text", id: "orden_repetidores_nombre_titular" }, { label: "DPI TITULAR", type: "text", id: "orden_repetidores_dpi_titular" }, { label: "TELEFONO REFERENCIA", type: "text", id: "orden_repetidores_tel_referencia" }, { label: "DIRECCIÓN INSTALACIÓN", type: "text", id: "orden_repetidores_direccion" }, { label: "HORARIO DE VISITA", type: "text", id: "orden_repetidores_horario_visita" }, { label: "OBSERVACIONES", type: "textarea", id: "orden_repetidores_observaciones" }, { label: "TIENDA / CALL CENTER", type: "text", id: "orden_repetidores_tienda" }],
    "instalación en plazo vigente": [{ label: "Teléfono de referencia", type: "text", id: "orden_instalacion_plazo_vigente_tel_ref" }, { label: "No. de O/S", type: "text", id: "orden_instalacion_plazo_vigente_no_os" }, { label: "Comentarios", type: "textarea", id: "orden_instalacion_plazo_vigente_comentarios", defaultValue: "Seguimiento a orden en tiempo Vigente" }, { label: "Hora visita", type: "text", id: "orden_instalacion_plazo_vigente_hora_visita", defaultValue: "8:00 a 5:00" }, { label: "Pruebas Realizadas", type: "textarea", id: "orden_instalacion_plazo_vigente_pruebas_realizadas", defaultValue: "Cliente solicita informacion sobre instalacion, se encuentra en tiempo vigente" }]
};

export default function OrdenMemosTab() {
    const { appData, updateOrdenMemosData, setAlert, setConfirm } = useContext(AppStateContext);
    const { selectedType, fields } = appData.ordenMemosData;

    const handleSelectChange = useCallback((value) => {
        updateOrdenMemosData('selectedType', value);
        updateOrdenMemosData('fields', {}); // Clear fields when changing type
    }, [updateOrdenMemosData]);

    const renderFormFields = useCallback(() => {
        const templateFields = predefinedOrdenMemos[selectedType] || [];
        return templateFields.map(field => {
            const InputComponent = field.type === 'textarea' ? Textarea : Input;
            return (
                <div key={field.id} className="mb-6">
                    <Label htmlFor={field.id} className="block text-lg font-medium text-gray-700 mb-2">
                        {field.label}
                    </Label>
                    <InputComponent
                        id={field.id}
                        placeholder={field.label}
                        value={fields[field.id] || field.defaultValue || ''}
                        onChange={(e) => updateOrdenMemosData('fields', { ...fields, [field.id]: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
                        rows={field.type === 'textarea' ? 4 : undefined}
                    />
                </div>
            );
        });
    }, [selectedType, fields, updateOrdenMemosData]);

    const handleCopyOrdenMemos = useCallback(() => {
        let content = `ASUNTO: ${selectedType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
        const templateFields = predefinedOrdenMemos[selectedType] || [];
        templateFields.forEach(field => {
            content += `${field.label}: ${fields[field.id] || '(Sin valor)'}\n`;
        });
        copyToClipboard(content.trim(), 'Memo de Orden copiado.', setAlert);
    }, [selectedType, fields, setAlert]);

    const handleClearOrdenMemos = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar el memo de Orden?',
            onConfirm: () => {
                updateOrdenMemosData('selectedType', '');
                updateOrdenMemosData('fields', {});
            },
        });
    }, [setConfirm, updateOrdenMemosData]);

    return (
        <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-2xl">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    MEMOS DE ORDEN
                </h3>
                <div className="mb-6">
                    <Label htmlFor="ordenMemosDropdown" className="block text-lg font-medium text-gray-700 mb-2">Seleccione Plantilla de Orden</Label>
                    <Select value={selectedType} onValueChange={handleSelectChange}>
                        <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200">
                            <SelectValue placeholder="-- Seleccione Plantilla de Orden --" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(predefinedOrdenMemos).map(key => (
                                <SelectItem key={key} value={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedType && (
                    <div className="mt-6 pt-6 border-t border-dashed border-purple-300">
                        {renderFormFields()}
                        <div className="flex justify-start gap-4 mt-8">
                            <Button onClick={handleCopyOrdenMemos} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                                Copiar Memo de Orden
                            </Button>
                            <Button onClick={handleClearOrdenMemos} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                                Limpiar Memo de Orden
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
