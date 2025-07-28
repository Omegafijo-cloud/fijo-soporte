// components/tabs/CalculadoraTMOTab.jsx
'use client';

import React, { useState, useCallback, useContext } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AppStateContext } from '../../context/AppStateContext';

export default function CalculadoraTMOTab() {
    const { setAlert } = useContext(AppStateContext);
    const [minutes, setMinutes] = useState('');
    const [secondsResult, setSecondsResult] = useState(0);
    const [resultClass, setResultClass] = useState('');

    const handleConvert = useCallback(() => {
        const min = parseFloat(minutes);
        if (isNaN(min) || min < 0) {
            setAlert({ isOpen: true, message: 'Por favor, ingrese un número válido de minutos.' });
            setSecondsResult(0);
            setResultClass('');
            return;
        }
        const seconds = Math.round(min * 60);
        setSecondsResult(seconds);
        if (seconds > 372) {
            setResultClass('bg-red-100 border-red-700 text-red-700');
        } else if (seconds <= 372 && seconds > 0) {
            setResultClass('bg-green-100 border-green-700 text-green-700');
        } else {
            setResultClass('');
        }
    }, [minutes, setAlert]);

    return (
        <div className="flex flex-wrap justify-center items-start gap-6 w-full max-w-5xl mx-auto">
            <div className="tmo-message-box">
                META TMO 372 SEGUNDOS COMO MÁXIMO!
            </div>

            <div className="tmo-converter-box">
                <h3 className="text-3xl font-bold text-blue-800 mb-8 pb-4 border-b-2 border-b-purple-300">
                    Calculadora de TMO
                </h3>
                <div className="mb-8">
                    <Label htmlFor="minutesInput" className="block text-xl font-medium text-gray-700 mb-3">Minutos</Label>
                    <Input
                        id="minutesInput"
                        type="number"
                        placeholder="Ingrese minutos"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        min="0"
                        step="any"
                        className="w-full p-4 rounded-xl border border-gray-300 text-xl text-gray-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200"
                    />
                </div>
                <Button onClick={handleConvert} className="w-full py-4 text-xl bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                    Convertir
                </Button>
                <div className={`seconds-result-display ${resultClass}`}>
                    {secondsResult} Segundos
                </div>
            </div>
        </div>
    );
}
