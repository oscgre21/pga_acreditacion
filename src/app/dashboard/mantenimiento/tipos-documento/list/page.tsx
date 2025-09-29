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
import { ArrowLeft, PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
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
import { tipoDocumentoService } from "@/lib/services/tipoDocumento.service";
import { TipoDocumentoEntity } from "@/lib/repositories/tipoDocumento.repository";

export default function TiposDocumentoListPage() {
  const { toast } = useToast();
  const [tiposDocumento, setTiposDocumento] = React.useState<TipoDocumentoEntity[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadTiposDocumento = async () => {
    try {
      setLoading(true);
      const data = await tipoDocumentoService.getAllTiposDocumento(true); // Incluir inactivos
      setTiposDocumento(data);
    } catch (error) {
      console.error("Error cargando tipos de documento:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tipos de documento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTiposDocumento();
  }, []);

  const handleDelete = async (tipoDocumentoId: string) => {
    try {
      const tipoDocumentoName = tiposDocumento.find((t) => t.id === tipoDocumentoId)?.nombre || '';
      await tipoDocumentoService.deleteTipoDocumento(tipoDocumentoId);
      setTiposDocumento(tiposDocumento.filter((t) => t.id !== tipoDocumentoId));
      toast({
        title: "Tipo de Documento Eliminado",
        description: `El tipo de documento "${tipoDocumentoName}" ha sido eliminado exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando tipo de documento:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el tipo de documento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Tipos de Documento</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar los tipos de documento del sistema.
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
                <Link href="/dashboard/mantenimiento/tipos-documento">
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
              <p className="text-muted-foreground">Cargando tipos de documento...</p>
            </div>
          </div>
        ) : tiposDocumento.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">No hay tipos de documento registrados.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Obligatorio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiposDocumento.map((tipoDocumento) => (
                  <TableRow key={tipoDocumento.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[250px]">{tipoDocumento.nombre}</TableCell>
                    <TableCell className="min-w-[300px] text-muted-foreground">
                      {tipoDocumento.descripcion || 'Sin descripción'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {tipoDocumento.obligatorio ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className={tipoDocumento.obligatorio ? "text-green-600" : "text-gray-500"}>
                          {tipoDocumento.obligatorio ? "Sí" : "No"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={tipoDocumento.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(tipoDocumento.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {tipoDocumento.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/mantenimiento/tipos-documento?id=${tipoDocumento.id}`}>
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de documento <span className="font-semibold">{tipoDocumento.nombre}</span> de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(tipoDocumento.id)}
                            >
                              Sí, eliminar tipo de documento
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