
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
import { Input } from "@/components/ui/input";
import { ArrowLeft, PlusCircle, Pencil, Trash2, Search, X } from "lucide-react";
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
import { DependenciaEntity } from "@/lib/repositories/dependencia.repository";

export default function DependenciasListPage() {
  const { toast } = useToast();
  const [dependencies, setDependencies] = React.useState<DependenciaEntity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const loadDependencies = async (search?: string) => {
    try {
      setLoading(true);
      const searchParam = search !== undefined ? search : searchTerm;
      const url = searchParam && searchParam.trim()
        ? `/api/dependencias?includeInactive=true&search=${encodeURIComponent(searchParam)}`
        : '/api/dependencias?includeInactive=true';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar dependencias');
      }
      const data = await response.json();
      setDependencies(data);
    } catch (error) {
      console.error("Error cargando dependencias:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las dependencias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    loadDependencies();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      await loadDependencies(searchTerm.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setIsSearching(true);
    await loadDependencies("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (dependencyId: string) => {
    try {
      const dependencyName = dependencies.find((d) => d.id === dependencyId)?.nombre || '';
      const response = await fetch(`/api/dependencias?id=${dependencyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar dependencia');
      }

      setDependencies(dependencies.filter((d) => d.id !== dependencyId));
      toast({
        title: "Dependencia Eliminada",
        description: `La dependencia "${dependencyName}" ha sido eliminada exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando dependencia:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la dependencia.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Dependencias</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar las dependencias de trámites registradas.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar dependencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleClearSearch}
                      disabled={isSearching}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleSearch}
                    disabled={!searchTerm.trim() || isSearching}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button asChild variant="outline">
                  <Link href="/dashboard/mantenimiento">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver
                  </Link>
               </Button>
               <Button asChild>
                  <Link href="/dashboard/mantenimiento/dependencias">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Nueva
                  </Link>
               </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando dependencias...</p>
            </div>
          </div>
        ) : dependencies.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? `No se encontraron dependencias que coincidan con "${searchTerm}".`
                  : "No hay dependencias registradas."
                }
              </p>
              {searchTerm.trim() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleClearSearch}
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {searchTerm.trim() && (
              <div className="px-6 py-3 border-b bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Se encontraron <span className="font-semibold">{dependencies.length}</span> dependencia(s)
                  que coinciden con "<span className="font-semibold">{searchTerm}</span>"
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2 p-0 h-auto"
                    onClick={handleClearSearch}
                  >
                    (limpiar búsqueda)
                  </Button>
                </p>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dependencies.map((dependency) => (
                  <TableRow key={dependency.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[300px]">{dependency.nombre}</TableCell>
                    <TableCell>
                      <Badge
                        variant={dependency.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(dependency.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {dependency.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(dependency.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/dashboard/mantenimiento/dependencias?id=${dependency.id}`}>
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente la dependencia <span className="font-semibold">{dependency.nombre}</span> de nuestros servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(dependency.id)}
                            >
                              Sí, eliminar dependencia
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
