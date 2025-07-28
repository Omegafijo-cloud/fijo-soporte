'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: string;
  title: string;
  url: string;
}

interface AvisosTabProps {
  notices: Notice[];
  setNotices: (notices: Notice[]) => void;
}

export default function AvisosTab({ notices, setNotices }: AvisosTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const getEmbedUrl = (originalUrl: string) => {
    try {
      const urlObject = new URL(originalUrl);
      if (urlObject.hostname.includes('docs.google.com') && originalUrl.includes('/pub?')) {
        // Already a published Google Doc embed link
        return originalUrl;
      }
    } catch (e) {
      // Invalid URL, proceed to treat as a standard doc link
    }
    
    // For other document URLs (PDF, DOCX, etc.), use Google Docs Viewer
    return `https://docs.google.com/gview?url=${encodeURIComponent(originalUrl)}&embedded=true`;
  };

  const handleAddNotice = () => {
    if (!title.trim() || !url.trim()) {
      toast({
        title: 'Error',
        description: 'El título y la URL no pueden estar vacíos.',
        variant: 'destructive'
      });
      return;
    }

    const newNotice: Notice = {
      id: new Date().toISOString(),
      title,
      url: getEmbedUrl(url)
    };

    setNotices([...notices, newNotice]);
    setIsDialogOpen(false);
    setTitle('');
    setUrl('');
     toast({
      title: 'Aviso Añadido',
      description: 'El nuevo aviso se ha agregado a la lista.',
    });
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
     toast({
      title: 'Aviso Eliminado',
      description: 'El aviso ha sido eliminado de la lista.',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Avisos Importantes</CardTitle>
          <CardDescription>Documentos y recursos operativos de acceso rápido.</CardDescription>
        </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Aviso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Aviso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder="Título del aviso"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input 
                placeholder="URL del documento (PDF, Word, etc.)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleAddNotice}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
         <ScrollArea className="h-[60vh]">
          <div className="space-y-6 pr-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <Card key={notice.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <iframe
                      src={notice.url}
                      className="w-full h-96 border rounded-md bg-muted"
                      title={notice.title}
                    ></iframe>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <p className="text-muted-foreground">No hay avisos para mostrar.</p>
                  <p className="text-sm text-muted-foreground">¡Añade tu primer aviso para empezar!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
