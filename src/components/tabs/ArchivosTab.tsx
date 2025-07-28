'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Trash2, FilePenLine } from 'lucide-react';

interface ArchivoItem {
  id: string;
  title: string;
  content: string;
}

interface ArchivosTabProps {
  items: ArchivoItem[];
  setItems: (items: ArchivoItem[]) => void;
}

export default function ArchivosTab({ items, setItems }: ArchivosTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchivoItem | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const openNewDialog = () => {
    setEditingItem(null);
    setTitle('');
    setContent('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ArchivoItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setContent(item.content);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    if (editingItem) {
      // Edit existing item
      setItems(items.map(item =>
        item.id === editingItem.id ? { ...item, title, content } : item
      ));
    } else {
      // Add new item
      const newItem: ArchivoItem = {
        id: new Date().toISOString(),
        title,
        content
      };
      setItems([...items, newItem]);
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Archivos y Apuntes</CardTitle>
          <CardDescription>Guarda tus notas importantes y tenlas siempre a mano.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Apunte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Apunte' : 'Nuevo Apunte'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input 
                placeholder="Título del apunte"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea 
                placeholder="Contenido del apunte..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSave}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                                    <FilePenLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-muted-foreground">No tienes apuntes guardados.</p>
                    <p className="text-sm text-muted-foreground">¡Crea tu primer apunte para empezar!</p>
                </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
