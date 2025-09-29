"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, User, Palette, LayoutDashboard, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ThemeToggle } from "./theme-toggle";

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dashboardCards = [
    { id: "discrepancias", label: "Discrepancias" },
    { id: "en-tiempo", label: "En Tiempo" },
    { id: "atrasados", label: "Atrasados" },
    { id: "completados", label: "Completados" },
    { id: "total", label: "Total" },
];

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Perfil Actualizado",
        description: "Tus cambios han sido guardados exitosamente.",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <User className="h-6 w-6 text-primary" />
            Administración del Perfil
          </SheetTitle>
          <SheetDescription>
            Personaliza tu perfil y la apariencia de la plataforma.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><User className="h-4 w-4" />Información Personal</h3>
                <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative group">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person face" />
                                <AvatarFallback>KQ</AvatarFallback>
                            </Avatar>
                            <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-background group-hover:bg-accent">
                                <Camera className="h-4 w-4"/>
                                <span className="sr-only">Cambiar foto</span>
                            </Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario</Label>
                        <Input id="username" defaultValue="Kendy Qualey" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" readOnly defaultValue="kendy.qualey@cesac.mil.do" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" placeholder="Añadir teléfono" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea id="address" placeholder="Añadir dirección" rows={2}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input id="department" defaultValue="Diseño de Producto" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Género</Label>
                        <Select>
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Seleccionar género" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="femenino">Femenino</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                                <SelectItem value="no-especificar">Prefiero no especificar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><Palette className="h-4 w-4" />Apariencia</h3>
                <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                         <Label htmlFor="theme-toggle" className="font-normal cursor-pointer">
                            Modo Oscuro / Claro
                        </Label>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

             {/* Dashboard Customization */}
            <div className="space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Personalización del Dashboard</h3>
                <div className="space-y-3 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Selecciona qué tarjetas de resumen quieres ver en la pantalla de inicio.</p>
                    {dashboardCards.map((card) => (
                        <div key={card.id} className="flex items-center space-x-3">
                            <Checkbox id={`card-${card.id}`} defaultChecked />
                            <Label htmlFor={`card-${card.id}`} className="font-normal cursor-pointer">
                                {card.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

        </div>
        <SheetFooter className="p-6 border-t bg-muted/30">
          <Button type="button" onClick={handleSaveChanges} className="w-full">
            <Save className="mr-2 h-4 w-4"/>
            Guardar Cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
