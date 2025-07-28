'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, LogOut, FileText, Wrench, ArrowRightLeft, Megaphone, Save } from 'lucide-react';
import { PlantillasTab } from '@/components/plantillas-tab';
import { HerramientasTab } from '@/components/herramientas-tab';

// Placeholder components for each tab content
const TransferenciasTab = () => <div id="transferencias" className="tab-content">Contenido de Transferencias</div>;
const AvisosTab = () => <div id="avisos" className="tab-content">Contenido de Avisos</div>;
const CopiaRespaldoTab = () => <div id="copia-respaldo" className="tab-content">Contenido de Copia de Respaldo</div>;

export default function OmegaPage() {
  const [activeTab, setActiveTab] = useState('plantillas');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'plantillas':
        return <PlantillasTab />;
      case 'herramientas':
        return <HerramientasTab />;
      case 'transferencias':
        return <TransferenciasTab />;
      case 'avisos':
        return <AvisosTab />;
      case 'copia-respaldo':
        return <CopiaRespaldoTab />;
      default:
        return <PlantillasTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Barra Superior Fija */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 bg-card border-b">
        <div className="flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 10.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M12 5c-1.93 0-3.5 1.57-3.5 3.5S10.07 12 12 12s3.5-1.57 3.5-3.5S13.93 5 12 5zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5S12.83 10 12 10z"/></svg>
          <h1 className="text-xl font-bold text-foreground">OMEGA-FIJO SOPORTE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" />
            <span className="font-mono text-lg">00:00</span>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </header>
      
      {/* Contenedor Principal */}
      <main className="flex flex-col flex-1 w-full pt-16">
        {/* Navegación por Pestañas */}
        <nav className="sticky top-16 z-40 flex justify-center w-full h-14 bg-card border-b">
          <div className="flex items-center gap-8 px-4">
            <button onClick={() => setActiveTab('plantillas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'plantillas' ? 'active' : ''}`}>
              <FileText className="h-5 w-5" /> PLANTILLAS
            </button>
            <button onClick={() => setActiveTab('herramientas')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'herramientas' ? 'active' : ''}`}>
              <Wrench className="h-5 w-5" /> HERRAMIENTAS
            </button>
            <button onClick={() => setActiveTab('transferencias')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'transferencias' ? 'active' : ''}`}>
              <ArrowRightLeft className="h-5 w-5" /> TRANSFERENCIAS
            </button>
            <button onClick={() => setActiveTab('avisos')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'avisos' ? 'active' : ''}`}>
              <Megaphone className="h-5 w-5" /> AVISOS
            </button>
            <button onClick={() => setActiveTab('copia-respaldo')} className={`tab-link flex items-center gap-2 px-3 py-3 text-sm font-medium transition-colors hover:text-accent ${activeTab === 'copia-respaldo' ? 'active' : ''}`}>
              <Save className="h-5 w-5" /> COPIA DE RESPALDO
            </button>
          </div>
        </nav>
        
        {/* Contenido de la Pestaña Activa */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Card>
                <CardContent className="p-0">
                    {renderTabContent()}
                </CardContent>
            </Card>
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        Desarrollado por: Keiner Valera
      </footer>
    </div>
  );
}
