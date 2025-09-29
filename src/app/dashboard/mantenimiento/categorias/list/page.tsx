
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
import { CategoriaEntity } from "@/lib/repositories/categoria.repository";


export default function CategoriasListPage() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<CategoriaEntity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const loadCategories = async (search?: string) => {
    try {
      setLoading(true);
      const searchParam = search !== undefined ? search : searchTerm;
      const url = searchParam && searchParam.trim()
        ? `/api/categorias?includeInactive=true&search=${encodeURIComponent(searchParam)}`
        : '/api/categorias?includeInactive=true';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      await loadCategories(searchTerm.trim());
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setIsSearching(true);
    await loadCategories("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const categoryName = categories.find((c) => c.id === categoryId)?.nombre || '';
      const response = await fetch(`/api/categorias?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar categoría');
      }

      setCategories(categories.filter((c) => c.id !== categoryId));
      toast({
        title: "Categoría Eliminada",
        description: `La categoría "${categoryName}" ha sido eliminada exitosamente.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoría.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/30 dark:bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Listado de Categorías</CardTitle>
            <CardDescription>
              Aquí puede ver y gestionar las categorías de trámites registradas.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar categorías..."
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
                  <Link href="/dashboard/mantenimiento/categorias">
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
              <p className="text-muted-foreground">Cargando categorías...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? `No se encontraron categorías que coincidan con "${searchTerm}".`
                  : "No hay categorías registradas."
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
                  Se encontraron <span className="font-semibold">{categories.length}</span> categoría(s)
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
                {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium min-w-[300px]">{category.nombre}</TableCell>
                  <TableCell>
                    <Badge
                      variant={category.estado === "ACTIVO" ? "default" : "destructive"}
                      className={cn(category.estado === "ACTIVO" && "bg-green-600 hover:bg-green-700")}
                    >
                      {category.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/dashboard/mantenimiento/categorias?id=${category.id}`}>
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría <span className="font-semibold">{category.nombre}</span> de nuestros servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() => handleDelete(category.id)}
                          >
                            Sí, eliminar categoría
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
