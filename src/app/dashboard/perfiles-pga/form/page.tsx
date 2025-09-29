
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save, Paperclip } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { initialApps } from "../data";

const appFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  siglas: z.string().min(1, "Las siglas son requeridas."),
  descripcion: z.string().optional(),
  activa: z.boolean().default(true),
  clienteId: z.string().optional(),
  codigo: z.string().optional(),
  urlDestino: z.string().url({ message: "Por favor ingrese una URL válida." }).optional().or(z.literal('')),
  redireccion: z.string().url({ message: "Por favor ingrese una URL válida." }).optional().or(z.literal('')),
  logo: z.any().optional(),
});

type AppFormValues = z.infer<typeof appFormSchema>;

function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const appId = searchParams.get("id");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      nombre: "",
      siglas: "",
      descripcion: "",
      activa: true,
      clienteId: "",
      codigo: "",
      urlDestino: "",
      redireccion: "",
    },
  });

  useEffect(() => {
    if (appId) {
      const dataToEdit = initialApps.find(app => app.id === appId);
      if (dataToEdit) {
        form.reset({
            nombre: dataToEdit.nombre,
            siglas: dataToEdit.id,
            descripcion: dataToEdit.descripcion,
            activa: dataToEdit.activa,
            clienteId: dataToEdit.clientId,
            codigo: dataToEdit.code,
            urlDestino: dataToEdit.urlDestino,
            redireccion: dataToEdit.redirectUrl,
        });
      }
    }
  }, [appId, form]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        form.setValue("logo", file);
      };
      reader.readAsDataURL(file);
    }
  };


  function onSubmit(data: AppFormValues) {
    console.log(data);
    toast({
      title: appId ? "Aplicación Actualizada" : "Aplicación Creada",
      description: `La aplicación "${data.nombre}" se ha guardado exitosamente.`,
    });
    router.push("/dashboard/perfiles-pga/list");
  }

  return (
    <Card className="shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-primary/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="bg-muted/30 dark:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-2xl">{appId ? "Editar Aplicación" : "Gestión de Aplicaciones"}</CardTitle>
                    <CardDescription>{appId ? "Modificar los detalles de la aplicación." : "Agregar una nueva aplicación al sistema."}</CardDescription>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/dashboard/perfiles-pga/list">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Listado
                    </Link>
                </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre*</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-[1fr_auto] gap-4 items-end pt-2">
                         <FormField
                            control={form.control}
                            name="siglas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Siglas*</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="activa"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 pb-2">
                                     <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Activa</FormLabel>
                                </FormItem>
                            )}
                        />
                     </div>
                </div>
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl><Textarea rows={4} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Información del Sistema Interno</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormField control={form.control} name="clienteId" render={({ field }) => (<FormItem><FormLabel>Cliente ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="codigo" render={({ field }) => (<FormItem><FormLabel>Código</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="urlDestino" render={({ field }) => (<FormItem><FormLabel>URL Destino</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="redireccion" render={({ field }) => (<FormItem><FormLabel>Redirección</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <FormField
                    control={form.control}
                    name="logo"
                    render={() => (
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                    <Button asChild variant="outline" type="button">
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                            <Paperclip className="mr-2 h-4 w-4" /> Seleccionar archivo
                                            <input id="logo-upload" type="file" className="sr-only" accept="image/*,.svg" onChange={handleLogoChange} />
                                        </label>
                                    </Button>
                                    {logoPreview && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <img src={logoPreview} alt="Vista previa del logo" className="h-8 w-8 rounded-full object-contain" />
                                            <span>{(form.getValues("logo") as File)?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 dark:bg-muted/20 p-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform">
                <Save className="mr-2 h-5 w-5" />
                {appId ? "Guardar Cambios" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default function ApplicationFormPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ApplicationForm />
        </Suspense>
    )
}
