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
import { Textarea } from "@/components/ui/textarea";
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

const perfilEmpresaFormSchema = z.object({
  companiaId: z.string().min(1, "La compañía es requerida."),
  tipo: z.string().min(1, "El tipo de perfil es requerido."),
  descripcion: z.string().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type PerfilEmpresaFormValues = z.infer<typeof perfilEmpresaFormSchema>;

function PerfilEmpresaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const perfilId = searchParams.get("id");
  const [companies, setCompanies] = React.useState<Array<{id: string, nombre: string}>>([]);

  const form = useForm<PerfilEmpresaFormValues>({
    resolver: zodResolver(perfilEmpresaFormSchema),
    defaultValues: {
      companiaId: "",
      tipo: "",
      descripcion: "",
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

  // Load profile data if editing
  useEffect(() => {
    if (perfilId) {
      const loadProfile = async () => {
        try {
          const response = await fetch(`/api/perfil-empresa/${perfilId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          const profile = await response.json();
          if (profile) {
            form.reset({
              companiaId: profile.companiaId,
              tipo: profile.tipo,
              descripcion: profile.descripcion || "",
              estado: profile.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando perfil de empresa:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del perfil de empresa.",
            variant: "destructive",
          });
        }
      };
      loadProfile();
    }
  }, [perfilId, form, toast]);

  async function onSubmit(data: PerfilEmpresaFormValues) {
    try {
      let response;
      if (perfilId) {
        response = await fetch(`/api/perfil-empresa/${perfilId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to update perfil empresa');
        }
        toast({
          title: "Perfil de Empresa Actualizado",
          description: `El perfil "${data.tipo}" se ha actualizado exitosamente.`,
        });
      } else {
        response = await fetch('/api/perfil-empresa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to create perfil empresa');
        }
        toast({
          title: "Perfil de Empresa Creado",
          description: `El perfil "${data.tipo}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/perfil-empresa/list");
    } catch (error) {
      console.error("Error guardando perfil de empresa:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el perfil de empresa.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{perfilId ? "Editar Perfil de Empresa" : "Registro de Perfil de Empresa"}</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              Complete la información para registrar un nuevo perfil de empresa.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/perfil-empresa/list">
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
                name="companiaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compañía</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una compañía" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Perfil</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Proveedor de Servicios de Seguridad" />
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
                        <Textarea rows={4} {...field} placeholder="Describa el perfil de empresa..." />
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
              {perfilId ? "Guardar Cambios" : "Guardar Perfil"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function PerfilEmpresaFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <PerfilEmpresaForm />
    </Suspense>
  )
}