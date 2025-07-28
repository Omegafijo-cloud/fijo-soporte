// components/tabs/PlantillasQuejasTab.jsx
'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

// Define predefinedMemoTemplates here or import from a constants file
const predefinedMemoTemplates = {
    "INTERNET DSL": [{ label: "Luz Portadora", type: "checkbox-group", options: ["Fija", "Apagada", "Intermitente"], id:"luzPortadora" }, { label: "Luz Internet", type: "checkbox-group", options: ["Fija", "Apagada", "Intermitente"], id:"luzInternet" }, { label: "Estado del Puerto", type: "checkbox-group", options: ["UP", "DOWN", "DORMANT"], id:"estadoPuerto" }, { label: "SNR", type: "textarea", id:"SNRniveles" }, { label: "Estatus de niveles", type: "checkbox-group", options: ["Correctos", "Erroneos"], id:"estatusNiveles" }, { label: "Velocidad Current igual a Pisa", type: "text", id: "velocidadPisa" }, { label: "Canal dañado", type: "checkbox-group", options: ["Datos", "Voz", "Todos"], id:"canalDanado" }, { label: "Problema Reportado", type: "textarea", id: "problemaReportadoQueja" }, { label: "Pruebas Realizadas", type: "textarea", id: "pruebasRealizadasQueja", isTestArea: true }, { label: "Contacto En Sitio", type: "text", id: "contactoEnSitioQueja" }, { label: "Tel Contacto", type: "text", id: "telContactoQueja" }, { label: "Dirección", type: "text", id: "direccionQueja" }, { label: "Queja", type: "text", id: "quejaNumero" }, { label: "ID", type: "text", id: "idLlamadaQueja" }],
    "TV DTH": [{ label: "Número", type: "text", id:"tvDthNumero" }, { label: "No. Tvs Afectados", type: "text", id:"tvDthAfectados" }, { label: "Serie STB", type: "text", id:"tvDthSerie" }, { label: "Smart Card", type: "text", id:"tvDthSmartCard" }, { label: "Modelo STB", type: "text", id:"tvDthModelo" }, { label: "Mensaje Que Muestra Tv", type: "text", id:"tvDthMensaje" }, { label: "Pruebas Realizadas", type: "textarea", id:"tvDthPruebas", isTestArea: true }, { label: "Contacto En Sitio", type: "text", id:"tvDthContacto" }, { label: "Tel. Contacto", type: "text", id:"tvDthTel" }, { label: "Dirección", type: "text", id:"tvDthDireccion" }, { label: "Queja", type: "text", id:"tvDthQueja" }, { label: "ID", type: "text", id:"tvDthId" }],
    "TV HFC": [{ label: "Número", type: "text", id:"tvHfcNumero" }, { label: "No. Tvs Afectados", type: "text", id:"tvHfcAfectados" }, { label: "No. Serie Stb", type: "text", id:"tvHfcSerie" }, { label: "Mensaje Que Muestra Tv", type: "text", id:"tvHfcMensaje" }, { label: "Pruebas Realizadas", type: "textarea", id:"tvHfcPruebas", isTestArea: true }, { label: "Contacto En Sitio", type: "text", id:"tvHfcContacto" }, { label: "Tel. Contacto", type: "text", id:"tvHfcTel" }, { label: "Dirección", type: "text", id:"tvHfcDireccion" }, { label: "Queja", type: "text", id:"tvHfcQueja" }, { label: "ID", type: "text", id:"tvHfcId" }],
    "INTERNET HFC/LINEA": [{ label: "Estado del Puerto", type: "checkbox-group", options: ["UP", "DOWN", "DORMANT"], id:"hfcEstadoPuerto" }, { label: "Luz portadora", type: "checkbox-group", options: ["fija", "intermitente", "apagada"], id:"hfcluzportadora" }, { label: "Luz online", type: "checkbox-group", options: ["fija", "intermitente", "apagada"], id:"hfcluzonline" }, { label: "Niveles De Señal", type: "text", id:"hfcNivelesSenal" }, { label: "Niveles De Ruido", type: "text", id:"hfcNivelesRuido" }, { label: "Estatus de niveles", type: "checkbox-group", options: ["Correctos", "Erroneos"], id:"hfcEstatusNiveles" }, { label: "Mac Address", type: "text", id:"hfcMac" }, { label: "Problema Reportado", type: "textarea", id:"hfcProblema" }, { label: "Pruebas Realizadas", type: "textarea", id:"hfcPruebas", isTestArea: true }, { label: "Contacto En Sitio", type: "text", id:"hfcContacto" }, { label: "Tel. Contacto", type: "text", id:"hfcTel" }, { label: "Dirección", type: "text", id:"hfcDireccion" }, { label: "Queja", type: "text", id:"hfcQueja" }, { label: "ID", type: "text", id:"hfcId" }],
    "LINEA FIJA": [{ label: "Al Levantar El Auricular", type: "text", id:"lfAuricular" }, { label: "Cuando Le Llaman", type: "text", id:"lfLlaman" }, { label: "Diagnóstico", type: "checkbox-group", options: ["Sin tono", "Tono ocupado", "Ruido en la línea", "No saca llamadas", "No entran llamadas", "Llamadas se cortan"], id:"lfDiagnostico" }, { label: "Pruebas Realizadas", type: "textarea", id:"lfPruebas", isTestArea: true }, { label: "Contacto", type: "text", id:"lfContacto" }, { label: "Tel Referencia", type: "text", id:"lfTelRef" }, { label: "Dirección", type: "text", id:"lfDireccion" }, { label: "Queja", type: "text", id:"lfQueja" }, { label: "ID", type: "text", id:"lfId" }],
    "GPON/LINEA": [{ label: "Estatus de niveles:", type: "checkbox-group", options: ["Correctos", "Erroneos"], id:"gponEstatusNiveles" }, { label: "Canal Dañado", type: "checkbox-group", options: ["Datos", "Voz", "Todos"], id:"gponCanalDanado" }, { label: "PON", type: "checkbox-group", options: ["fija", "apagada", "intermitente"], id:"gponluzpon" }, { label: "LOS", type: "checkbox-group", options: ["fija", "apagada", "roja"], id:"gponluzlos" }, { label: "Problema Reportado", type: "textarea", id:"gponProblema" }, { label: "Pruebas Realizadas", type: "textarea", id:"gponPruebas", isTestArea: true }, { label: "Contacto En Sitio", type: "text", id:"gponContacto" }, { label: "Tel De Contacto", type: "text", id:"gponTel" }, { label: "Dirección", type: "text", id:"gponDireccion" }, { label: "Queja", type: "text", id:"gponQueja" }, { label: "ID", type: "text", id:"gponId" }],
    "IPTV": [{ label: "Número de Serie", type: "text", id:"iptvSerie" }, { label: "Número", type: "text", id:"iptvNumero" }, { label: "Mensaje Que Muestra Tv", type: "text", id:"iptvMensaje" }, { label: "Descripción", type: "textarea", id:"iptvDescripcion" }, { label: "Pruebas Realizadas", type: "textarea", id:"iptvPruebas", isTestArea: true }, { label: "Nombre Cliente", type: "text", id:"iptvCliente" }, { label: "Número De Contacto", type: "text", id:"iptvTel" }, { label: "Dirección", type: "text", id:"iptvDireccion" }, { label: "Queja", type: "text", id:"iptvQueja" }, { label: "ID", type: "text", id:"iptvId" }]
};

export default function PlantillasQuejasTab() {
    const { appData, updateMemoQuejasData, setAlert, setConfirm } = useContext(AppStateContext);
    const { selectedType, fields, checkboxValues } = appData.memoQuejasData;
    const { genericFormData } = appData;

    const renderMemoFields = useCallback(() => {
        const templateFields = predefinedMemoTemplates[selectedType] || [];
        const dynamicFields = [];

        dynamicFields.push(
            <div key="quienGenera" className="mb-4 pb-3 border-b border-purple-300">
                <Label className="block text-lg font-medium text-blue-800 mb-2">Quien genera queja:</Label>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <Checkbox
                            id="quejaTelefonico"
                            checked={checkboxValues.quejaTelefonico || false}
                            onCheckedChange={(checked) => updateMemoQuejasData('checkboxValues', { ...checkboxValues, quejaTelefonico: checked })}
                            className="mr-2 scale-125 accent-cyan-500"
                        />
                        <Label htmlFor="quejaTelefonico" className="text-gray-700 text-base cursor-pointer">Telefónico</Label>
                    </div>
                    <div>
                        <Checkbox
                            id="quejaCorporativo"
                            checked={checkboxValues.quejaCorporativo || false}
                            onCheckedChange={(checked) => updateMemoQuejasData('checkboxValues', { ...checkboxValues, quejaCorporativo: checked })}
                            className="mr-2 scale-125 accent-cyan-500"
                        />
                        <Label htmlFor="quejaCorporativo" className="text-gray-700 text-base cursor-pointer">Corporativo</Label>
                    </div>
                </div>
            </div>
        );

        templateFields.forEach((field) => {
            if (field.type === 'checkbox-group') {
                dynamicFields.push(
                    <div key={field.id} className="mb-4 pb-3 border-b border-gray-200">
                        <Label className="block text-lg font-medium text-blue-800 mb-2">{field.label}:</Label>
                        <div className="flex flex-wrap gap-4">
                            {field.options.map((option, optIndex) => (
                                <div key={`${field.id}_${optIndex}`}>
                                    <Checkbox
                                        id={`${field.id}_${optIndex}`}
                                        checked={checkboxValues[`${field.id}_${optIndex}`] || false}
                                        onCheckedChange={(checked) => updateMemoQuejasData('checkboxValues', { ...checkboxValues, [`${field.id}_${optIndex}`]: checked })}
                                        className="mr-2 scale-125 accent-cyan-500"
                                    />
                                    <Label htmlFor={`${field.id}_${optIndex}`} className="text-gray-700 text-base cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                const InputComponent = field.type === 'textarea' ? Textarea : Input;
                dynamicFields.push(
                    <div key={field.id} className="mb-6">
                        <Label htmlFor={field.id} className="block text-lg font-medium text-gray-700 mb-2">{field.label}</Label>
                        <InputComponent
                            id={field.id}
                            placeholder={field.label}
                            value={fields[field.id] || ''}
                            onChange={(e) => updateMemoQuejasData('fields', { ...fields, [field.id]: e.target.value })}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
                            rows={field.type === 'textarea' ? 4 : undefined}
                            readOnly={field.isTestArea}
                        />
                    </div>
                );
            }
        });
        return dynamicFields;
    }, [selectedType, fields, checkboxValues, updateMemoQuejasData]);

    const updateMemoPruebasRealizadas = useCallback(() => {
        if (!selectedType) return;
        const testAreaId = predefinedMemoTemplates[selectedType]?.find(f => f.isTestArea)?.id;
        if (!testAreaId) return;

        const allCheckedValues = [];
        if (genericFormData.pruebasRealizadas) {
            allCheckedValues.push(genericFormData.pruebasRealizadas);
        }

        Object.keys(checkboxValues).forEach(key => {
            if (checkboxValues[key]) {
                const checkboxElement = document.getElementById(key);
                const labelElement = document.querySelector(`label[for='${key}']`);
                if(labelElement) {
                    allCheckedValues.push(labelElement.textContent);
                }
            }
        });

        // Use a Set to remove duplicates and then join
        const uniqueValues = [...new Set(allCheckedValues.filter(Boolean))];
        
        // Only update if there's a change to prevent re-renders
        if (fields[testAreaId] !== uniqueValues.join(', ')) {
            updateMemoQuejasData('fields', { ...fields, [testAreaId]: uniqueValues.join(', ') });
        }
    }, [selectedType, fields, checkboxValues, genericFormData.pruebasRealizadas, updateMemoQuejasData]);

    useEffect(() => {
        updateMemoPruebasRealizadas();
    }, [selectedType, checkboxValues, genericFormData.pruebasRealizadas]);

    const handleCopyMemoQueja = useCallback(() => {
        let content = '';
        const templateFields = predefinedMemoTemplates[selectedType] || [];

        const quienGeneraChecked = Object.keys(checkboxValues)
            .filter(key => key.startsWith('queja') && checkboxValues[key])
            .map(key => document.querySelector(`label[for='${key}']`)?.textContent || '');
        if (quienGeneraChecked.length > 0) {
            content += `Quien genera queja: ${quienGeneraChecked.join(', ')}\n`;
        }

        templateFields.forEach(field => {
            if (field.type === 'checkbox-group') {
                const checkedOptions = field.options.filter((_, idx) => checkboxValues[`${field.id}_${idx}`]);
                if (checkedOptions.length > 0) {
                    content += `${field.label}: ${checkedOptions.join(', ')}\n`;
                }
            } else {
                content += `${field.label}: ${fields[field.id] || '(Sin valor)'}\n`;
            }
        });

        copyToClipboard(content.trim(), 'Contenido del memo de queja copiado.', setAlert);
    }, [selectedType, fields, checkboxValues, setAlert]);

    const handleClearMemoQueja = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar el memo de queja?',
            onConfirm: () => {
                updateMemoQuejasData('selectedType', '');
                updateMemoQuejasData('fields', {});
                updateMemoQuejasData('checkboxValues', {});
            },
        });
    }, [setConfirm, updateMemoQuejasData]);

    return (
        <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full md:w-[calc(33%-1.5rem)] min-w-[280px]">
                <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    Plantillas de Quejas
                </h3>
                <div className="mb-6">
                    <Label htmlFor="opcionesMemoQuejas" className="block text-lg font-medium text-gray-700 mb-2">Seleccione Tipo de Memo</Label>
                    <Select value={selectedType} onValueChange={(value) => updateMemoQuejasData('selectedType', value)}>
                        <SelectTrigger className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200">
                            <SelectValue placeholder="-- Seleccione Tipo de Memo --" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(predefinedMemoTemplates).map(key => (
                                <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mt-6 pt-6 border-t border-dashed border-purple-300">
                    {selectedType && renderMemoFields()}
                </div>
                {selectedType && (
                    <div className="flex justify-start gap-4 mt-8">
                        <Button onClick={handleCopyMemoQueja} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            Copiar Memo
                        </Button>
                        <Button onClick={handleClearMemoQueja} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            Limpiar Memo
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 w-full md:w-[calc(67%-1.5rem)]">
                {Object.entries({
                    memoNivelCero: [
                        { value: "Saldos OK (Memo)", label: "Saldos OK" },
                        { value: "No hay Fallas (Memo)", label: "Fallas" },
                        { value: "No presenta bloqueo (Memo)", label: "Bloqueos" },
                        { value: "No hay OS abiertas (Memo)", label: "Ordenes Servicio" },
                        { value: "No hay quejas (Memo)", label: "Quejas" },
                    ],
                    memoGponAdslHfc: [
                        { value: "Se verifica estado de las luces del router (Memo)", label: "Luces router" },
                        { value: "Envio reset en UMP (Memo)", label: "Reset en UMP" },
                        { value: "Se Desconecta y Conecta Corriente (Memo)", label: "Conexiones Fisicas" },
                        { value: "Se Desconecta y Conecta en otro tomacorriente (Memo)", label: "Otro Tomacorriente" },
                        { value: "Se verifica Splitter (Memo)", label: "Conexiones Splitter" },
                        { value: "Cambio de baterías (Memo)", label: "Cambio de baterías" },
                        { value: "Se verifica Coaxial bien apretado (Memo)", label: "Conexiones Coaxial" },
                        { value: "Se verifica cortes o daños en la fibra (Memo)", label: "Conexiones Fibra Optica" },
                        { value: "Se manda a realizar test de velocidad (00 Megas) (Memo)", label: "Test de velocidad" },
                        { value: "Se realiza Ping (0% perdido) (Memo)", label: "Ping" },
                        { value: "Estado de la ONT activo (Memo)", label: "Estado de la ONT" },
                        { value: "Niveles SNR en Rojo (Memo)", label: "Niveles SNR Rojo" },
                        { value: "Luz LOS en ROJO (Memo)", label: "Luz LOS en Rojo" },
                        { value: "Se envia reboot en Axiros (Memo)", label: "Reset en Axiros" },
                    ],
                    memoTvHfcDthIptv: [
                        { value: "Se verifica Conexiones HDMI (Memo)", label: "Conexion HDMI" },
                        { value: "Se Verifica Conexiones RCA (Memo)", label: "Conexion RCA" },
                        { value: "Se verifica cable Coaxial (Memo)", label: "Cable Coaxial" },
                        { value: "XX Stb afectados (Memo)", label: "Stb afectados" },
                        { value: "Se valida Serial No. XXXX (Memo)", label: "Serial STB" },
                        { value: "Mensaje que muestra Tv: XXX (Memo)", label: "Mensaje que muestra Tv" },
                        { value: "Se Envia Comando XXXX (Memo)", label: "Comandos enviados" },
                        { value: "Se Envia Reset Fisico (Memo)", label: "Reset Fisico" },
                        { value: "Se verifica en la GUI, AMCO en verde (Memo)", label: "AMCO en verde" },
                    ],
                    memoOtrosChecks: [
                        { value: "Se valida DPI ok, nombre completo ok, sin restricciones (Memo)", label: "Se valida titularidad" },
                        { value: "Cliente no esta en Sitio (Memo)", label: "Cliente no esta en sitio" },
                        { value: "Cliente esta en Agencia (Memo)", label: "Cliente en Agencia" },
                        { value: "Cliente no quiere hacer pruebas (Memo)", label: "Cliente no quiere hacer pruebas" },
                        { value: "Se realiza cambio de contraseña con exito (Memo)", label: "Cambio de contraseña" },
                        { value: "Servicio funcionando de manera correcta (Memo)", label: "Soporte Efectivo" },
                        { value: "Se Genera Averia (Memo)", label: "Se genera averia" },
                        { value: "Se envía reproceso (Memo)", label: "Se envía reproceso" },
                    ],
                }).map(([groupId, items]) => (
                    <div key={groupId} className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full sm:w-[calc(50%-0.75rem)] min-w-[280px]">
                        <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                            {groupId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Memo', '(Memos)')}:
                        </h3>
                        {items.map((item, index) => (
                            <div key={item.value || index} className="flex items-center justify-between mb-4">
                                <Label htmlFor={`${groupId}-${index}`} className="flex items-center text-lg text-gray-700 cursor-pointer flex-grow hover:text-purple-700 transition-colors">
                                    <Checkbox
                                        id={`${groupId}-${index}`}
                                        value={item.label}
                                        checked={checkboxValues[`${groupId}-${index}`] || false}
                                        onCheckedChange={(checked) => {
                                            const newCheckboxValues = { ...checkboxValues, [`${groupId}-${index}`]: checked };
                                            updateMemoQuejasData('checkboxValues', newCheckboxValues);
                                        }}
                                        className="mr-3 scale-125 accent-cyan-500 min-w-5 min-h-5"
                                    />
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                        <div className="mt-6 text-right">
                            <Button onClick={() => setAlert({ isOpen: true, message: "La adición de checkboxes personalizados no se guarda permanentemente en esta versión. Se restablecerán al recargar." })} className="bg-purple-700 text-white py-2 px-4 rounded-full text-sm shadow-md hover:bg-purple-800 transition-colors">
                                Agregar Checkbox
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
