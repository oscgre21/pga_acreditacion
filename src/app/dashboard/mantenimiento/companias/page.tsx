
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
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";


const companyFormSchema = z.object({
  abreviatura: z.string().min(1, "La abreviatura es requerida."),
  nombre: z.string().min(1, "El nombre es requerido."),
  rnc: z.string().min(1, "El RNC es requerido."),
  representante: z.string().min(1, "El representante es requerido."),
  telefono: z.string().min(1, "El teléfono es requerido."),
  isWhatsapp: z.boolean().default(false).optional(),
  whatsapp: z.string().optional(),
  correo: z.string().email("Correo electrónico inválido."),
  direccion: z.string().min(1, "La dirección es requerida."),
  logo: z.any().optional(),
  notas: z.string().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

function CompanyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const companyId = searchParams.get("id");

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      abreviatura: "",
      nombre: "",
      rnc: "",
      representante: "",
      telefono: "",
      isWhatsapp: false,
      whatsapp: "",
      correo: "",
      direccion: "",
      notas: "",
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (companyId) {
      const loadCompany = async () => {
        try {
          const response = await fetch(`/api/companias/${companyId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch company');
          }
          const company = await response.json();
          if (company) {
            form.reset({
              abreviatura: company.abreviatura,
              nombre: company.nombre,
              rnc: company.rnc,
              representante: company.representante,
              telefono: company.telefono,
              isWhatsapp: company.isWhatsapp,
              whatsapp: company.whatsapp || "",
              correo: company.correo,
              direccion: company.direccion,
              notas: company.notas || "",
              estado: company.estado,
            });
          }
        } catch (error) {
          console.error("Error cargando compañía:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la compañía.",
            variant: "destructive",
          });
        }
      };
      loadCompany();
    }
  }, [companyId, form, toast]);

  const isWhatsapp = form.watch("isWhatsapp");

  async function onSubmit(data: CompanyFormValues) {
    try {
      if (companyId) {
        const response = await fetch(`/api/companias/${companyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to update company');
        }
        toast({
          title: "Compañía Actualizada",
          description: `Los datos de la compañía "${data.nombre}" se han actualizado exitosamente.`,
        });
      } else {
        const response = await fetch('/api/companias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            isWhatsapp: data.isWhatsapp || false
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create company');
        }
        toast({
          title: "Compañía Creada",
          description: `La compañía "${data.nombre}" se ha creado exitosamente.`,
        });
      }
      router.push("/dashboard/mantenimiento/companias/list");
    } catch (error) {
      console.error("Error guardando compañía:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la compañía.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle>{companyId ? "Editar Compañía" : "Registro de Empresa"}</CardTitle>
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/80">
            <Link href="/dashboard/mantenimiento/companias/list">
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
                name="abreviatura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abreviatura</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rnc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RNC</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="representante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Representante</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1-809-123-4567" />
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
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isWhatsapp"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="isWhatsapp"
                        />
                      </FormControl>
                      <Label htmlFor="isWhatsapp" className="font-normal cursor-pointer">Este número es WhatsApp</Label>
                    </FormItem>
                )}
              />

              {isWhatsapp ? (
                 <div className="hidden md:block" /> 
              ) : (
                 <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1-809-123-4567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto: Logo</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
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
              {companyId ? "Guardar Cambios" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


export default function CompaniasFormPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full items-center justify-center">Cargando formulario...</div>}>
      <CompanyForm />
    </Suspense>
  )
}
