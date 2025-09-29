
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
import { TramiteEntity } from "@/lib/repositories/tramite.repository";


export default function TramitesListPage() {
  const { toast } = useToast();
  const [tramites, setTramites] = React.useState<TramiteEntity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const loadTramites = async (search?: string) => {
    try {
      setLoading(true);
      const searchParam = search !== undefined ? search : searchTerm;
      const url = searchParam && searchParam.trim()
        ? `/api/tramites?includeInactive=true&search=${encodeURIComponent(searchParam)}`
        : '/api/tramites?includeInactive=true';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar trámites');
      }
      const data = await response.json();
      setTramites(data);
    } catch (error) {
      console.error("Error cargando trámites:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los trámites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    loadTramites();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      await loadTramites(searchTerm.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setIsSearching(true);
    await loadTramites("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (tramiteId: string) => {
    try {
      const tramite = tramites.find((t) => t.id === tramiteId);
      if (!tramite) return;

      const response = await fetch(`/api/tramites?id=${tramiteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar trámite');
      }

      setTramites(tramites.filter((t) => t.id !== tramiteId));
      toast({
        title: "Trámite Eliminado",
        description: `El trámite "${tramite.tipo}" ha sido eliminado exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando trámite:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el trámite.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Trámites</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar los trámites registrados en el sistema.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar trámites..."
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
                  <Link href="/dashboard/mantenimiento/tramites">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Crear Nuevo
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
              <p className="text-muted-foreground">Cargando trámites...</p>
            </div>
          </div>
        ) : tramites.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? `No se encontraron trámites que coincidan con "${searchTerm}".`
                  : "No hay trámites registrados."
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
                  Se encontraron <span className="font-semibold">{tramites.length}</span> trámite(s)
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
                <TableHead>Número</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Tipo de Trámite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Personal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tramites.map((tramite) => (
                <TableRow key={tramite.id} className="hover:bg-muted/40">
                  <TableCell className="font-mono">{tramite.numero}</TableCell>
                  <TableCell className="font-medium min-w-[300px]">
                    <Link href={`/dashboard/mantenimiento/tramites/${tramite.id}`} className="hover:underline text-primary">
                      {tramite.solicitante}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={tramite.tipo}>
                    {tramite.tipo}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tramite.estado === "COMPLETADO" ? "default" :
                        tramite.estado === "EN_PROCESO" ? "secondary" :
                        tramite.estado === "CANCELADO" ? "destructive" : "outline"
                      }
                      className={cn(
                        tramite.estado === "COMPLETADO" && "bg-green-600 hover:bg-green-700",
                        tramite.estado === "EN_PROCESO" && "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      {tramite.estado.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {new Date(tramite.fechaCreacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs">{tramite.personal || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/mantenimiento/tramites?id=${tramite.id}`}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el trámite <span className="font-semibold">{tramite.numero}</span> de <span className="font-semibold">{tramite.solicitante}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(tramite.id)}
                          >
                            Sí, eliminar trámite
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
