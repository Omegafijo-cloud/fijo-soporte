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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
        const pruebas = Object.entries(checkboxes)
            .filter(([, checked]) => checked)
            .map(([label]) => label.replace(/\.$/, ''))
            .join('. ');
        setFormData(prev => ({ ...prev, pruebasRealizadas: pruebas ? pruebas + '.' : '' }));
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
        const formKey = keyMapping[id as keyof typeof keyMapping];
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
        `.trim().replace(/\n\s*\n/g, '\n');

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
    
    const renderCheckboxes = (options: {[key: string]: boolean}) => {
        return Object.keys(options).map(label => (
            <div className="flex items-center space-x-2" key={label}>
                <Checkbox
                    id={`genericas-${label}`}
                    checked={checkboxes[label]}
                    onCheckedChange={() => handleCheckboxChange(label)}
                />
                <Label htmlFor={`genericas-${label}`} className="font-normal">{label}</Label>
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
                       {renderCheckboxes(checkboxOptions.nivelCero)}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">GPON - ADSL - HFC</h4>
                    <div className="space-y-2">
                        {renderCheckboxes(checkboxOptions.gponAdslHfc)}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">TV HFC - DTH - IPTV</h4>
                    <div className="space-y-2">
                        {renderCheckboxes(checkboxOptions.tvHfcDthIptv)}
                    </div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Otros</h4>
                    <div className="space-y-2">
                        {renderCheckboxes(checkboxOptions.otros)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PLANTILLAS DE QUEJAS ---
const memoQuejasTemplates: { [key: string]: { id: string; label: string; type: 'text' | 'textarea' }[] } = {
    'INTERNET DSL': [
        { id: 'luz-portadora', label: 'Luz Portadora:', type: 'text' },
        { id: 'snr', label: 'SNR:', type: 'text' },
        { id: 'atenuacion', label: 'Atenuación:', type: 'text' },
        { id: 'problema-reportado', label: 'Problema Reportado:', type: 'textarea' },
    ],
    'TV DTH': [
        { id: 'modelo-deco', label: 'Modelo DECO:', type: 'text' },
        { id: 'version-sw', label: 'Versión SW:', type: 'text' },
        { id: 'id-smart-card', label: 'ID Smart Card:', type: 'text' },
        { id: 'problema-reportado-tv', label: 'Problema Reportado:', type: 'textarea' },
    ],
};

const initialQuejasCheckboxState: CheckboxState = {
    'Se solicita realizar descartes con cable de red y persiste el inconveniente (Memo).': false,
    'Se realizan pruebas de velocidad y los parámetros son correctos (Memo).': false,
    'Se realizan pruebas en el DECO y persiste el inconveniente (Memo).': false,
    'Se reinicia el equipo de forma remota (Memo).': false,
};

const quejasCheckboxOptions = {
    nivelCero: { 'Se solicita realizar descartes con cable de red y persiste el inconveniente (Memo).': false },
    gponAdslHfc: { 'Se realizan pruebas de velocidad y los parámetros son correctos (Memo).': false },
    tvHfcDthIptv: { 'Se realizan pruebas en el DECO y persiste el inconveniente (Memo).': false },
    otros: { 'Se reinicia el equipo de forma remota (Memo).': false },
};

const PlantillasQuejasTab = () => {
    const [selectedMemo, setSelectedMemo] = useState<string>('');
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [checkboxes, setCheckboxes] = useState<CheckboxState>(initialQuejasCheckboxState);
    const { toast } = useToast();

    useEffect(() => {
        const pruebas = Object.entries(checkboxes)
            .filter(([, checked]) => checked)
            .map(([label]) => label.replace(/\s\(Memo\)\.$/, ''))
            .join('. ');
        setFormData(prev => ({ ...prev, pruebasRealizadas: pruebas ? pruebas + '.' : '' }));
    }, [checkboxes]);

    const handleMemoChange = (value: string) => {
        setSelectedMemo(value);
        const currentPruebas = formData.pruebasRealizadas;
        setFormData({ pruebasRealizadas: currentPruebas || '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckboxes(prev => ({ ...prev, [id]: checked }));
    };
    
    const handleClear = () => {
        setSelectedMemo('');
        setFormData({});
        setCheckboxes(initialQuejasCheckboxState);
        toast({ 
            title: "Formulario de Queja Limpio",
            description: "Se han restablecido todos los campos del memo."
        });
    };

    const handleCopy = () => {
        if (!selectedMemo) {
            toast({
                title: "Error",
                description: "Por favor, seleccione un tipo de memo primero.",
                variant: "destructive",
            });
            return;
        }

        let memoContent = `MEMO DE QUEJA: ${selectedMemo}\n\n`;
        const templateFields = memoQuejasTemplates[selectedMemo as keyof typeof memoQuejasTemplates];

        if (templateFields) {
            templateFields.forEach(field => {
                memoContent += `${field.label} ${formData[field.id] || ''}\n`;
            });
        }
        
        memoContent += `\nPRUEBAS REALIZADAS:\n${formData.pruebasRealizadas || ''}`;

        navigator.clipboard.writeText(memoContent.trim().replace(/\n\s*\n/g, '\n')).then(() => {
            toast({ 
                title: "Memo de Queja Copiado",
                description: "El memo ha sido copiado al portapapeles."
            });
        }).catch(err => {
            console.error('Error al copiar: ', err);
            toast({ title: "Error al Copiar", variant: "destructive" });
        });
    };

    const renderDynamicFields = () => {
        if (!selectedMemo) return <p className="text-muted-foreground text-center col-span-2 py-8">Seleccione un tipo de memo para ver el formulario.</p>;
        
        const fields = memoQuejasTemplates[selectedMemo as keyof typeof memoQuejasTemplates];

        return fields.map(field => (
            <div className="space-y-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                    <Textarea id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                ) : (
                    <Input id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                )}
            </div>
        ));
    };

    const renderCheckboxes = (options: { [key: string]: boolean }) => {
        return Object.keys(options).map(label => (
            <div className="flex items-center space-x-2" key={label}>
                <Checkbox
                    id={`quejas-${label}`}
                    checked={!!checkboxes[label]}
                    onCheckedChange={(checked) => handleCheckboxChange(label, !!checked)}
                />
                <Label htmlFor={`quejas-${label}`} className="font-normal">{label}</Label>
            </div>
        ));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                    <Label>Tipo de Memo de Queja:</Label>
                    <Select onValueChange={handleMemoChange} value={selectedMemo}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo de memo..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INTERNET DSL">INTERNET DSL</SelectItem>
                            <SelectItem value="TV DTH">TV DTH</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderDynamicFields()}
                </div>

                {selectedMemo && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="pruebas-realizadas-quejas">PRUEBAS REALIZADAS:</Label>
                            <Textarea id="pruebas-realizadas-quejas" rows={8} value={formData.pruebasRealizadas || ''} readOnly className="bg-muted/50" />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Button onClick={handleCopy}><Copy className="mr-2 h-4 w-4" />Copiar Memo</Button>
                            <Button variant="destructive" onClick={handleClear}><Trash2 className="mr-2 h-4 w-4" />Limpiar Memo</Button>
                        </div>
                    </>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Nivel Cero (Memos)</h4>
                    <div className="space-y-2">{renderCheckboxes(quejasCheckboxOptions.nivelCero)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">GPON - ADSL - HFC (Memos)</h4>
                    <div className="space-y-2">{renderCheckboxes(quejasCheckboxOptions.gponAdslHfc)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">TV HFC - DTH - IPTV (Memos)</h4>
                    <div className="space-y-2">{renderCheckboxes(quejasCheckboxOptions.tvHfcDthIptv)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Otros (Memos)</h4>
                    <div className="space-y-2">{renderCheckboxes(quejasCheckboxOptions.otros)}</div>
                </div>
            </div>
        </div>
    );
};


// --- MEMOS DE WF ---
const memoWFTemplates: { [key: string]: { id: string; label: string; type: 'text' | 'textarea' }[] } = {
    'migracion gpon': [
        { id: 'wf-tipo-reporte', label: 'Tipo de reporte:', type: 'text' },
        { id: 'wf-acepta-migracion', label: 'Acepta migración:', type: 'text' },
        { id: 'wf-numero-contacto', label: 'Número de contacto:', type: 'text' },
        { id: 'wf-correo-electronico', label: 'Correo electrónico:', type: 'text' },
    ],
    'inconvenientes con vpn': [
        { id: 'wf-tipo-vpn', label: 'Tipo de VPN:', type: 'text' },
        { id: 'wf-direccion-ip', label: 'Dirección IP:', type: 'text' },
        { id: 'wf-problema-reportado', label: 'Problema reportado:', type: 'textarea' },
    ],
};

const MemosWFTab = () => {
    const [selectedMemo, setSelectedMemo] = useState('');
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const { toast } = useToast();

    const handleMemoChange = (value: string) => {
        setSelectedMemo(value);
        setFormData({}); // Reset form on new selection
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleClear = () => {
        setSelectedMemo('');
        setFormData({});
        toast({ 
            title: "Memo de WF Limpio",
            description: "Se han restablecido todos los campos."
        });
    };

    const handleCopy = () => {
        if (!selectedMemo) {
            toast({
                title: "Error",
                description: "Por favor, seleccione un tipo de memo de WF primero.",
                variant: "destructive",
            });
            return;
        }

        let memoContent = `MEMO DE WF: ${selectedMemo.toUpperCase()}\n\n`;
        const templateFields = memoWFTemplates[selectedMemo];

        if (templateFields) {
            templateFields.forEach(field => {
                memoContent += `${field.label} ${formData[field.id] || ''}\n`;
            });
        }

        navigator.clipboard.writeText(memoContent.trim().replace(/\n\s*\n/g, '\n')).then(() => {
            toast({ 
                title: "Memo de WF Copiado",
                description: "El memo ha sido copiado al portapapeles."
            });
        }).catch(err => {
            console.error('Error al copiar: ', err);
            toast({ title: "Error al Copiar", variant: "destructive" });
        });
    };

    const renderDynamicFields = () => {
        if (!selectedMemo) return <p className="text-muted-foreground text-center col-span-1 md:col-span-2 py-8">Seleccione un tipo de memo para ver el formulario.</p>;
        
        const fields = memoWFTemplates[selectedMemo];

        return fields.map(field => (
            <div className="space-y-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                    <Textarea id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                ) : (
                    <Input id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                )}
            </div>
        ));
    };

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                    <Label>Tipo de Memo de WF:</Label>
                    <Select onValueChange={handleMemoChange} value={selectedMemo}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione una plantilla..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="migracion gpon">Migración GPON</SelectItem>
                            <SelectItem value="inconvenientes con vpn">Inconvenientes con VPN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderDynamicFields()}
                </div>

                {selectedMemo && (
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleCopy}><Copy className="mr-2 h-4 w-4" />Copiar Memo WF</Button>
                        <Button variant="destructive" onClick={handleClear}><Trash2 className="mr-2 h-4 w-4" />Limpiar Memo WF</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MEMOS DE ORDEN ---
const memoOrdenTemplates: { [key: string]: { id: string; label: string; type: 'text' | 'textarea' }[] } = {
    'cableado ethernet': [
        { id: 'orden-metros-cable', label: 'Metros de cable requeridos:', type: 'text' },
        { id: 'orden-tipo-cable', label: 'Tipo de cable:', type: 'text' },
        { id: 'orden-observaciones', label: 'Observaciones:', type: 'textarea' },
    ],
    'orden de repetidores': [
        { id: 'orden-cantidad-repetidores', label: 'Cantidad de repetidores:', type: 'text' },
        { id: 'orden-modelo-repetidor', label: 'Modelo de repetidor:', type: 'text' },
        { id: 'orden-ubicacion', label: 'Ubicación:', type: 'textarea' },
    ],
};

const MemosOrdenTab = () => {
    const [selectedMemo, setSelectedMemo] = useState('');
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const { toast } = useToast();

    const handleMemoChange = (value: string) => {
        setSelectedMemo(value);
        setFormData({}); // Reset form on new selection
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleClear = () => {
        setSelectedMemo('');
        setFormData({});
        toast({ 
            title: "Memo de Orden Limpio",
            description: "Se han restablecido todos los campos."
        });
    };

    const handleCopy = () => {
        if (!selectedMemo) {
            toast({
                title: "Error",
                description: "Por favor, seleccione un tipo de memo de Orden primero.",
                variant: "destructive",
            });
            return;
        }

        let memoContent = `MEMO DE ORDEN: ${selectedMemo.toUpperCase()}\n\n`;
        const templateFields = memoOrdenTemplates[selectedMemo];

        if (templateFields) {
            templateFields.forEach(field => {
                memoContent += `${field.label} ${formData[field.id] || ''}\n`;
            });
        }

        navigator.clipboard.writeText(memoContent.trim().replace(/\n\s*\n/g, '\n')).then(() => {
            toast({ 
                title: "Memo de Orden Copiado",
                description: "El memo ha sido copiado al portapapeles."
            });
        }).catch(err => {
            console.error('Error al copiar: ', err);
            toast({ title: "Error al Copiar", variant: "destructive" });
        });
    };

    const renderDynamicFields = () => {
        if (!selectedMemo) return <p className="text-muted-foreground text-center col-span-1 md:col-span-2 py-8">Seleccione un tipo de memo para ver el formulario.</p>;
        
        const fields = memoOrdenTemplates[selectedMemo];

        return fields.map(field => (
            <div className="space-y-2" key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'textarea' ? (
                    <Textarea id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                ) : (
                    <Input id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder="..." />
                )}
            </div>
        ));
    };

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                    <Label>Tipo de Memo de Orden:</Label>
                    <Select onValueChange={handleMemoChange} value={selectedMemo}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione una plantilla..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cableado ethernet">Cableado Ethernet</SelectItem>
                            <SelectItem value="orden de repetidores">Orden de Repetidores</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderDynamicFields()}
                </div>

                {selectedMemo && (
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleCopy}><Copy className="mr-2 h-4 w-4" />Copiar Memo de Orden</Button>
                        <Button variant="destructive" onClick={handleClear}><Trash2 className="mr-2 h-4 w-4" />Limpiar Memo de Orden</Button>
                    </div>
                )}
            </div>
        </div>
    );
};


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
