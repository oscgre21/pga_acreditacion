"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface PerfilEmpresaEntity {
  id: string;
  companiaId: string;
  tipo: string;
  descripcion?: string;
  estado: 'ACTIVO' | 'INACTIVO';
  compania?: {
    id: string;
    nombre: string;
    abreviatura: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PerfilEmpresaListPage() {
  const { toast } = useToast();
  const [profiles, setProfiles] = React.useState<PerfilEmpresaEntity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/perfil-empresa?includeInactive=true');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error cargando perfiles de empresa:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los perfiles de empresa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (profileId: string) => {
    try {
      const profile = profiles.find((p) => p.id === profileId);
      if (!profile) return;

      const response = await fetch(`/api/perfil-empresa/${profileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setProfiles(profiles.filter((p) => p.id !== profileId));
      toast({
        title: "Perfil de Empresa Eliminado",
        description: `El perfil "${profile.tipo}" ha sido eliminado exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando perfil de empresa:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el perfil de empresa.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Perfiles de Empresa</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar los perfiles de empresa del sistema.
            </CardDescription>
          </div>
          <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/dashboard/mantenimiento">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Link>
             </Button>
             <Button asChild>
                <Link href="/dashboard/mantenimiento/perfil-empresa">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nuevo
                </Link>
             </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando perfiles de empresa...</p>
            </div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No hay perfiles de empresa registrados.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Compañía</TableHead>
                  <TableHead>Tipo de Perfil</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[250px]">
                      {profile.compania?.nombre || 'Sin compañía'}
                    </TableCell>
                    <TableCell className="min-w-[200px]">{profile.tipo}</TableCell>
                    <TableCell className="min-w-[300px] text-muted-foreground">
                      {profile.descripcion || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={profile.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(profile.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {profile.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/mantenimiento/perfil-empresa?id=${profile.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el perfil de empresa <span className="font-semibold">{profile.tipo}</span> de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(profile.id)}
                            >
                              Sí, eliminar perfil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}