'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from './ui/button';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tipos para los datos del formulario y checkboxes
type GenericFormData = {
    idLlamada: string;
    nombreContacto: string;
    nIncidencia: string;
    inconveniente: string;
    tipoServicio: string;
    pruebasRealizadas: string;
};

type CheckboxState = {
    [key: string]: boolean;
};

const initialFormData: GenericFormData = {
    idLlamada: '',
    nombreContacto: '',
    nIncidencia: '',
    inconveniente: '',
    tipoServicio: '',
    pruebasRealizadas: '',
};

const checkboxOptions = {
    nivelCero: {
        'Se verifican leds de la ONT/Módem y todos están correctos.': false,
        'Se realizan pruebas con cable de red y persiste el inconveniente.': false,
    },
    gponAdslHfc: {
        'Se realizan pruebas de velocidad y los parámetros son correctos.': false,
    },
    tvHfcDthIptv: {
        'Se verifican conexiones y cableado, todo correcto.': false,
    },
    otros: {
        'Se reinicia el equipo de forma remota.': false,
    },
};


const PlantillasGenericasTab = () => {
    const [formData, setFormData] = useState<GenericFormData>(initialFormData);
    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        ...checkboxOptions.nivelCero,
        ...checkboxOptions.gponAdslHfc,
        ...checkboxOptions.tvHfcDthIptv,
        ...checkboxOptions.otros,
    });
    const { toast } = useToast();

    useEffect(() => {
        const pruebas = Object.keys(checkboxes)
            .filter(key => checkboxes[key])
            .map(key => `- ${key}`)
            .join('\n');
        setFormData(prev => ({ ...prev, pruebasRealizadas: pruebas }));
    }, [checkboxes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const keyMapping: { [key: string]: keyof GenericFormData } = {
            'id-llamada': 'idLlamada',
            'nombre-contacto': 'nombreContacto',
            'n-incidencia': 'nIncidencia',
            'inconveniente': 'inconveniente',
            'tipo-servicio': 'tipoServicio',
            'pruebas-realizadas': 'pruebasRealizadas'
        };
        const formKey = keyMapping[id];
        if (formKey) {
            setFormData(prev => ({ ...prev, [formKey]: value }));
        }
    };
    
    const handleCheckboxChange = (id: string) => {
        setCheckboxes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleClear = () => {
        setFormData(initialFormData);
        const resetCheckboxes: CheckboxState = {};
        Object.keys(checkboxes).forEach(key => {
            resetCheckboxes[key] = false;
        });
        setCheckboxes(resetCheckboxes);
        toast({
            title: "Formulario Limpio",
            description: "Se han restablecido todos los campos.",
        });
    };

    const handleCopy = () => {
        const plantilla = `
ID de llamada: ${formData.idLlamada}
Nombre del contacto: ${formData.nombreContacto}
N° Incidencia: ${formData.nIncidencia}
Inconveniente: ${formData.inconveniente}
Tipo Servicio: ${formData.tipoServicio}

PRUEBAS REALIZADAS:
${formData.pruebasRealizadas}
        `.trim();

        navigator.clipboard.writeText(plantilla).then(() => {
            toast({
                title: "Copiado al Portapapeles",
                description: "La plantilla se ha copiado correctamente.",
            });
        }).catch(err => {
            console.error('Error al copiar: ', err);
            toast({
                title: "Error",
                description: "No se pudo copiar la plantilla.",
                variant: "destructive",
            });
        });
    };
    
    const renderCheckboxes = (category: keyof typeof checkboxOptions) => {
        return Object.keys(checkboxOptions[category]).map(label => (
            <div className="flex items-center space-x-2" key={label}>
                <Checkbox
                    id={label}
                    checked={checkboxes[label]}
                    onCheckedChange={() => handleCheckboxChange(label)}
                />
                <Label htmlFor={label} className="font-normal">{label}</Label>
            </div>
        ));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Columna del Formulario Principal (2/3 de ancho) */}
            <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="id-llamada">ID de llamada:</Label>
                        <Input id="id-llamada" placeholder="Ingrese ID de llamada..." value={formData.idLlamada} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nombre-contacto">Nombre del contacto:</Label>
                        <Input id="nombre-contacto" placeholder="Ingrese nombre del contacto..." value={formData.nombreContacto} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="n-incidencia">N° Incidencia:</Label>
                        <Input id="n-incidencia" placeholder="Ingrese N° de incidencia..." value={formData.nIncidencia} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="inconveniente">Inconveniente:</Label>
                        <Input id="inconveniente" placeholder="Ingrese inconveniente..." value={formData.inconveniente} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tipo-servicio">Tipo Servicio:</Label>
                        <Input id="tipo-servicio" placeholder="Ingrese tipo de servicio..." value={formData.tipoServicio} onChange={handleInputChange}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pruebas-realizadas">PRUEBAS REALIZADAS:</Label>
                    <Textarea id="pruebas-realizadas" rows={10} placeholder="Las pruebas realizadas se actualizarán aquí..." value={formData.pruebasRealizadas} onChange={handleInputChange} />
                </div>
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Plantilla
                    </Button>
                    <Button variant="destructive" onClick={handleClear}>
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
                       {renderCheckboxes('nivelCero')}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">GPON - ADSL - HFC</h4>
                    <div className="space-y-2">
                        {renderCheckboxes('gponAdslHfc')}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">TV HFC - DTH - IPTV</h4>
                    <div className="space-y-2">
                        {renderCheckboxes('tvHfcDthIptv')}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Otros</h4>
                    <div className="space-y-2">
                        {renderCheckboxes('otros')}
                    </div>
                </div>
            </div>
        </div>
    );
};

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
