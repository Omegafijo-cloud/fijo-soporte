"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, ClipboardCheck, FileText } from "lucide-react";

type FormData = {
    contactName: string;
    incidentNumber: string;
    issue: string;
    serviceType: string;
    testsPerformed: string;
    callId: string;
};

export function GenericTemplateForm() {
  const [formData, setFormData] = useState<FormData>({
    contactName: "",
    incidentNumber: "",
    issue: "",
    serviceType: "",
    testsPerformed: "",
    callId: "",
  });
  const [resultString, setResultString] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const { contactName, incidentNumber, issue, serviceType, testsPerformed, callId } = formData;
    const result = `Nombre del contacto: ${contactName}\nN° Incidencia: ${incidentNumber}\nInconveniente: ${issue}\nTipo Servicio: ${serviceType}\nPRUEBAS REALIZADAS: ${testsPerformed}\nID de llamada: ${callId}`;
    setResultString(result);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(resultString);
      setIsCopied(true);
      toast({
        title: "Copiado al portapapeles!",
        description: "La plantilla genérica está ahora en tu portapapeles.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error al copiar",
        description: "No se pudo copiar el texto al portapapeles.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 shadow-2xl border-2 border-border/60">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3">
          <FileText className="h-10 w-10 text-primary"/>
          <CardTitle className="text-4xl font-headline tracking-tight">
            Plantillas Genéricas
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-muted-foreground pt-2">
          Rellena los campos para generar una plantilla de texto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="contactName">Nombre del contacto:</Label>
                <Input id="contactName" value={formData.contactName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="incidentNumber">N° Incidencia:</Label>
                <Input id="incidentNumber" value={formData.incidentNumber} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="issue">Inconveniente:</Label>
                <Input id="issue" value={formData.issue} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo Servicio:</Label>
                <Input id="serviceType" value={formData.serviceType} onChange={handleInputChange} />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="testsPerformed">PRUEBAS REALIZADAS:</Label>
            <Textarea id="testsPerformed" value={formData.testsPerformed} onChange={handleInputChange} className="h-24"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor="callId">ID de llamada:</Label>
            <Input id="callId" value={formData.callId} onChange={handleInputChange} />
        </div>
        <div className="space-y-3">
          <Label htmlFor="result" className="text-lg font-semibold text-foreground">Resultado Formateado:</Label>
          <Textarea
            id="result"
            readOnly
            value={resultString}
            className="h-48 text-base bg-muted/50 focus-visible:ring-primary"
            aria-live="polite"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} className="w-full text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
          {isCopied ? <ClipboardCheck className="mr-2 h-6 w-6" /> : <ClipboardCopy className="mr-2 h-6 w-6" />}
          {isCopied ? "¡Copiado!" : "Copiar al Portapapeles"}
        </Button>
      </CardFooter>
    </Card>
  );
}
