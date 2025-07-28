'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TMO_META = 372;

export default function HerramientasTab() {
  const [minutos, setMinutos] = useState('');
  const [segundos, setSegundos] = useState<number | null>(null);

  const handleConvert = () => {
    const min = parseFloat(minutos);
    if (!isNaN(min)) {
      setSegundos(min * 60);
    } else {
      setSegundos(null);
    }
  };

  const getResultColor = () => {
    if (segundos === null) return '';
    return segundos > TMO_META ? 'text-destructive' : 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora TMO</CardTitle>
        <CardDescription>Convierte minutos a segundos para calcular el Tiempo Medio Operativo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="minutosTMO">Minutos</Label>
          <Input 
            id="minutosTMO" 
            type="number" 
            value={minutos} 
            onChange={(e) => setMinutos(e.target.value)}
            placeholder="Ej: 6.2"
          />
        </div>
        <Button onClick={handleConvert}>Convertir a Segundos</Button>
        <div className="pt-4 mt-4 border-t">
            <p className="text-lg font-semibold">Resultado:</p>
            {segundos !== null ? (
                 <p className={`text-2xl font-bold ${getResultColor()}`}>{segundos.toFixed(0)} segundos</p>
            ) : (
                <p className="text-muted-foreground">Ingrese un valor para convertir.</p>
            )}
             <p className="text-sm font-bold text-primary mt-2">META TMO {TMO_META} SEGUNDOS COMO MÁXIMO!</p>
        </div>
      </CardContent>
    </Card>
  );
}
