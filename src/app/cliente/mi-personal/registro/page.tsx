
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Save, User, Briefcase, Heart, Camera } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  foto: z.any().optional(),
  nombre: z.string().min(2, "El nombre es requerido."),
  cedula: z.string().min(11, "La cédula debe tener 11 dígitos.").max(13, "La cédula no puede tener más de 13 caracteres."),
  posicion: z.string().min(1, "La posición es requerida."),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida."),
  nacionalidad: z.string().min(1, "La nacionalidad es requerida."),
  estatura: z.string().min(1, "La estatura es requerida."),
  contactoEmergencia: z.string().min(1, "El contacto de emergencia es requerido."),
  
  habilitacion: z.string().min(1, "La habilitación es requerida."),
  estado: z.string().min(1, "El estado es requerido."),
  aeropuerto: z.string().min(1, "El aeropuerto es requerido."),
  
  tipoSangre: z.string().min(1, "El tipo de sangre es requerido."),
  condicionFisica: z.string().optional(),
  medicamentoControlado: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data fetching, replace with your actual data fetching logic
const getPersonalById = (id: string) => {
    const personalData: any = {
      '12345': { foto: 'https://placehold.co/100x100.png', nombre: 'Kendy A. Qualey', cedula: '001-1234567-8', habilitacion: 'INSPECTOR AVSEC 1RA CAT', estado: 'Activo', posicion: 'Inspector AVSEC 1ra Categoría', aeropuerto: 'Las Américas (SDQ)', tipoSangre: 'O+', condicionFisica: 'Ninguna reportada', medicamentoControlado: 'No', edad: 35, estatura: "5'11\"", contactoEmergencia: '(809) 123-4567 (Esposa)', fechaNacimiento: '1989-05-15', nacionalidad: 'Dominicana' },
    };
    return personalData[id];
};

function RegistroPersonalForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const personId = searchParams.get("id");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            cedula: "",
            posicion: "",
            fechaNacimiento: "",
            nacionalidad: "",
            estatura: "",
            contactoEmergencia: "",
            habilitacion: "",
            estado: "Activo",
            aeropuerto: "",
            tipoSangre: "",
            condicionFisica: "",
            medicamentoControlado: "",
        },
    });

    useEffect(() => {
        if (personId) {
            const dataToEdit = getPersonalById(personId);
            if (dataToEdit) {
                form.reset(dataToEdit);
                if (dataToEdit.foto) {
                    setImagePreview(dataToEdit.foto);
                }
            }
        }
    }, [personId, form]);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                form.setValue("foto", file);
            };
            reader.readAsDataURL(file);
        }
    };

    function onSubmit(data: FormValues) {
        console.log(data);
        toast({
            title: personId ? "Perfil Actualizado" : "Personal Registrado",
            description: `Los datos de "${data.nombre}" se han guardado exitosamente.`,
        });
        router.push("/cliente/mi-personal");
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="shadow-2xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-red-500 to-orange-400 p-6 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl">{personId ? "Editar Perfil" : "Registrar Nuevo Personal"}</CardTitle>
                                    <CardDescription className="text-white/80">{personId ? "Actualice la información del miembro del personal." : "Complete el formulario para agregar un nuevo miembro."}</CardDescription>
                                </div>
                                <Button asChild variant="ghost" className="hover:bg-white/10">
                                    <Link href="/cliente/mi-personal">
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Photo Section */}
                            <div className="lg:col-span-1 space-y-4 flex flex-col items-center">
                                <Avatar className="w-48 h-48 border-4 border-muted shadow-lg">
                                    <AvatarImage src={imagePreview || 'https://placehold.co/200x200.png'} alt="Foto de perfil" data-ai-hint="person face" className="object-cover" />
                                    <AvatarFallback className="text-5xl">?</AvatarFallback>
                                </Avatar>
                                <FormField
                                    control={form.control}
                                    name="foto"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <Button asChild variant="outline">
                                                    <label htmlFor="foto-upload">
                                                        <Camera className="mr-2 h-4 w-4" /> Cargar Foto
                                                        <input id="foto-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                                    </label>
                                                </Button>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Form Fields Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5 text-primary" /> Datos Personales</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="cedula" render={({ field }) => (<FormItem><FormLabel>Cédula</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="posicion" render={({ field }) => (<FormItem><FormLabel>Posición</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="nacionalidad" render={({ field }) => (<FormItem><FormLabel>Nacionalidad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="estatura" render={({ field }) => (<FormItem><FormLabel>Estatura</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="contactoEmergencia" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Contacto de Emergencia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5 text-primary" /> Información Laboral</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="habilitacion" render={({ field }) => (<FormItem><FormLabel>Habilitación</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="aeropuerto" render={({ field }) => (<FormItem><FormLabel>Aeropuerto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="estado" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Activo">Activo</SelectItem>
                                                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                                                        <SelectItem value="Suspendido">Suspendido</SelectItem>
                                                        <SelectItem value="Vencido">Vencido</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>
                                
                                <Card>
                                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Heart className="h-5 w-5 text-primary" /> Información Médica</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="tipoSangre" render={({ field }) => (<FormItem><FormLabel>Tipo de Sangre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="condicionFisica" render={({ field }) => (<FormItem><FormLabel>Condición Física (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="medicamentoControlado" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Medicamento Controlado (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-4 flex justify-end">
                            <Button type="submit" size="lg" className="font-bold">
                                <Save className="mr-2 h-5 w-5" />
                                {personId ? "Guardar Cambios" : "Registrar Personal"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}

export default function RegistroPersonalPageWrapper() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <RegistroPersonalForm />
        </Suspense>
    )
}
