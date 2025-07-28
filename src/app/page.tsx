import { ClaroForm } from '@/components/claro-form';
import { GenericTemplateForm } from '@/components/generic-template-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Signal } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Tabs defaultValue="claro" className="w-full max-w-4xl">
        <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-2 max-w-lg">
                <TabsTrigger value="claro">Generador Claro</TabsTrigger>
                <TabsTrigger value="generic">Plantillas Genéricas</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="claro">
            <ClaroForm />
        </TabsContent>
        <TabsContent value="generic">
            <GenericTemplateForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}
