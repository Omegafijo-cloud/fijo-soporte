'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash2 } from "lucide-react";

interface NotesWidgetProps {
    quickNotes: string;
    setQuickNotes: (value: string) => void;
    onCopy: (content: string, title: string) => void;
    onClear: (setter: React.Dispatch<React.SetStateAction<string>>, title: string) => void;
}

export function NotesWidget({ quickNotes, setQuickNotes, onCopy, onClear }: NotesWidgetProps) {
    return (
        <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
            <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-center">Notas Rápidas</h4>
                <Textarea placeholder="Escribe tus notas aquí..." rows={8} value={quickNotes} onChange={(e) => setQuickNotes(e.target.value)} />
                <div className="flex justify-between gap-2">
                    <Button size="sm" onClick={() => onCopy(quickNotes, 'Notas Rápidas')} className="flex-1"><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                    <Button size="sm" variant="destructive" onClick={() => onClear(setQuickNotes, 'Notas Rápidas')} className="flex-1"><Trash2 className="mr-2 h-4 w-4" /> Limpiar</Button>
                </div>
            </CardContent>
        </Card>
    );
}
