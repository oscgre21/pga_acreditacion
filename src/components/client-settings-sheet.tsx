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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, LayoutDashboard, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./theme-toggle";
import { useClientPortal } from "@/contexts/client-portal-context";

interface ClientSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dashboardCards = [
    { id: "tramites-proceso" as const, label: "Trámites en Proceso" },
    { id: "tramites-completados" as const, label: "Trámites Completados" },
    { id: "documentos-pendientes" as const, label: "Documentos Pendientes" },
    { id: "notificaciones" as const, label: "Notificaciones" },
    { id: "personal-activo" as const, label: "Personal Activo" },
    { id: "vencimientos-proximos" as const, label: "Vencimientos Próximos" },
];

export function ClientSettingsSheet({ open, onOpenChange }: ClientSettingsSheetProps) {
  const { toast } = useToast();
  const { visibleCards, toggleCardVisibility } = useClientPortal();

  const handleSaveChanges = () => {
    toast({
        title: "Configuración Guardada",
        description: "Tus preferencias han sido guardadas.",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-3 text-xl">
            Configuración del Portal
          </SheetTitle>
          <SheetDescription>
            Personaliza tu experiencia en el portal del cliente.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Dashboard Customization */}
            <div className="space-y-4">
                <h3 className="font-semibold text-base flex items-center gap-2"><LayoutDashboard className="h-4 w-4" />Personalización del Dashboard</h3>
                <div className="space-y-3 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Selecciona qué tarjetas de resumen quieres ver en la pantalla de inicio.</p>
                    {dashboardCards.map((card) => (
                        <div key={card.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`card-${card.id}`}
                                checked={visibleCards[card.id]}
                                onCheckedChange={() => toggleCardVisibility(card.id)}
                             />
                            <Label htmlFor={`card-${card.id}`} className="font-normal cursor-pointer">
                                {card.label}
                            </Label>
                        </div>
                    ))}
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
