
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
  CardDescription
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const airportFormSchema = z.object({
  codigo: z.string().min(1, "El código del aeropuerto es requerido.").length(4, "El código debe tener exactamente 4 caracteres"),
  nombre: z.string().min(1, "El nombre del aeropuerto es requerido."),
  activo: z.boolean().default(true),
});

type AirportFormValues = z.infer<typeof airportFormSchema>;


function AirportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const airportId = searchParams.get("id");

  const form = useForm<AirportFormValues>({
    resolver: zodResolver(airportFormSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      activo: true,
    },
  });

  useEffect(() => {
    if (airportId) {
      const loadAirport = async () => {
        try {
          const response = await fetch(`/api/aeropuertos/${airportId}`);
          if (!response.ok) {
            throw new Error('Error al cargar aeropuerto');
          }
          const airport = await response.json();
          if (airport) {
            form.reset({
              codigo: airport.codigo,
              nombre: airport.nombre,
              activo: airport.activo,
            });
          }
        } catch (error) {
          console.error("Error cargando aeropuerto:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del aeropuerto.",
            variant: "destructive",
          });
        }
      };
      loadAirport();
    }
  }, [airportId, form, toast]);

  async function onSubmit(data: AirportFormValues) {
    try {
      if (airportId) {
        // Actualizar aeropuerto existente
        const response = await fetch(`/api/aeropuertos/${airportId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar aeropuerto');
        }

        toast({
          title: "Aeropuerto Actualizado",
          description: `El aeropuerto "${data.nombre}" se ha actualizado exitosamente.`,
        });
      } else {
        // Crear nuevo aeropuerto
        const response = await fetch('/api/aeropuertos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear aeropuerto');
        }

        toast({
          title: "Aeropuerto Creado",
          description: `El aeropuerto "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/aeropuertos/list");
    } catch (error) {
      console.error("Error guardando aeropuerto:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el aeropuerto.",
        variant: "destructive",
      });
    }
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle>{airportId ? "Editar Aeropuerto" : "Registro de Aeropuerto"}</CardTitle>
            <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
              <Link href="/dashboard/mantenimiento/aeropuertos/list">
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
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código del Aeropuerto (ICAO)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MDSD" maxLength={4} disabled={!!airportId} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Aeropuerto</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Aeropuerto Internacional Las Américas" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Estado Activo
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Indica si el aeropuerto está activo en el sistema
                          </div>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {airportId ? "Guardar Cambios" : "Guardar Aeropuerto"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default function AeropuertosFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <AirportForm />
    </Suspense>
  )
}
