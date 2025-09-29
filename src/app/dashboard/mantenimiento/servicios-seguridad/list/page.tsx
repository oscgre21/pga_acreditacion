
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
import { equipoSeguridadService } from "@/lib/services/equipoSeguridad.service";
import { EquipoSeguridadEntity } from "@/lib/repositories/equipoSeguridad.repository";

export default function ServiciosSeguridadListPage() {
  const { toast } = useToast();
  const [services, setServices] = React.useState<EquipoSeguridadEntity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await equipoSeguridadService.getAllEquiposSeguridad(true); // Incluir inactivos
      setServices(data);
    } catch (error) {
      console.error("Error cargando servicios de seguridad:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los servicios de seguridad.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (serviceId: string) => {
    try {
      const serviceName = services.find((s) => s.id === serviceId)?.nombre || '';
      await equipoSeguridadService.deleteEquipoSeguridad(serviceId);
      setServices(services.filter((s) => s.id !== serviceId));
      toast({
        title: "Servicio Eliminado",
        description: `El servicio "${serviceName}" ha sido eliminado exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando servicio de seguridad:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el servicio de seguridad.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Servicios de Seguridad</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar los servicios de seguridad ofrecidos.
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
                <Link href="/dashboard/mantenimiento/servicios-seguridad">
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
              <p className="text-muted-foreground">Cargando servicios de seguridad...</p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No hay servicios de seguridad registrados.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Servicio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[300px]">{service.nombre}</TableCell>
                    <TableCell className="min-w-[400px] text-muted-foreground">{service.descripcion || 'Sin descripción'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={service.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(service.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {service.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/mantenimiento/servicios-seguridad?id=${service.id}`}>
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio <span className="font-semibold">{service.nombre}</span> de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(service.id)}
                            >
                              Sí, eliminar servicio
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
