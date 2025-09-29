
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
import { personaEspecificaService } from "@/lib/services/personaEspecifica.service";
import { PersonaEspecificaEntity } from "@/lib/repositories/personaEspecifica.repository";

export default function PersonaEspecificaListPage() {
  const { toast } = useToast();
  const [personas, setPersonas] = React.useState<PersonaEspecificaEntity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const data = await personaEspecificaService.getAllPersonasEspecificas(true); // Incluir inactivos
      setPersonas(data);
    } catch (error) {
      console.error("Error cargando personas específicas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las personas específicas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPersonas();
  }, []);

  const handleDelete = async (personaId: string) => {
    try {
      const persona = personas.find((p) => p.id === personaId);
      if (!persona) return;

      await personaEspecificaService.deletePersonaEspecifica(personaId);
      setPersonas(personas.filter((p) => p.id !== personaId));
      toast({
        title: "Persona Específica Eliminada",
        description: `La persona "${persona.nombre} ${persona.apellido}" ha sido eliminada exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando persona específica:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la persona específica.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Personas Específicas</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar las personas específicas del sistema.
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
                <Link href="/dashboard/mantenimiento/persona-especifica">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear Nueva
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
              <p className="text-muted-foreground">Cargando personas específicas...</p>
            </div>
          </div>
        ) : personas.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No hay personas específicas registradas.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Función</TableHead>
                  <TableHead>Compañía</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personas.map((persona) => (
                  <TableRow key={persona.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[200px]">
                      {persona.nombre} {persona.apellido}
                    </TableCell>
                    <TableCell className="min-w-[150px]">{persona.cedula}</TableCell>
                    <TableCell className="min-w-[200px]">{persona.funcion}</TableCell>
                    <TableCell className="min-w-[180px]">
                      {persona.compania?.nombre || 'Sin compañía'}
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="text-sm">
                        {persona.telefono && (
                          <div className="text-muted-foreground">Tel: {persona.telefono}</div>
                        )}
                        {persona.correo && (
                          <div className="text-muted-foreground">{persona.correo}</div>
                        )}
                        {!persona.telefono && !persona.correo && (
                          <div className="text-muted-foreground">Sin contacto</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={persona.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(persona.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {persona.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/mantenimiento/persona-especifica?id=${persona.id}`}>
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la persona específica <span className="font-semibold">{persona.nombre} {persona.apellido}</span> de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(persona.id)}
                            >
                              Sí, eliminar persona
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
