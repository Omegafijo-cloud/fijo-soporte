'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash2 } from "lucide-react";

interface UsersWidgetProps {
    userList: string;
    setUserList: (value: string) => void;
    onCopy: (content: string, title: string) => void;
    onClear: (setter: React.Dispatch<React.SetStateAction<string>>, title: string) => void;
}

export function UsersWidget({ userList, setUserList, onCopy, onClear }: UsersWidgetProps) {
    return (
        <Card className="w-80 shadow-lg animate-in slide-in-from-bottom-10">
            <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-center">Lista de Usuarios</h4>
                <Textarea placeholder="Mantén tu lista de usuarios aquí..." rows={8} value={userList} onChange={(e) => setUserList(e.target.value)} />
                <div className="flex justify-between gap-2">
                    <Button size="sm" onClick={() => onCopy(userList, 'Lista de Usuarios')} className="flex-1"><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
                    <Button size="sm" variant="destructive" onClick={() => onClear(setUserList, 'Lista de Usuarios')} className="flex-1"><Trash2 className="mr-2 h-4 w-4" /> Limpiar</Button>
                </div>
            </CardContent>
        </Card>
    );
}
