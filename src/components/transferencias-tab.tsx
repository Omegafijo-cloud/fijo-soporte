'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from './ui/label';
import { PlusCircle, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface TransferItem {
    service: string;
    value: string;
}

const initialTransferItems: TransferItem[] = [
    { service: "SERVICIO MOVIL (LLAMADAS)", value: "*2" },
    { service: "SERVICIO MOVIL (DATOS)", value: "*3" },
    { service: "SERVICIO MOVIL (OTROS)", value: "*4" },
    { service: "COMERCIAL", value: "123" },
    { service: "EQUIPO DE VENTAS", value: "811" },
];

export function TransferenciasTab() {
    const [items, setItems] = useState<TransferItem[]>(initialTransferItems);
    const [newService, setNewService] = useState('');
    const [newValue, setNewValue] = useState('');
    const { toast } = useToast();

    const handleAddItem = () => {
        if (newService.trim() && newValue.trim()) {
            setItems([...items, { service: newService, value: newValue }]);
            setNewService('');
            setNewValue('');
            toast({
                title: "Transferencia Añadida",
                description: "El nuevo destino de transferencia ha sido agregado.",
            });
        } else {
            toast({
                title: "Error",
                description: "Por favor, complete ambos campos para añadir una transferencia.",
                variant: "destructive",
            });
        }
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        toast({
            title: "Transferencia Eliminada",
            description: "El destino de transferencia ha sido eliminado.",
        });
    };
    
    const handleCopyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value).then(() => {
            toast({
                title: 'Copiado',
                description: `"${value}" ha sido copiado al portapapeles.`
            });
        });
    };

    const renderItem = (item: TransferItem, index: number) => (
        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
                <p className="font-semibold">{item.service}</p>
                <p className="text-muted-foreground">{item.value}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(item.value)}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna de la Lista de Transferencias */}
                <div className="md:col-span-2">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Lista de Transferencias</CardTitle>
                            <CardDescription>Destinos predefinidos y personalizados para transferencias.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.length > 0 ? (
                                <div className="space-y-2">
                                    {items.map((item, index) => renderItem(item, index))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Aún no hay transferencias en la lista.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Columna para Añadir Nueva Transferencia */}
                <div>
                    <Card className="shadow-lg sticky top-24">
                        <CardHeader>
                            <CardTitle>Añadir Nueva</CardTitle>
                            <CardDescription>Crea un nuevo destino de transferencia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-service">Servicio:</Label>
                                <Input
                                    id="new-service"
                                    placeholder="Ej: SOPORTE NIVEL 2"
                                    value={newService}
                                    onChange={(e) => setNewService(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-value">Valor (Número/Código):</Label>
                                <Input
                                    id="new-value"
                                    placeholder="Ej: *911"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleAddItem}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Añadir a la Lista
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}