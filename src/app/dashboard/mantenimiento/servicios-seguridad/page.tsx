
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
import { equipoSeguridadService } from "@/lib/services/equipoSeguridad.service";

const serviceFormSchema = z.object({
  nombre: z.string().min(1, "El nombre del servicio es requerido."),
  descripcion: z.string().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

function ServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const serviceId = searchParams.get("id");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (serviceId) {
      const loadService = async () => {
        try {
          const service = await equipoSeguridadService.getEquipoSeguridadById(serviceId);
          if (service) {
            form.reset({
              nombre: service.nombre,
              descripcion: service.descripcion || "",
              estado: service.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando servicio de seguridad:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del servicio de seguridad.",
            variant: "destructive",
          });
        }
      };
      loadService();
    }
  }, [serviceId, form, toast]);

  async function onSubmit(data: ServiceFormValues) {
    try {
      if (serviceId) {
        await equipoSeguridadService.updateEquipoSeguridad(serviceId, data);
        toast({
          title: "Servicio Actualizado",
          description: `El servicio "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        await equipoSeguridadService.createEquipoSeguridad(data);
        toast({
          title: "Servicio Creado",
          description: `El servicio "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/servicios-seguridad/list");
    } catch (error) {
      console.error("Error guardando servicio de seguridad:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el servicio de seguridad.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{serviceId ? "Editar Servicio de Seguridad" : "Registro de Servicio de Seguridad"}</CardTitle>
                 <CardDescription className="text-primary-foreground/80 mt-1">
                    Complete la información para registrar un nuevo servicio.
                </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
                <Link href="/dashboard/mantenimiento/servicios-seguridad/list">
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
                      <FormLabel>Nombre del Servicio</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ej: Seguridad de la aeronave" />
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
                        <Textarea rows={4} {...field} placeholder="Describa brevemente el servicio..." />
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
              {serviceId ? "Guardar Cambios" : "Guardar Servicio"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function ServiciosSeguridadFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <ServiceForm />
    </Suspense>
  )
}
