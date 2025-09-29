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
import { Save, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const applications = [
  { id: "acreditaciones", label: "Gestión de Acreditaciones" },
  { id: "consultas", label: "Consulta de Miembros" },
  { id: "soporte", label: "Soporte" },
  { id: "gestion-usuarios", label: "Gestión de Usuarios" },
];

const roles = [
  { id: "admin", label: "Administrador" },
  { id: "validador", label: "Validador" },
  { id: "lector", label: "Lector" },
];

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Configuración Guardada",
        description: "Tus cambios han sido guardados exitosamente.",
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <UserCog className="h-6 w-6 text-primary" />
            Configuración del Perfil
          </SheetTitle>
          <SheetDescription>
            Ajusta los permisos y la configuración de tu cuenta.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* App Permissions */}
            <div className="space-y-4">
                <Label className="font-semibold text-base">Aplicaciones Permitidas</Label>
                <div className="space-y-3 rounded-lg border p-4">
                    {applications.map((app) => (
                        <div key={app.id} className="flex items-center space-x-3">
                            <Checkbox id={app.id} defaultChecked={app.id !== 'soporte'} />
                            <Label htmlFor={app.id} className="font-normal cursor-pointer">
                                {app.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role and Dates */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="user-role" className="font-semibold">Tipo de Permiso (Rol)</Label>
                    <Select defaultValue="admin">
                        <SelectTrigger id="user-role">
                            <SelectValue placeholder="Seleccionar un rol" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="last-login">Fecha de Último Acceso</Label>
                    <Input id="last-login" readOnly defaultValue="2024-07-31 10:30 AM" />
                </div>
                
                 <div className="space-y-2">
                    <Label htmlFor="registration-date">Fecha de Registro</Label>
                    <Input id="registration-date" readOnly defaultValue="2023-01-15 09:00 AM" />
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
