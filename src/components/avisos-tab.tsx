'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AvisosTab() {
  // URLs de ejemplo. Reemplaza estas con las URLs reales de tus documentos.
  const migracionUrl = "https://docs.google.com/document/d/e/2PACX-1vQ.../pub?embedded=true";
  const seguimientoUrl = "https://docs.google.com/document/d/e/2PACX-1vR.../pub?embedded=true";

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>PROCESOS DE MIGRACIÓN (WF)</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src={migracionUrl}
            className="w-full h-[600px] border rounded-md"
            title="Procesos de Migración"
          ></iframe>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>SEGUIMIENTO DE CASOS (DOC)</CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src={seguimientoUrl}
            className="w-full h-[600px] border rounded-md"
            title="Seguimiento de Casos"
          ></iframe>
        </CardContent>
      </Card>
    </div>
  );
}
