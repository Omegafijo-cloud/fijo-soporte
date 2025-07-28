'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return `#${[8, 4, 0].map(n =>
        Math.round(f(n) * 255).toString(16).padStart(2, '0')
    ).join('')}`;
};

interface ThemeWidgetProps {
    themeColors: {
        background: { h: number; s: number; l: number; };
        foreground: { h: number; s: number; l: number; };
        primary: { h: number; s: number; l: number; };
        accent: { h: number; s: number; l: number; };
    };
    onColorChange: (colorName: keyof ThemeWidgetProps['themeColors'], hexValue: string) => void;
    onReset: () => void;
}

export function ThemeWidget({ themeColors, onColorChange, onReset }: ThemeWidgetProps) {
    return (
        <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
            <CardContent className="p-4 space-y-4">
                <h4 className="font-semibold text-center">Personalizar Tema</h4>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Fondo</Label>
                        <Input type="color" value={hslToHex(themeColors.background.h, themeColors.background.s, themeColors.background.l)} onChange={(e) => onColorChange('background', e.target.value)} className="p-1 h-10" />
                    </div>
                    <div className="space-y-1">
                        <Label>Texto</Label>
                        <Input type="color" value={hslToHex(themeColors.foreground.h, themeColors.foreground.s, themeColors.foreground.l)} onChange={(e) => onColorChange('foreground', e.target.value)} className="p-1 h-10" />
                    </div>
                    <div className="space-y-1">
                        <Label>Primario</Label>
                        <Input type="color" value={hslToHex(themeColors.primary.h, themeColors.primary.s, themeColors.primary.l)} onChange={(e) => onColorChange('primary', e.target.value)} className="p-1 h-10" />
                    </div>
                    <div className="space-y-1">
                        <Label>Acento</Label>
                        <Input type="color" value={hslToHex(themeColors.accent.h, themeColors.accent.s, themeColors.accent.l)} onChange={(e) => onColorChange('accent', e.target.value)} className="p-1 h-10" />
                    </div>
                </div>
                <Button onClick={onReset} variant="outline" className="w-full"><RotateCcw className="mr-2 h-4 w-4" /> Restaurar</Button>
            </CardContent>
        </Card>
    );
}
