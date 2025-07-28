'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TMO_META = 372;

interface HerramientasTabProps {
  minutos: string;
  setMinutos: (value: string) => void;
}

export default function HerramientasTab({ minutos, setMinutos }: HerramientasTabProps) {
  const [segundos, setSegundos] = useState<number | null>(null);

  useEffect(() => {
    const min = parseFloat(minutos);
    if (!isNaN(min) && minutos.trim() !== '') {
      setSegundos(min * 60);
    } else {
      setSegundos(null);
    }
  }, [minutos]);

  const getResultColor = () => {
    if (segundos === null) return 'text-muted-foreground';
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
        <div className="pt-4 mt-4 border-t">
            <p className="text-lg font-semibold">Resultado:</p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${getResultColor()}`}>
              {segundos !== null ? `${segundos.toFixed(0)} segundos` : 'Ingrese un valor...'}
            </p>
            <p className="text-sm font-bold text-primary mt-2">META TMO {TMO_META} SEGUNDOS COMO MÁXIMO!</p>
        </div>
      </CardContent>
    </Card>
  );
}
