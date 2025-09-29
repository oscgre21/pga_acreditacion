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
import { Checkbox } from "@/components/ui/checkbox";
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
  CardDescription
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { tipoDocumentoService } from "@/lib/services/tipoDocumento.service";

const tipoDocumentoFormSchema = z.object({
  nombre: z.string().min(1, "El nombre del tipo de documento es requerido."),
  descripcion: z.string().optional(),
  obligatorio: z.boolean().default(true),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type TipoDocumentoFormValues = z.infer<typeof tipoDocumentoFormSchema>;

function TipoDocumentoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const tipoDocumentoId = searchParams.get("id");

  const form = useForm<TipoDocumentoFormValues>({
    resolver: zodResolver(tipoDocumentoFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      obligatorio: true,
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (tipoDocumentoId) {
      const loadTipoDocumento = async () => {
        try {
          const tipoDocumento = await tipoDocumentoService.getTipoDocumentoById(tipoDocumentoId);
          if (tipoDocumento) {
            form.reset({
              nombre: tipoDocumento.nombre,
              descripcion: tipoDocumento.descripcion || "",
              obligatorio: tipoDocumento.obligatorio,
              estado: tipoDocumento.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando tipo de documento:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del tipo de documento.",
            variant: "destructive",
          });
        }
      };
      loadTipoDocumento();
    }
  }, [tipoDocumentoId, form, toast]);

  async function onSubmit(data: TipoDocumentoFormValues) {
    try {
      if (tipoDocumentoId) {
        await tipoDocumentoService.updateTipoDocumento(tipoDocumentoId, data);
        toast({
          title: "Tipo de Documento Actualizado",
          description: `El tipo de documento "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        await tipoDocumentoService.createTipoDocumento(data);
        toast({
          title: "Tipo de Documento Creado",
          description: `El tipo de documento "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/tipos-documento/list");
    } catch (error) {
      console.error("Error guardando tipo de documento:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el tipo de documento.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{tipoDocumentoId ? "Editar Tipo de Documento" : "Registro de Tipo de Documento"}</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              Complete la información para registrar un nuevo tipo de documento.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/tipos-documento/list">
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
                      <FormLabel>Nombre del Tipo de Documento</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: Cédula de Identidad" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} placeholder="Describa el tipo de documento..." />
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Documento Obligatorio
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Marque si este tipo de documento es obligatorio en los trámites.
                      </p>
                    </div>
                    <FormMessage />
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
              {tipoDocumentoId ? "Guardar Cambios" : "Guardar Tipo de Documento"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function TiposDocumentoFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <TipoDocumentoForm />
    </Suspense>
  )
}