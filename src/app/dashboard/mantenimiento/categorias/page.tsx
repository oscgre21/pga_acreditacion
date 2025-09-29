
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const categoryFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

function CategoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const categoryId = searchParams.get("id");

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nombre: "",
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (categoryId) {
      const loadCategory = async () => {
        try {
          const response = await fetch(`/api/categorias/${categoryId}`);
          if (!response.ok) {
            throw new Error('Error al cargar categoría');
          }
          const category = await response.json();
          if (category) {
            form.reset({
              nombre: category.nombre,
              estado: category.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando categoría:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la categoría.",
            variant: "destructive",
          });
        }
      };
      loadCategory();
    }
  }, [categoryId, form, toast]);

  async function onSubmit(data: CategoryFormValues) {
    try {
      if (categoryId) {
        // Actualizar categoría existente
        const response = await fetch(`/api/categorias/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar categoría');
        }

        toast({
          title: "Categoría Actualizada",
          description: `La categoría "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        // Crear nueva categoría
        const response = await fetch('/api/categorias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear categoría');
        }

        toast({
          title: "Categoría Creada",
          description: `La categoría "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/categorias/list");
    } catch (error) {
      console.error("Error guardando categoría:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la categoría.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle>{categoryId ? "Editar Categoría" : "Registro de Categoría"}</CardTitle>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/categorias/list">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Listado
            </Link>
          </Button>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 bg-muted/20 dark:bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre de la Categoría</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {categoryId ? "Guardar Cambios" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


export default function CategoriasFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <CategoryForm />
    </Suspense>
  )
}
