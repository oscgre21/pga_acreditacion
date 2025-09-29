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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, PlusCircle, Pencil, Trash2, Search, X, FileText, Download } from "lucide-react";
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
import { DocumentacionProcesoEntity } from "@/lib/repositories/documentacion-proceso.repository";

export default function DocumentacionProcesoListPage() {
  const { toast } = useToast();
  const [documentacionProceso, setDocumentacionProceso] = React.useState<DocumentacionProcesoEntity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [procesoFilter, setProcesoFilter] = React.useState("__ALL__");
  const [categoriaFilter, setCategoriaFilter] = React.useState("__ALL__");
  const [isSearching, setIsSearching] = React.useState(false);

  // Estados para los filtros únicos
  const [uniqueProcesos, setUniqueProcesos] = React.useState<string[]>([]);
  const [uniqueCategorias, setUniqueCategorias] = React.useState<string[]>([]);

  const loadDocumentacionProceso = async (search?: string, proceso?: string, categoria?: string) => {
    try {
      setLoading(true);
      const searchParam = search !== undefined ? search : searchTerm;
      const procesoParam = proceso !== undefined ? proceso : procesoFilter;
      const categoriaParam = categoria !== undefined ? categoria : categoriaFilter;

      let url = '/api/documentacion-proceso?includeInactive=true';

      if (searchParam && searchParam.trim()) {
        url += `&search=${encodeURIComponent(searchParam)}`;
      }
      if (procesoParam && procesoParam !== "__ALL__") {
        url += `&proceso=${encodeURIComponent(procesoParam)}`;
      }
      if (categoriaParam && categoriaParam !== "__ALL__") {
        url += `&categoria=${encodeURIComponent(categoriaParam)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar documentación de proceso');
      }
      const data = await response.json();
      setDocumentacionProceso(data);

      // Extraer procesos y categorías únicos para los filtros
      const procesos = [...new Set(data.map((doc: DocumentacionProcesoEntity) => doc.proceso))].sort() as string[];
      const categorias = [...new Set(data.map((doc: DocumentacionProcesoEntity) => doc.categoria))].sort() as string[];
      setUniqueProcesos(procesos);
      setUniqueCategorias(categorias);
    } catch (error) {
      console.error("Error cargando documentación de proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la documentación de proceso.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    loadDocumentacionProceso();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() || procesoFilter || categoriaFilter) {
      setIsSearching(true);
      await loadDocumentacionProceso(searchTerm.trim(), procesoFilter, categoriaFilter);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setProcesoFilter("__ALL__");
    setCategoriaFilter("__ALL__");
    setIsSearching(true);
    await loadDocumentacionProceso("", "", "");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = async () => {
    setIsSearching(true);
    await loadDocumentacionProceso(searchTerm, procesoFilter, categoriaFilter);
  };

  React.useEffect(() => {
    if (procesoFilter && procesoFilter !== "__ALL__" || categoriaFilter && categoriaFilter !== "__ALL__") {
      handleFilterChange();
    }
  }, [procesoFilter, categoriaFilter]);

  const handleDelete = async (documentacionProcesoId: string) => {
    try {
      const documentacionProcesoName = documentacionProceso.find((d) => d.id === documentacionProcesoId)?.nombre || '';
      const response = await fetch(`/api/documentacion-proceso?id=${documentacionProcesoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar documentación de proceso');
      }

      setDocumentacionProceso(documentacionProceso.filter((d) => d.id !== documentacionProcesoId));
      toast({
        title: "Documentación de Proceso Eliminada",
        description: `La documentación "${documentacionProcesoName}" ha sido eliminada exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando documentación de proceso:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la documentación de proceso.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (archivo: string | undefined, nombre: string) => {
    if (archivo) {
      window.open(archivo, '_blank');
    } else {
      toast({
        title: "Archivo no disponible",
        description: `No hay archivo asociado a "${nombre}".`,
        variant: "destructive",
      });
    }
  };

  const hasActiveFilters = searchTerm.trim() || (procesoFilter && procesoFilter !== "__ALL__") || (categoriaFilter && categoriaFilter !== "__ALL__");

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Listado de Documentación de Proceso
            </CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar la documentación de procesos registrada.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar documentación..."
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
                    disabled={(!searchTerm.trim() && procesoFilter === "__ALL__" && categoriaFilter === "__ALL__") || isSearching}
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
                <Link href="/dashboard/mantenimiento/documentacion-proceso">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Nueva
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select value={procesoFilter} onValueChange={setProcesoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por proceso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Todos los procesos</SelectItem>
                {uniqueProcesos.map((proceso) => (
                  <SelectItem key={proceso} value={proceso}>
                    {proceso}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">Todas las categorías</SelectItem>
                {uniqueCategorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Filtros activos
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSearch}
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando documentación de proceso...</p>
            </div>
          </div>
        ) : documentacionProceso.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? "No se encontró documentación que coincida con los filtros aplicados."
                  : "No hay documentación de proceso registrada."
                }
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleClearSearch}
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {hasActiveFilters && (
              <div className="px-6 py-3 border-b bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Se encontraron <span className="font-semibold">{documentacionProceso.length}</span> documento(s)
                  con los filtros aplicados
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2 p-0 h-auto"
                    onClick={handleClearSearch}
                  >
                    (limpiar filtros)
                  </Button>
                </p>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Proceso</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Versión</TableHead>
                  <TableHead>Obligatorio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentacionProceso.map((documento) => (
                  <TableRow key={documento.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium min-w-[300px]">
                      <div>
                        <div>{documento.nombre}</div>
                        {documento.descripcion && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {documento.descripcion}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{documento.proceso}</TableCell>
                    <TableCell>{documento.categoria}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{documento.version}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={documento.obligatorio ? "default" : "secondary"}
                        className={cn(documento.obligatorio && "bg-orange-600 hover:bg-orange-700")}
                      >
                        {documento.obligatorio ? "Obligatorio" : "Opcional"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={documento.estado === "ACTIVO" ? "default" : "destructive"}
                        className={cn(documento.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                      >
                        {documento.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(documento.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {documento.archivo && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDownload(documento.archivo, documento.nombre)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Descargar</span>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/dashboard/mantenimiento/documentacion-proceso?id=${documento.id}`}>
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
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la documentación de proceso <span className="font-semibold">{documento.nombre}</span> de nuestros servidores.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(documento.id)}
                              >
                                Sí, eliminar documentación
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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