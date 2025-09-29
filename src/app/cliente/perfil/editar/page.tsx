"use client";

import React, { Suspense } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    nombre: z.string().min(2, "El nombre de la compañía es requerido."),
    rnc: z.string().min(9, "El RNC debe tener al menos 9 caracteres."),
    telefono: z.string().min(10, "El teléfono debe tener al menos 10 caracteres."),
    representante: z.string().min(2, "El nombre del representante es requerido."),
    correo: z.string().email("Debe ser un correo electrónico válido."),
    direccion: z.string().min(10, "La dirección es requerida."),
    notas: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function EditarPerfilForm() {
    const router = useRouter();
    const { toast } = useToast();

    // Mock data for the form. In a real app, this would be fetched.
    const companyData = {
        nombre: "TrackAviation Security S.R.L",
        rnc: "130-12345-6",
        telefono: "(809) 555-1234",
        representante: "Kendy A. Qualey",
        correo: "security@trackaviation.com",
        direccion: "Av. Charles de Gaulle #10, Santo Domingo Este, República Dominicana",
        notas: "Compañía líder en servicios de seguridad aeroportuaria, comprometida con los más altos estándares de la aviación civil. Partner estratégico del CESAC desde 2015."
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: companyData,
    });


    function onSubmit(data: FormValues) {
        console.log("Datos del formulario actualizados:", data);
        toast({
            title: "Perfil Actualizado",
            description: "La información de la compañía ha sido guardada exitosamente.",
        });
        router.push("/cliente/perfil");
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
             <Card className="shadow-2xl overflow-hidden">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="bg-muted/30">
                           <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Building2 className="h-7 w-7 text-primary" />
                                        Editar Perfil de la Compañía
                                    </CardTitle>
                                    <CardDescription>Actualice la información de contacto y registro de la empresa.</CardDescription>
                                </div>
                                 <Button asChild variant="outline">
                                    <Link href="/cliente/perfil">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Perfil
                                    </Link>
                                </Button>
                           </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre de la Compañía</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="rnc" render={({ field }) => (<FormItem><FormLabel>RNC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="representante" render={({ field }) => (<FormItem><FormLabel>Representante Legal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="telefono" render={({ field }) => (<FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="md:col-span-2">
                                     <FormField control={form.control} name="correo" render={({ field }) => (<FormItem><FormLabel>Correo Electrónico</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                <div className="md:col-span-2">
                                     <FormField control={form.control} name="direccion" render={({ field }) => (<FormItem><FormLabel>Dirección Fiscal</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                <div className="md:col-span-2">
                                     <FormField control={form.control} name="notas" render={({ field }) => (<FormItem><FormLabel>Notas Adicionales</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                             </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-4 flex justify-end">
                            <Button type="submit" size="lg" className="font-bold">
                                <Save className="mr-2 h-5 w-5" />
                                Guardar Cambios
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}

export default function EditarPerfilPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <EditarPerfilForm />
        </Suspense>
    )
}
