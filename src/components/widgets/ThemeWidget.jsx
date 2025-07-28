// components/widgets/ThemeWidget.jsx
'use client';

import React, { useCallback, useContext, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AppStateContext, defaultThemeSettings } from '../../context/AppStateContext'; // Import defaultThemeSettings
import { hexToRgbString, rgbStringToHex } from '../../lib/utils'; // Import utility functions

export default function ThemeWidget() {
    const { appData, updateThemeSettings, setAlert } = useContext(AppStateContext);

    const themeColorInputs = [
        { id: 'themeColorPrimary', label: 'Color Primario (ej. Azul Oscuro)', cssVar: '--azul-oscuro', type: 'css' },
        { id: 'themeColorSecondary', label: 'Color Secundario (ej. Morado)', cssVar: '--morado', type: 'css' },
        { id: 'themeColorAccent', label: 'Color Acento (ej. Turquesa)', cssVar: '--turquesa', type: 'css' },
        { id: 'themeColorBackground', label: 'Color Fondo Principal', cssVar: '--gris-claro', type: 'css' },
        { id: 'themeColorTextDark', label: 'Color Texto Principal (Oscuro)', cssVar: '--texto-oscuro', type: 'css' },
        { id: 'themeColorNeuron1', label: 'Neurona Color 1', neuronVar: '--neuron-color-1-rgb', type: 'neuron' },
        { id: 'themeColorNeuron2', label: 'Neurona Color 2', neuronVar: '--neuron-color-2-rgb', type: 'neuron' },
        { id: 'themeColorNeuron3', label: 'Neurona Color 3', neuronVar: '--neuron-color-3-rgb', type: 'neuron' },
        { id: 'themeColorNeuronConnection', label: 'Conexión Neuronas', neuronVar: '--neuron-connection-rgb', type: 'neuron' }
    ];

    const applyCurrentTheme = useCallback(() => {
        themeColorInputs.forEach(inputConfig => {
            const varName = inputConfig.cssVar || inputConfig.neuronVar;
            const colorValue = appData.themeSettings[varName]; // Get current value from appData
            if (colorValue) {
                if (inputConfig.type === 'css') {
                    document.documentElement.style.setProperty(varName, colorValue);
                } else if (inputConfig.type === 'neuron') {
                    // Neuron colors are stored as RGB string in appData, so use directly
                    document.documentElement.style.setProperty(varName, colorValue);
                }
            }
        });
    }, [appData.themeSettings]);

    const resetThemeToDefaults = useCallback(() => {
        Object.keys(defaultThemeSettings).forEach(varName => {
            // Update CSS variable
            document.documentElement.style.setProperty(varName, defaultThemeSettings[varName]);
            // Update appData state
            updateThemeSettings(varName, defaultThemeSettings[varName]);
        });
        setAlert({ isOpen: true, message: 'Tema restaurado a los valores por defecto.' });
    }, [updateThemeSettings, setAlert]);

    // Apply theme on component mount and when themeSettings change in appData
    useEffect(() => {
        applyCurrentTheme();
    }, [appData.themeSettings, applyCurrentTheme]);


    const handleColorChange = useCallback((varName, hexValue) => {
        let valueToStore = hexValue;
        // If it's a neuron variable, convert hex to RGB string for storage
        if (varName.includes('neuron')) {
            valueToStore = hexToRgbString(hexValue);
        }
        updateThemeSettings(varName, valueToStore);
    }, [updateThemeSettings]);

    return (
        <div className="widget-panel fixed bottom-[75px] right-2 w-80 max-h-[70vh] overflow-y-auto bg-white bg-opacity-95 p-6 rounded-2xl shadow-2xl flex flex-col border-t-4 border-t-orange-500 animate-fadeInScale">
            <h3 className="text-center text-2xl font-bold text-blue-800 mb-4 pb-3 border-b border-purple-300">Personalizar Tema</h3>
            {themeColorInputs.map(inputConfig => {
                const varName = inputConfig.cssVar || inputConfig.neuronVar;
                const currentColorValue = appData.themeSettings[varName];
                // For color picker, always provide a hex value.
                // If stored as RGB string (neuron colors), convert back to hex for the input.
                const displayValue = inputConfig.type === 'neuron' && currentColorValue
                    ? rgbStringToHex(currentColorValue)
                    : currentColorValue || defaultThemeSettings[varName]; // Fallback to default if not in appData

                return (
                    <div key={inputConfig.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                        <Label htmlFor={inputConfig.id} className="block text-lg font-medium text-gray-700 mb-2">
                            {inputConfig.label}:
                        </Label>
                        <Input
                            type="color"
                            id={inputConfig.id}
                            value={displayValue}
                            onChange={(e) => handleColorChange(varName, e.target.value)}
                            className="w-full h-10 p-1 rounded-md border border-gray-300 cursor-pointer"
                        />
                    </div>
                );
            })}
            <div className="flex justify-between gap-3 mt-6">
                <Button onClick={applyCurrentTheme} className="flex-grow bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 text-sm">
                    Aplicar
                </Button>
                <Button onClick={resetThemeToDefaults} className="flex-grow bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm">
                    Restaurar
                </Button>
            </div>
        </div>
    );
}
