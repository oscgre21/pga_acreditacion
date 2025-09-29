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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const documentacionProcesoFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional(),
  proceso: z.string().min(1, "El proceso es requerido."),
  categoria: z.string().min(1, "La categoría es requerida."),
  version: z.string().min(1, "La versión es requerida."),
  archivo: z.string().optional(),
  obligatorio: z.boolean(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type DocumentacionProcesoFormValues = z.infer<typeof documentacionProcesoFormSchema>;

function DocumentacionProcesoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const documentacionProcesoId = searchParams.get("id");

  const form = useForm<DocumentacionProcesoFormValues>({
    resolver: zodResolver(documentacionProcesoFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      proceso: "",
      categoria: "",
      version: "1.0",
      archivo: "",
      obligatorio: true,
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (documentacionProcesoId) {
      const loadDocumentacionProceso = async () => {
        try {
          const response = await fetch(`/api/documentacion-proceso/${documentacionProcesoId}`);
          if (!response.ok) {
            throw new Error('Error al cargar documentación de proceso');
          }
          const documentacionProceso = await response.json();
          if (documentacionProceso) {
            form.reset({
              nombre: documentacionProceso.nombre,
              descripcion: documentacionProceso.descripcion || "",
              proceso: documentacionProceso.proceso,
              categoria: documentacionProceso.categoria,
              version: documentacionProceso.version,
              archivo: documentacionProceso.archivo || "",
              obligatorio: documentacionProceso.obligatorio,
              estado: documentacionProceso.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando documentación de proceso:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la documentación de proceso.",
            variant: "destructive",
          });
        }
      };
      loadDocumentacionProceso();
    }
  }, [documentacionProcesoId, form, toast]);

  async function onSubmit(data: DocumentacionProcesoFormValues) {
    try {
      if (documentacionProcesoId) {
        // Actualizar documentación de proceso existente
        const response = await fetch(`/api/documentacion-proceso/${documentacionProcesoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar documentación de proceso');
        }

        toast({
          title: "Documentación de Proceso Actualizada",
          description: `La documentación "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        // Crear nueva documentación de proceso
        const response = await fetch('/api/documentacion-proceso', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear documentación de proceso');
        }

        toast({
          title: "Documentación de Proceso Creada",
          description: `La documentación "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/documentacion-proceso/list");
    } catch (error) {
      console.error("Error guardando documentación de proceso:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la documentación de proceso.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {documentacionProcesoId ? "Editar Documentación de Proceso" : "Registro de Documentación de Proceso"}
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/documentacion-proceso/list">
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
                      <FormLabel>Nombre del Documento</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ingrese el nombre del documento" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="proceso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proceso</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Proceso al que pertenece" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Categoría del documento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versión</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Versión del documento" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="archivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archivo (URL)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="URL del archivo (opcional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descripción opcional del documento"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="obligatorio"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Documento Obligatorio</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        ¿Es este documento obligatorio en el proceso?
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
              {documentacionProcesoId ? "Guardar Cambios" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function DocumentacionProcesoFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <DocumentacionProcesoForm />
    </Suspense>
  );
}