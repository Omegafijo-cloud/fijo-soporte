// components/tabs/PlantillasGenericasTab.jsx
'use client';

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { AppStateContext } from '../../context/AppStateContext';
import { copyToClipboard } from '../../lib/utils';

export default function PlantillasGenericasTab() {
    const { appData, updateGenericFormData, setAlert, setConfirm } = useContext(AppStateContext);

    const checkboxGroups = {
        nivelCero: [
            { value: "Saldos OK", label: "Saldos OK" },
            { value: "No hay Fallas", label: "Fallas" },
            { value: "No presenta bloqueo", label: "Bloqueos" },
            { value: "No hay OS abiertas", label: "Ordenes Servicio" },
            { value: "No hay quejas", label: "Quejas" },
        ],
        gponAdslHfc: [
            { value: "Se verifica estado de las luces del router", label: "Luces router" },
            { value: "Envio reset en UMP", label: "Reset en UMP" },
            { value: "Se Desconecta y Conecta Corriente", label: "Conexiones Fisicas" },
            { value: "Se Desconecta y Conecta en otro tomacorriente", label: "Otro Tomacorriente" },
            { value: "Se verifica Splitter", label: "Conexiones Splitter" },
            { value: "Cambio de baterías", label: "Cambio de baterías" },
            { value: "Se verifica Coaxial bien apretado", label: "Conexiones Coaxial" },
            { value: "Se verifica cortes o daños en la fibra", label: "Conexiones Fibra Optica" },
            { value: "Se manda a realizar test de velocidad (00 Megas)", label: "Test de velocidad" },
            { value: "Se realiza Ping (0% perdido)", label: "Ping" },
            { value: "Estado de la ONT activo", label: "Estado de la ONT" },
            { value: "Niveles SNR en Rojo", label: "Niveles SNR Rojo" },
            { value: "Luz LOS en ROJO", label: "Luz LOS en Rojo" },
            { value: "Se envia reboot en Axiros", label: "Reset en Axiros" },
        ],
        tvHfcDthIptv: [
            { value: "Se verifica Conexiones HDMI", label: "Conexion HDMI" },
            { value: "Se Verifica Conexiones RCA", label: "Conexion RCA" },
            { value: "Se verifica cable Coaxial", label: "Cable Coaxial" },
            { value: "XX Stb afectados", label: "Stb afectados" },
            { value: "Se valida Serial No. XXXX", label: "Serial STB" },
            { value: "Mensaje que muestra Tv: XXX", label: "Mensaje que muestra Tv" },
            { value: "Se Envia Comando XXXX", label: "Comandos enviados" },
            { value: "Se Envia Reset Fisico", label: "Reset Fisico" },
            { value: "Se verifica en la GUI, AMCO en verde", label: "AMCO en verde" },
        ],
        otrosChecks: [
            { value: "Se valida DPI ok, nombre completo ok, sin restricciones", label: "Se valida titularidad" },
            { value: "Cliente no esta en Sitio", label: "Cliente no esta en sitio" },
            { value: "Cliente esta en Agencia", label: "Cliente en Agencia" },
            { value: "Cliente no quiere hacer pruebas", label: "Cliente no quiere hacer pruebas" },
            { value: "Se realiza cambio de contraseña con exito", label: "Cambio de contraseña" },
            { value: "Servicio funcionando de manera correcta", label: "Soporte Efectivo" },
            { value: "Se Genera Averia", label: "Se genera averia" },
            { value: "Se envía reproceso", label: "Se envía reproceso" },
        ],
    };

    const [checkedItems, setCheckedItems] = useState({});

    // Initialize checkedItems from appData.genericFormData.pruebasRealizadas on load
    useEffect(() => {
        const initialChecked = {};
        if (appData.genericFormData.pruebasRealizadas) {
            const values = appData.genericFormData.pruebasRealizadas.split(', ').map(s => s.trim());
            Object.values(checkboxGroups).forEach(group => {
                group.forEach(item => {
                    if (values.includes(item.value)) {
                        initialChecked[item.value] = true;
                    }
                });
            });
        }
        setCheckedItems(initialChecked);
    }, [appData.genericFormData.pruebasRealizadas]);


    const handleCheckboxChange = useCallback((value, isChecked) => {
        setCheckedItems(prev => {
            const newChecked = { ...prev, [value]: isChecked };
            const selectedValues = Object.keys(newChecked).filter(key => newChecked[key]);
            updateGenericFormData('pruebasRealizadas', selectedValues.join(', '));
            return newChecked;
        });
    }, [updateGenericFormData]);

    const handleAddCheckboxItem = useCallback((groupId) => {
        const newItemTitle = prompt("Ingrese el TÍTULO para el nuevo checkbox (lo que se muestra):");
        if (!newItemTitle || !newItemTitle.trim()) return;
        const newItemContent = prompt("Ingrese el CONTENIDO para el nuevo checkbox (lo que se copia):", newItemTitle);
        if (newItemContent === null) return;

        // This adds to the local state of the component, not directly to appData
        // For persistence, this would need to update a list in appData, which is then saved.
        // For now, it's a temporary addition for the current session.
        setAlert({ isOpen: true, message: "La adición de checkboxes personalizados no se guarda permanentemente en esta versión. Se restablecerán al recargar." });
    }, [setAlert]);

    const handleRemoveCheckboxItem = useCallback((valueToRemove) => {
        setConfirm({
            isOpen: true,
            message: '¿Seguro que quieres eliminar este ítem?',
            onConfirm: () => {
                setCheckedItems(prev => {
                    const newChecked = { ...prev };
                    delete newChecked[valueToRemove];
                    const selectedValues = Object.keys(newChecked).filter(key => newChecked[key]);
                    updateGenericFormData('pruebasRealizadas', selectedValues.join(', '));
                    return newChecked;
                });
                // In a real app, you'd also remove it from the predefined list if it was custom
            },
        });
    }, [setConfirm, updateGenericFormData]);

    const handleCopyTemplate = useCallback(() => {
        const content = `ID de llamada: ${appData.genericFormData.id}\nNombre del contacto: ${appData.genericFormData.nombreCliente}\nN° Incidencia: ${appData.genericFormData.numeroInconveniente}\nInconveniente: ${appData.genericFormData.Inconveniente}\nTipo Servicio: ${appData.genericFormData.tipoServicio}\n\nPRUEBAS REALIZADAS:\n${appData.genericFormData.pruebasRealizadas}`;
        copyToClipboard(content, 'Contenido de la plantilla copiado.', setAlert);
    }, [appData.genericFormData, setAlert]);

    const handleClearGenericForm = useCallback(() => {
        setConfirm({
            isOpen: true,
            message: '¿Limpiar el formulario genérico?',
            onConfirm: () => {
                updateGenericFormData('id', '');
                updateGenericFormData('nombreCliente', '');
                updateGenericFormData('numeroInconveniente', '');
                updateGenericFormData('Inconveniente', '');
                updateGenericFormData('tipoServicio', '');
                updateGenericFormData('pruebasRealizadas', '');
                setCheckedItems({}); // Clear all checkboxes
            },
        });
    }, [setConfirm, updateGenericFormData]);

    return (
        <div className="flex flex-wrap justify-center gap-6 w-full mx-auto">
            <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full md:w-[calc(33%-1.5rem)] min-w-[280px]">
                <h2 className="text-center text-3xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                    Plantilla Genérica
                </h2>
                <form>
                    <div className="mb-6">
                        <Label htmlFor="id" className="block text-lg font-medium text-gray-700 mb-2">ID de llamada</Label>
                        <Input id="id" type="text" placeholder="ID de la llamada" value={appData.genericFormData.id} onChange={(e) => updateGenericFormData('id', e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="nombreCliente" className="block text-lg font-medium text-gray-700 mb-2">Nombre del contacto</Label>
                        <Input id="nombreCliente" type="text" placeholder="Nombre del Cliente" value={appData.genericFormData.nombreCliente} onChange={(e) => updateGenericFormData('nombreCliente', e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="numeroInconveniente" className="block text-lg font-medium text-gray-700 mb-2">N° Incidencia</Label>
                        <Input id="numeroInconveniente" type="text" placeholder="Número del Inconveniente" value={appData.genericFormData.numeroInconveniente} onChange={(e) => updateGenericFormData('numeroInconveniente', e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="Inconveniente" className="block text-lg font-medium text-gray-700 mb-2">Inconveniente</Label>
                        <Input id="Inconveniente" type="text" placeholder="Inconveniente" value={appData.genericFormData.Inconveniente} onChange={(e) => updateGenericFormData('Inconveniente', e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="tipoServicio" className="block text-lg font-medium text-gray-700 mb-2">Tipo Servicio</Label>
                        <Input id="tipoServicio" type="text" placeholder="Tipo de Servicio" value={appData.genericFormData.tipoServicio} onChange={(e) => updateGenericFormData('tipoServicio', e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200" />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="pruebasRealizadas" className="block text-lg font-medium text-gray-700 mb-2">PRUEBAS REALIZADAS</Label>
                        <Textarea id="pruebasRealizadas" placeholder="Las pruebas seleccionadas aparecerán aquí" value={appData.genericFormData.pruebasRealizadas} readOnly className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 min-h-[120px]" />
                    </div>
                    <div className="flex justify-start gap-4 mt-8">
                        <Button type="button" onClick={handleCopyTemplate} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            Copiar Plantilla
                        </Button>
                        <Button type="button" onClick={handleClearGenericForm} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                            Limpiar
                        </Button>
                    </div>
                </form>
            </div>

            <div className="flex flex-wrap justify-center gap-6 w-full md:w-[calc(67%-1.5rem)]">
                {Object.entries(checkboxGroups).map(([groupId, items]) => (
                    <div key={groupId} className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full sm:w-[calc(50%-0.75rem)] min-w-[280px]">
                        <h3 className="text-center text-2xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">
                            {groupId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </h3>
                        {items.map((item, index) => (
                            <div key={item.value || index} className="flex items-center justify-between mb-4">
                                <Label htmlFor={`${groupId}-${index}`} className="flex items-center text-lg text-gray-700 cursor-pointer flex-grow hover:text-purple-700 transition-colors">
                                    <Checkbox
                                        id={`${groupId}-${index}`}
                                        checked={checkedItems[item.value] || false}
                                        onCheckedChange={(checked) => handleCheckboxChange(item.value, checked)}
                                        className="mr-3 scale-125 accent-cyan-500 min-w-5 min-h-5"
                                    />
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                        <div className="mt-6 text-right">
                            <Button onClick={() => handleAddCheckboxItem(groupId)} className="bg-purple-700 text-white py-2 px-4 rounded-full text-sm shadow-md hover:bg-purple-800 transition-colors">
                                Agregar Checkbox
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
