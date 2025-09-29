
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
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const dependencyFormSchema = z.object({
  nombre: z.string().min(3, "El nombre de la dependencia es requerido."),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type DependencyFormValues = z.infer<typeof dependencyFormSchema>;

function DependencyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const dependencyId = searchParams.get("id");

  const form = useForm<DependencyFormValues>({
    resolver: zodResolver(dependencyFormSchema),
    defaultValues: {
      nombre: "",
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (dependencyId) {
      const loadDependency = async () => {
        try {
          const response = await fetch(`/api/dependencias/${dependencyId}`);
          if (!response.ok) {
            throw new Error('Error al cargar dependencia');
          }
          const dependency = await response.json();
          if (dependency) {
            form.reset({
              nombre: dependency.nombre,
              estado: dependency.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando dependencia:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la dependencia.",
            variant: "destructive",
          });
        }
      };
      loadDependency();
    }
  }, [dependencyId, form, toast]);

  async function onSubmit(data: DependencyFormValues) {
    try {
      if (dependencyId) {
        // Actualizar dependencia existente
        const response = await fetch(`/api/dependencias/${dependencyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar dependencia');
        }

        toast({
          title: "Dependencia Actualizada",
          description: `La dependencia "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        // Crear nueva dependencia
        const response = await fetch('/api/dependencias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear dependencia');
        }

        toast({
          title: "Dependencia Creada",
          description: `La dependencia "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/dependencias/list");
    } catch (error) {
      console.error("Error guardando dependencia:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la dependencia.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{dependencyId ? "Editar Dependencia" : "Registro de Dependencia"}</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-1">
                    {dependencyId ? "Modifique la información de la dependencia." : "Complete la información para registrar una nueva dependencia."}
                </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
                <Link href="/dashboard/mantenimiento/dependencias/list">
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
                      <FormLabel>Nombre de la Dependencia</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: DIRECCIÓN DE TECNOLOGÍA" />
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
              {dependencyId ? "Guardar Cambios" : "Guardar Dependencia"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function DependenciasFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <DependencyForm />
    </Suspense>
  )
}
