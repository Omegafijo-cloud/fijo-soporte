'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from './ui/button';
import { Copy, Trash2 } from 'lucide-react';

const PlantillasGenericasTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Columna del Formulario Principal (2/3 de ancho) */}
        <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id-llamada">ID de llamada:</Label>
                    <Input id="id-llamada" placeholder="Ingrese ID de llamada..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nombre-contacto">Nombre del contacto:</Label>
                    <Input id="nombre-contacto" placeholder="Ingrese nombre del contacto..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="n-incidencia">N° Incidencia:</Label>
                    <Input id="n-incidencia" placeholder="Ingrese N° de incidencia..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="inconveniente">Inconveniente:</Label>
                    <Input id="inconveniente" placeholder="Ingrese inconveniente..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tipo-servicio">Tipo Servicio:</Label>
                    <Input id="tipo-servicio" placeholder="Ingrese tipo de servicio..." />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="pruebas-realizadas">PRUEBAS REALIZADAS:</Label>
                <Textarea id="pruebas-realizadas" rows={10} placeholder="Las pruebas realizadas se actualizarán aquí..." />
            </div>
             <div className="flex gap-4 mt-4">
                <Button>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Plantilla
                </Button>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Limpiar
                </Button>
            </div>
        </div>

        {/* Columna de Checkboxes (1/3 de ancho) */}
        <div className="space-y-4">
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Nivel Cero</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="cero-1" />
                        <Label htmlFor="cero-1">Checkbox 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="cero-2" />
                        <Label htmlFor="cero-2">Checkbox 2</Label>
                    </div>
                </div>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">GPON - ADSL - HFC</h4>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="gpon-1" />
                        <Label htmlFor="gpon-1">Checkbox 1</Label>
                    </div>
                </div>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">TV HFC - DTH - IPTV</h4>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="tv-1" />
                        <Label htmlFor="tv-1">Checkbox 1</Label>
                    </div>
                </div>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Otros</h4>
                 <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="otros-1" />
                        <Label htmlFor="otros-1">Checkbox 1</Label>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
const PlantillasQuejasTab = () => <div>Contenido de Plantillas de Quejas</div>;
const MemosWFTab = () => <div>Contenido de Memos de WF</div>;
const MemosOrdenTab = () => <div>Contenido de Memos de Orden</div>;


export function PlantillasTab() {
  return (
    <Tabs defaultValue="genericas" className="w-full">
      <TabsList className="grid w-full grid-cols-4 rounded-none rounded-t-lg">
        <TabsTrigger value="genericas" className="rounded-tl-md">PLANTILLAS GENERICAS</TabsTrigger>
        <TabsTrigger value="quejas">PLANTILLAS DE QUEJAS</TabsTrigger>
        <TabsTrigger value="wf">MEMOS DE WF</TabsTrigger>
        <TabsTrigger value="orden" className="rounded-tr-md">MEMOS DE ORDEN</TabsTrigger>
      </TabsList>
      <TabsContent value="genericas">
        <PlantillasGenericasTab />
      </TabsContent>
      <TabsContent value="quejas">
        <PlantillasQuejasTab />
      </TabsContent>
      <TabsContent value="wf">
        <MemosWFTab />
      </TabsContent>
      <TabsContent value="orden">
        <MemosOrdenTab />
      </TabsContent>
    </Tabs>
  );
}
