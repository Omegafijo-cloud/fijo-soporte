'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TMO_META = 372;

export function HerramientasTab() {
  const [minutos, setMinutos] = useState('');
  const [segundos, setSegundos] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinutos(value);
    if (value === '') {
      setSegundos(null);
    } else {
      const minutes = parseFloat(value);
      if (!isNaN(minutes)) {
        setSegundos(minutes * 60);
      } else {
        setSegundos(null);
      }
    }
  };

  const getResultColor = () => {
    if (segundos === null) return 'text-muted-foreground';
    return segundos > TMO_META ? 'text-destructive' : 'text-green-500';
  };

  return (
    <div className="p-6 flex justify-center items-start">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Calculadora TMO</CardTitle>
          <CardDescription className="text-center pt-2">
            Convierte minutos a segundos para calcular el Tiempo Medio Operativo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="minutos-tmo" className="text-center block">Minutos:</Label>
            <Input
              id="minutos-tmo"
              type="number"
              placeholder="Ej: 6.2"
              value={minutos}
              onChange={handleInputChange}
              className="text-center text-lg"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="font-bold text-primary uppercase tracking-wider">Meta TMO: {TMO_META} segundos como máximo</p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-semibold text-muted-foreground">Equivalente en Segundos:</p>
              <p className={`text-5xl font-bold transition-colors duration-300 ${getResultColor()}`}>
                {segundos !== null ? segundos.toFixed(0) : '...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
