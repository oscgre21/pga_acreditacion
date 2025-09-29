
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
import { ArrowLeft, CalendarIcon, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const locations = [
    { id: 'Sede Principal', nombre: 'Sede Principal' },
    { id: 'MDSD', nombre: 'Aeropuerto Internacional Las Américas' },
    { id: 'MDPC', nombre: 'Aeropuerto Internacional de Punta Cana' },
];

const validatorFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  rango: z.string().min(1, "El rango es requerido."),
  dependenciaId: z.string().min(1, "La dependencia es requerida."),
  sede: z.string().min(1, "La sede es requerida."),
  fechaAsignacion: z.date({ required_error: "La fecha de asignación es requerida." }),
  asignadoPor: z.string().min(1, "El asignador es requerido."),
  foto: z.any().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type ValidatorFormValues = z.infer<typeof validatorFormSchema>;

function ValidatorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const validatorId = searchParams.get("id");
  const [isMounted, setIsMounted] = React.useState(false);
  const [dependencies, setDependencies] = React.useState<Array<{id: string, nombre: string}>>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<ValidatorFormValues>({
    resolver: zodResolver(validatorFormSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      rango: "",
      dependenciaId: "",
      sede: "",
      asignadoPor: "",
      estado: "ACTIVO",
    },
  });

  // Load dependencies
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const response = await fetch('/api/dependencias?includeInactive=false');
        if (!response.ok) {
          throw new Error('Error al cargar dependencias');
        }
        const data = await response.json();
        setDependencies(data);
      } catch (error) {
        console.error("Error cargando dependencias:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las dependencias.",
          variant: "destructive",
        });
      }
    };
    loadDependencies();
  }, [toast]);

  // Load validator data if editing
  useEffect(() => {
    if (validatorId) {
      const loadValidator = async () => {
        try {
          const response = await fetch(`/api/validadores/${validatorId}`);
          if (!response.ok) {
            throw new Error('Error al cargar validador');
          }
          const validator = await response.json();
          if (validator) {
            form.reset({
              nombre: validator.nombre,
              apellido: validator.apellido,
              rango: validator.rango,
              dependenciaId: validator.dependenciaId,
              sede: validator.sede,
              fechaAsignacion: new Date(validator.fechaAsignacion),
              asignadoPor: validator.asignadoPor,
              estado: validator.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando validador:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del validador.",
            variant: "destructive",
          });
        }
      };
      loadValidator();
    }
  }, [validatorId, form, toast]);

  async function onSubmit(data: ValidatorFormValues) {
    try {
      if (validatorId) {
        // Actualizar validador existente
        const response = await fetch(`/api/validadores/${validatorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar validador');
        }

        toast({
          title: "Validador Actualizado",
          description: `El validador "${data.nombre} ${data.apellido}" se ha actualizado exitosamente.`,
        });
      } else {
        // Crear nuevo validador
        const response = await fetch('/api/validadores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear validador');
        }

        toast({
          title: "Validador Creado",
          description: `El validador "${data.nombre} ${data.apellido}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/validadores/list");
    } catch (error) {
      console.error("Error guardando validador:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el validador.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>{validatorId ? "Editar Validador" : "Registro de Validador"}</CardTitle>
                <CardDescription className="text-primary-foreground/80 mt-1">
                    {validatorId ? "Modifique la información del validador." : "Complete la información para registrar un nuevo validador."}
                </CardDescription>
            </div>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/validadores/list">
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
              <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="apellido" render={({ field }) => (<FormItem><FormLabel>Apellido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="rango" render={({ field }) => (<FormItem><FormLabel>Rango</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField
                control={form.control}
                name="dependenciaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dependencia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una dependencia" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {dependencies.map(dep => <SelectItem key={dep.id} value={String(dep.id)}>{dep.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sede"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sede</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una sede" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {locations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.nombre}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="fechaAsignacion"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Asignación</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? (format(field.value, "PPP", { locale: es })) : (<span>Seleccione una fecha</span>)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          {isMounted ? (
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                          ) : (
                            <Skeleton className="w-[280px] h-[298px]" />
                          )}
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField control={form.control} name="asignadoPor" render={({ field }) => (<FormItem><FormLabel>Asignado Por</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                 <FormField
                    control={form.control}
                    name="foto"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Foto del Validador</FormLabel>
                        <FormControl>
                        <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {validatorId ? "Guardar Cambios" : "Guardar Validador"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function ValidadoresFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <ValidatorForm />
    </Suspense>
  )
}
