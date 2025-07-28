'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TransferItem {
  service: string;
  value: string;
  isCustom?: boolean;
}

interface TransferenciasTabProps {
  transferItems: TransferItem[];
  setTransferItems: (items: TransferItem[]) => void;
  newService: string;
  setNewService: (value: string) => void;
  newValue: string;
  setNewValue: (value: string) => void;
}

export default function TransferenciasTab({
  transferItems,
  setTransferItems,
  newService,
  setNewService,
  newValue,
  setNewValue,
}: TransferenciasTabProps) {

  const handleAddTransfer = () => {
    if (newService.trim() && newValue.trim()) {
      setTransferItems([
        ...transferItems,
        { service: newService, value: newValue, isCustom: true },
      ]);
      setNewService('');
      setNewValue('');
    }
  };

  const handleRemoveTransfer = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transferencias</CardTitle>
          <CardDescription>Destinos de transferencia predefinidos y personalizados.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72">
            <div className="space-y-4 pr-4">
              {transferItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted">
                  <div>
                    <p className="font-semibold">{item.service}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                  {item.isCustom && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTransfer(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Añadir Transferencia</CardTitle>
          <CardDescription>Agrega un nuevo destino de transferencia personalizado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newService">Servicio</Label>
            <Input 
              id="newService" 
              value={newService} 
              onChange={(e) => setNewService(e.target.value)} 
              placeholder="Ej: VENTAS" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newValue">Valor / Extensión</Label>
            <Input 
              id="newValue" 
              value={newValue} 
              onChange={(e) => setNewValue(e.target.value)} 
              placeholder="Ej: 105"
            />
          </div>
          <Button onClick={handleAddTransfer} className="w-full">
            Agregar Transferencia
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
