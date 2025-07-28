// components/auth/LoginPage.jsx
'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function LoginPage({ handleLogin, setAlert }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen text-center relative z-20 p-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-10 text-blue-800 font-extrabold tracking-wider shadow-text flex items-center justify-center gap-4">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 inline-block align-middle">
                    <circle cx="50" cy="50" r="35" fill="var(--blanco)"/>
                    <circle cx="50" cy="50" r="30" fill="var(--azul-oscuro)"/>
                    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(-30 50 50)" stroke="var(--turquesa)" strokeWidth="3" fill="none"/>
                    <ellipse cx="50" cy="50" rx="45" ry="25" transform="rotate(30 50 50)" stroke="var(--morado)" strokeWidth="3" fill="none"/>
                    <circle cx="50" cy="50" r="40" stroke="var(--azul-oscuro)" strokeWidth="2" fill="none"/>
                    <circle cx="28" cy="58" r="5" fill="var(--turquesa)" className="electron-dot"/>
                    <circle cx="72" cy="42" r="5" fill="var(--blanco)" className="electron-dot"/>
                    <circle cx="28" cy="42" r="5" fill="var(--morado)" className="electron-dot"/>
                    <circle cx="72" cy="58" r="5" fill="var(--blanco)" className="electron-dot"/>
                    <circle cx="50" cy="10" r="5" fill="var(--turquesa)" className="electron-dot"/>
                    <circle cx="50" cy="90" r="5" fill="var(--blanco)" className="electron-dot"/>
                </svg>
                OMEGA - FIJO SOPORTE
            </h1>
            <div className="bg-white bg-opacity-95 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-t-purple-700">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 pb-4 border-b-2 border-b-purple-300">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 text-left">
                        <Label htmlFor="loginEmail" className="block text-lg font-medium text-gray-700 mb-2">Correo Electrónico</Label>
                        <Input
                            type="email"
                            id="loginEmail"
                            placeholder="Ingrese su correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 transition-all duration-300"
                        />
                    </div>
                    <div className="mb-6 text-left">
                        <Label htmlFor="loginPassword" className="block text-lg font-medium text-gray-700 mb-2">Contraseña</Label>
                        <Input
                            type="password"
                            id="loginPassword"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 transition-all duration-300"
                        />
                    </div>
                    <Button type="submit" className="w-full py-3 text-lg bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Iniciar Sesión
                    </Button>
                </form>
                <p className="mt-5 text-sm text-gray-600">
                    Solo los usuarios autorizados pueden iniciar sesión.
                </p>
            </div>
        </div>
    );
}
