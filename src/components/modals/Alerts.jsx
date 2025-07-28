// components/modals/Alerts.jsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

export const CustomAlertDialog = ({ message, isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm rounded-xl border-t-4 border-t-cyan-500 bg-white p-6 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-blue-800">Alerta</DialogTitle>
                    <DialogDescription className="text-center text-gray-700 text-lg my-4">{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center">
                    <Button onClick={onClose} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const CustomConfirmDialog = ({ message, isOpen, onConfirm, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm rounded-xl border-t-4 border-t-cyan-500 bg-white p-6 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-blue-800">Confirmación</DialogTitle>
                    <DialogDescription className="text-center text-gray-700 text-lg my-4">{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center gap-4">
                    <Button onClick={onConfirm} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Sí
                    </Button>
                    <Button onClick={onClose} className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        No
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const ImportantNoticeModal = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-xl border-t-4 border-t-cyan-500 bg-white p-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl font-extrabold text-blue-800 mb-4">¡AVISO IMPORTANTE!</DialogTitle>
                    <DialogDescription className="text-center text-gray-700 text-lg leading-relaxed">
                        Ahora Omega presenta su nueva pestaña de AVISOS, la cual tiene como finalidad mostrar aquellos documentos importantes que están en circuito en operación como por ejemplo: word de migración y WF para seguimiento de ordenes!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center mt-6">
                    <Button onClick={onClose} className="bg-gradient-to-r from-purple-700 to-blue-800 hover:from-blue-800 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                        Entendido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
