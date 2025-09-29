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

const specificPersonFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  cedula: z.string().min(11, "La cédula es requerida y debe tener al menos 11 caracteres."),
  companiaId: z.string().optional().or(z.literal("")),
  funcion: z.string().min(1, "La función es requerida."),
  telefono: z.string().optional(),
  correo: z.string().email("Correo inválido.").optional().or(z.literal("")),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type SpecificPersonFormValues = z.infer<typeof specificPersonFormSchema>;

function SpecificPersonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const personId = searchParams.get("id");
  const [companies, setCompanies] = React.useState<Array<{id: string, nombre: string}>>([]);

  const form = useForm<SpecificPersonFormValues>({
    resolver: zodResolver(specificPersonFormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      cedula: "",
      companiaId: "",
      funcion: "",
      telefono: "",
      correo: "",
      estado: "ACTIVO",
    },
  });

  // Load companies
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/api/companias?includeInactive=false');
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error cargando compañías:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las compañías.",
          variant: "destructive",
        });
      }
    };
    loadCompanies();
  }, [toast]);

  // Load person data if editing
  useEffect(() => {
    if (personId) {
      const loadPerson = async () => {
        try {
          const response = await fetch(`/api/persona-especifica/${personId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch person');
          }
          const person = await response.json();
          if (person) {
            form.reset({
              nombre: person.nombre,
              apellido: person.apellido,
              cedula: person.cedula,
              companiaId: person.companiaId || "",
              funcion: person.funcion,
              telefono: person.telefono || "",
              correo: person.correo || "",
              estado: person.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando persona específica:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la persona específica.",
            variant: "destructive",
          });
        }
      };
      loadPerson();
    }
  }, [personId, form, toast]);

  async function onSubmit(data: SpecificPersonFormValues) {
    try {
      // Clean empty string values
      const cleanData = {
        ...data,
        companiaId: data.companiaId || undefined,
        telefono: data.telefono || undefined,
        correo: data.correo || undefined,
      };

      let response;
      if (personId) {
        response = await fetch(`/api/persona-especifica/${personId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanData),
        });
        if (!response.ok) {
          throw new Error('Failed to update persona especifica');
        }
        toast({
          title: "Persona Específica Actualizada",
          description: `La persona "${data.nombre} ${data.apellido}" se ha actualizado exitosamente.`,
        });
      } else {
        response = await fetch('/api/persona-especifica', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanData),
        });
        if (!response.ok) {
          throw new Error('Failed to create persona especifica');
        }
        toast({
          title: "Persona Específica Creada",
          description: `La persona "${data.nombre} ${data.apellido}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/persona-especifica/list");
    } catch (error) {
      console.error("Error guardando persona específica:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la persona específica.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{personId ? "Editar Persona Específica" : "Registro de Persona Específica"}</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              Complete la información para registrar una nueva persona específica.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/persona-especifica/list">
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
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Juan" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Pérez" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cedula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: 001-1234567-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companiaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compañía (Opcional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una compañía" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Sin compañía</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Función</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Instructor AVSEC" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: 809-123-4567" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Ej: juan@example.com" />
                    </FormControl>
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
              {personId ? "Guardar Cambios" : "Guardar Persona"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function PersonaEspecificaFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <SpecificPersonForm />
    </Suspense>
  )
}