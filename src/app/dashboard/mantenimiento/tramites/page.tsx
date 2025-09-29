
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ArrowLeft, PlusCircle, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TramiteEntity } from "@/lib/repositories/tramite.repository";


const formSchema = z.object({
  id: z.string().optional(),
  solicitante: z.string().min(1, "El solicitante es requerido."),
  personal: z.string().optional(),
  tipo: z.string().min(1, "El tipo de trámite es requerido."),
  estado: z.enum(["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"]).default("PENDIENTE"),
  tipoTramite: z.enum(["PERSONA", "EMPRESA"]),
  tiempoEjecucion: z.coerce.number().min(1, "El tiempo es requerido.").max(10, "El máximo es 10 días."),

  // Empresa Fields
  categoriaEmpresaId: z.string().optional(),
  equiposSeguridad: z.array(z.string()).optional(),
  aeropuertos: z.array(z.string()).optional(),
  serviciosSeguridad: z.array(z.string()).optional(),
  requeridoCertificacion: z.boolean().optional(),
  requeridoModificacionPrograma: z.boolean().optional(),
  descripcionModificacion: z.string().optional(),

  // Persona Fields
  categoriaPersonal: z.array(z.string()).optional(),
  categoriaCia: z.array(z.string()).optional(),
  poseePrograma: z.enum(["SI", "NO"]).optional(),
  programaInstruccionFile: z.any().optional(),
  
  documentosRequeridos: z.array(z.object({
    id: z.string(),
    descripcion: z.string().min(1, "La descripción es requerida."),
    nota: z.string().optional(),
    departamentos: z.array(z.string()).min(1, "Debe seleccionar al menos un departamento."),
    obligatorio: z.boolean().default(false),
  })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function TramitesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [personalizadoTipoDocId, setPersonalizadoTipoDocId] = useState<string>("");
  const tramiteId = searchParams.get("id");

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<FormValues | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [aeropuertos, setAeropuertos] = React.useState<any[]>([]);
  const [equiposSeguridad, setEquiposSeguridad] = React.useState<any[]>([]);
  const [serviciosSeguridad, setServiciosSeguridad] = React.useState<any[]>([]);
  const [categoriasPersonal, setCategoriaPersonal] = React.useState<any[]>([]);
  const [categorias, setCategorias] = React.useState<any[]>([]);

  const categoriasEmpresa = [
    { id: '1', nombre: 'EMPRESAS DE APROVISIONAMIENTO Y SUMINISTRO' },
    { id: '2', nombre: 'ARRENDATARIOS EN AEROPUERTO' },
    { id: '3', nombre: 'PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD' },
  ];
  const categoriaCia = [
    {id: 'cesac', label: 'CESAC'},
    {id: 'explotadores', label: 'EXPLOTADORES DE AERONAVE'},
    {id: 'serv_privado', label: 'PROVEEDORES DE SERV. PRIVADO'},
    {id: 'aprov_aeronave', label: 'APROVICIONAMIENTO DE AERONAVE (CATERING)'},
  ];
  const departamentos = [
    {id: 'd1', label: 'ACREDITACIÓN'},
    {id: 'd2', label: 'TECNOLOGÍA'},
    {id: 'd3', label: 'TESORERIA'},
    {id: 'd4', label: 'ASUNTOS INTERNOS'},
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      solicitante: "",
      personal: "",
      tipo: "",
      estado: "PENDIENTE",
      tipoTramite: "EMPRESA",
      tiempoEjecucion: 10,
      categoriaEmpresaId: "",
      equiposSeguridad: [],
      aeropuertos: [],
      serviciosSeguridad: [],
      requeridoCertificacion: false,
      requeridoModificacionPrograma: false,
      descripcionModificacion: "",
      categoriaPersonal: [],
      categoriaCia: [],
      poseePrograma: "NO",
      programaInstruccionFile: undefined,
      documentosRequeridos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documentosRequeridos",
  });

  const tipoTramite = form.watch("tipoTramite");
  const poseePrograma = form.watch("poseePrograma");

  const loadFormData = async () => {
    try {
      const [aeroResponse, equiposResponse, serviciosResponse, catPersonalResponse, catResponse, tiposDocResponse] = await Promise.all([
        fetch('/api/aeropuertos'),
        fetch('/api/equipos-seguridad'),
        fetch('/api/servicios-seguridad'),
        fetch('/api/categorias-personal'),
        fetch('/api/categorias'),
        fetch('/api/tipos-documento')
      ]);

      if (aeroResponse.ok) {
        const aeroData = await aeroResponse.json();
        setAeropuertos(aeroData.map((a: any) => ({ id: a.id, label: a.codigo })));
      }
      if (equiposResponse.ok) {
        const equiposData = await equiposResponse.json();
        setEquiposSeguridad(equiposData.map((e: any) => ({ id: e.id, label: e.nombre })));
      }
      if (serviciosResponse.ok) {
        const serviciosData = await serviciosResponse.json();
        setServiciosSeguridad(serviciosData.map((s: any) => ({ id: s.id, label: s.nombre })));
      }
      if (catPersonalResponse.ok) {
        const catPersonalData = await catPersonalResponse.json();
        setCategoriaPersonal(catPersonalData.map((c: any) => ({ id: c.id, label: c.nombre })));
      }
      if (catResponse.ok) {
        const catData = await catResponse.json();
        setCategorias(catData.map((c: any) => ({ id: c.id, label: c.nombre })));
      }

      if (tiposDocResponse.ok) {
        const tiposDocData = await tiposDocResponse.json();
        console.log("📄 Tipos documento loaded:", tiposDocData);
        const personalizado = tiposDocData.find((t: any) => t.nombre === "Personalizado");
        console.log("🔍 Found personalizado:", personalizado);
        if (personalizado) {
          setPersonalizadoTipoDocId(personalizado.id);
          console.log("✅ Set personalizadoTipoDocId to:", personalizado.id);
        }
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const loadTramite = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tramites/${id}`);
      if (response.ok) {
        const tramite: any = await response.json();
        form.reset({
          id: tramite.id,
          solicitante: tramite.solicitante,
          personal: tramite.personal || "",
          tipo: tramite.tipo,
          estado: tramite.estado,
          tipoTramite: tramite.tipoTramite || "EMPRESA",
          tiempoEjecucion: tramite.tiempoEjecucion || 10,
          categoriaEmpresaId: tramite.categoriaEmpresaId || "",
          equiposSeguridad: tramite.equiposSeguridad?.map((e: any) => e.equipoSeguridad?.id) || [],
          aeropuertos: tramite.aeropuertos?.map((a: any) => a.aeropuerto?.id) || [],
          serviciosSeguridad: tramite.serviciosSeguridad?.map((s: any) => s.servicioSeguridad?.id) || [],
          requeridoCertificacion: tramite.requeridoCertificacion || false,
          requeridoModificacionPrograma: tramite.requeridoModificacionPrograma || false,
          descripcionModificacion: tramite.descripcionModificacion || "",
          categoriaPersonal: tramite.categoriasPersonal?.map((c: any) => c.categoriaPersonal?.id) || [],
          categoriaCia: [], // Will be populated after loading categorias from API
          poseePrograma: tramite.poseePrograma || "NO",
          programaInstruccionFile: undefined,
          documentosRequeridos: tramite.tiposDocumento?.map((d: any) => ({
            id: d.id,
            descripcion: d.descripcion || d.tipoDocumento?.descripcion,
            nota: d.nota || '',
            departamentos: d.departamentos || [],
            obligatorio: d.obligatorio
          })) || [],
        });

        // Map database categoria IDs back to hardcoded categoria values
        if (tramite.categorias?.length) {
          try {
            // Fetch all categorias to find the ones we need
            const response = await fetch('/api/categorias');
            if (response.ok) {
              const allCategorias = await response.json();
              const categoriaCiaIds = [];

              for (const categoriaRelation of tramite.categorias) {
                const categoriaId = categoriaRelation.categoria?.id || categoriaRelation.categoriaId;
                if (categoriaId) {
                  // Find the categoria in the loaded list
                  const categoria = allCategorias.find((c: any) => c.id === categoriaId);
                  if (categoria) {
                    // Find matching hardcoded categoria by name
                    const hardcodedCategoria = categoriaCia.find(c => c.label === categoria.nombre);
                    if (hardcodedCategoria) {
                      categoriaCiaIds.push(hardcodedCategoria.id);
                    }
                  }
                }
              }
              // Update the form with the mapped categoria CIA IDs
              form.setValue('categoriaCia', categoriaCiaIds);
            }
          } catch (error) {
            console.error("Error loading categorias for mapping:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error loading trámite:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el trámite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFormData();
    if (tramiteId) {
      loadTramite(tramiteId);
    }
  }, [tramiteId]);

  const onSubmit = async (data: FormValues) => {
    console.log("🚀 onSubmit called with data:", data);
    try {
      console.log("⏳ Setting loading to true...");
      setLoading(true);

      // Create categoria records for categoriaCia if they don't exist
      const categoriasProcessed = [];
      for (const categoriaId of data.categoriaCia || []) {
        try {
          // Find the categoria label
          const categoriaInfo = categoriaCia.find(c => c.id === categoriaId);
          if (categoriaInfo) {
            // First, try to find existing categoria by searching
            const searchResponse = await fetch(`/api/categorias?search=${encodeURIComponent(categoriaInfo.label)}`);
            if (searchResponse.ok) {
              const searchResults = await searchResponse.json();
              const existingCategoria = searchResults.find((c: any) => c.nombre === categoriaInfo.label);

              if (existingCategoria) {
                // Use existing categoria ID
                categoriasProcessed.push(existingCategoria.id);
              } else {
                // Create new categoria
                const categoriaResponse = await fetch('/api/categorias', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre: categoriaInfo.label,
                    descripcion: `Categoría CIA: ${categoriaInfo.label}`,
                    estado: 'ACTIVO'
                  })
                });

                if (categoriaResponse.ok) {
                  const newCategoria = await categoriaResponse.json();
                  categoriasProcessed.push(newCategoria.id);
                } else {
                  console.error("Failed to create categoria:", await categoriaResponse.text());
                }
              }
            }
          }
        } catch (error) {
          console.error("Error processing categoria:", error);
        }
      }

      // Create individual tipo documento records for each custom document
      const tiposDocumentoProcessed = [];
      for (const doc of data.documentosRequeridos || []) {
        try {
          // Create a new tipo documento for each custom document
          const tipoDocResponse = await fetch('/api/tipos-documento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: `Personalizado - ${doc.descripcion.substring(0, 50)}`,
              descripcion: doc.descripcion,
              obligatorio: doc.obligatorio
            })
          });

          if (tipoDocResponse.ok) {
            const newTipoDoc = await tipoDocResponse.json();
            tiposDocumentoProcessed.push({
              tipoDocumentoId: newTipoDoc.id,
              descripcion: doc.descripcion,
              nota: doc.nota,
              obligatorio: doc.obligatorio,
              departamentos: doc.departamentos
            });
          } else {
            // Fallback to the default personalizado tipo documento
            tiposDocumentoProcessed.push({
              tipoDocumentoId: personalizadoTipoDocId || 'cmg48uko20001zfoxtlc31vv8',
              descripcion: doc.descripcion,
              nota: doc.nota,
              obligatorio: doc.obligatorio,
              departamentos: doc.departamentos
            });
          }
        } catch (error) {
          console.error("Error creating tipo documento:", error);
          // Fallback to the default personalizado tipo documento
          tiposDocumentoProcessed.push({
            tipoDocumentoId: personalizadoTipoDocId || 'cmg48uko20001zfoxtlc31vv8',
            descripcion: doc.descripcion,
            nota: doc.nota,
            obligatorio: doc.obligatorio,
            departamentos: doc.departamentos
          });
        }
      }

      const tramiteData = {
        solicitante: data.solicitante,
        personal: data.personal || null,
        tipo: data.tipo,
        estado: data.estado,
        tipoTramite: data.tipoTramite,
        tiempoEjecucion: data.tiempoEjecucion,
        categoriaEmpresaId: data.categoriaEmpresaId,
        requeridoCertificacion: data.requeridoCertificacion,
        requeridoModificacionPrograma: data.requeridoModificacionPrograma,
        descripcionModificacion: data.descripcionModificacion,
        poseePrograma: data.poseePrograma,
        aeropuertos: data.aeropuertos || [],
        equiposSeguridad: data.equiposSeguridad || [],
        serviciosSeguridad: data.serviciosSeguridad || [],
        categoriasPersonal: data.categoriaPersonal || [],
        categorias: categoriasProcessed,
        tiposDocumento: tiposDocumentoProcessed,
      };

      const url = tramiteId ? `/api/tramites/${tramiteId}` : '/api/tramites';
      const method = tramiteId ? 'PUT' : 'POST';

      console.log("📡 Making request to:", url, "with method:", method);
      console.log("📦 Sending data:", tramiteData);
      console.log("🆔 personalizadoTipoDocId:", personalizadoTipoDocId);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tramiteData),
      });

      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Response error data:", errorData);
        throw new Error(errorData.error || 'Error al guardar trámite');
      }

      const responseData = await response.json();
      console.log("✅ Success response:", responseData);

      toast({
        title: tramiteId ? "Trámite Actualizado" : "Trámite Creado",
        description: `El trámite "${data.tipo}" se ha guardado exitosamente.`,
      });

      console.log("🔄 Redirecting to list page...");
      router.push("/dashboard/mantenimiento/tramites/list");
    } catch (error) {
      console.error("Error saving trámite:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar el trámite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewClick = () => {
    setPreviewData(form.getValues());
    setIsPreviewOpen(true);
  };
  
  const getLabelsByIds = (sourceArray: { id: string; label: string }[], ids: string[] = []) => {
    if (!ids || ids.length === 0) return 'Ninguno';
    return ids
        .map(id => sourceArray.find(item => item.id === id)?.label)
        .filter(Boolean)
        .join(', ');
  };


  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={(e) => {
          console.log("📝 Form submit event triggered");
          console.log("🔍 Form state:", form.formState);
          console.log("❗ Form errors:", form.formState.errors);
          form.handleSubmit(onSubmit)(e);
        }}>
          <CardHeader className="bg-muted/30 dark:bg-muted/20">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>{tramiteId ? "Editar Trámite" : "Creación de trámites, productos y requerimientos"}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FormLabel>ID:</FormLabel>
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <Input
                        {...field}
                        readOnly
                        className="w-32 bg-background font-bold"
                      />
                    )}
                  />
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/mantenimiento/tramites/list">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 items-end">
              <FormField control={form.control} name="solicitante" render={({ field }) => (<FormItem className="lg:col-span-2"><FormLabel>Solicitante</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="personal" render={({ field }) => (<FormItem><FormLabel>Personal (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="tipo" render={({ field }) => (<FormItem className="lg:col-span-2"><FormLabel>Tipo de Trámite</FormLabel><FormControl><Input {...field} placeholder="Ej: Certificación del personal de seguridad privada" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="estado" render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione estado" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                      <SelectItem value="EN_PROCESO">EN PROCESO</SelectItem>
                      <SelectItem value="COMPLETADO">COMPLETADO</SelectItem>
                      <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField
              control={form.control}
              name="tipoTramite"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Trámite</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="PERSONA" /></FormControl>
                        <FormLabel className="font-normal">PERSONA</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="EMPRESA" /></FormControl>
                        <FormLabel className="font-normal">EMPRESA</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            {tipoTramite === "EMPRESA" && (
                <div className="space-y-6 animate-in fade-in-50">
                    <FormField
                        control={form.control}
                        name="categoriaEmpresaId"
                        render={({ field }) => (
                            <FormItem className="max-w-md">
                                <FormLabel>Categoría</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una categoría" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {categoriasEmpresa.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <h3 className="text-lg font-medium text-center text-primary">REQUERIMIENTOS BÁSICOS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FormField control={form.control} name="equiposSeguridad" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Equipos de Seguridad</FormLabel>
                                <div className="space-y-2 pt-2">
                                {equiposSeguridad.map((item) => (<FormField key={item.id} control={form.control} name="equiposSeguridad" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="aeropuertos" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Aeropuertos</FormLabel>
                                 <div className="grid grid-cols-2 gap-2 pt-2">
                                {aeropuertos.map((item) => (<FormField key={item.id} control={form.control} name="aeropuertos" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="serviciosSeguridad" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Servicios de Seguridad</FormLabel>
                                <FormDescription>Servicios de seguridad a adicionar</FormDescription>
                                <div className="space-y-2 pt-2">
                                {serviciosSeguridad.map((item) => (<FormField key={item.id} control={form.control} name="serviciosSeguridad" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                         <FormItem>
                            <FormLabel className="font-semibold">Requeridos</FormLabel>
                             <div className="space-y-2 pt-2">
                                 <FormField control={form.control} name="requeridoCertificacion" render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="font-normal">Datos de la Solicitud Certificación No.*</FormLabel>
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="requeridoModificacionPrograma" render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-3">
                                        <div className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <FormLabel className="font-normal">Describe las partes del Programa de Seguridad que se desea modificar*</FormLabel>
                                        </div>
                                        {field.value && <FormField control={form.control} name="descripcionModificacion" render={({ field }) => (<FormControl><Textarea {...field} placeholder="Describa aquí..." rows={4} /></FormControl>)}/>}
                                    </FormItem>
                                )}/>
                            </div>
                         </FormItem>
                    </div>
                </div>
            )}

            {tipoTramite === "PERSONA" && (
                <div className="space-y-8 animate-in fade-in-50">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <FormField control={form.control} name="aeropuertos" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Aeropuertos</FormLabel>
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                {aeropuertos.map((item) => (<FormField key={item.id} control={form.control} name="aeropuertos" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="categoriaPersonal" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Categoría de Personal</FormLabel>
                                <div className="space-y-2 pt-2">
                                {categoriasPersonal.map((item: any) => (<FormField key={item.id} control={form.control} name="categoriaPersonal" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="categoriaCia" render={() => (
                            <FormItem>
                                <FormLabel className="font-semibold">Categoría de CIA con Personal Certificado</FormLabel>
                                <div className="space-y-2 pt-2">
                                {categoriaCia.map((item) => (<FormField key={item.id} control={form.control} name="categoriaCia" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        return checked ? field.onChange([...(field.value || []), item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                                    }}/></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}/>))}
                                </div>
                            </FormItem>
                        )}/>
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="poseePrograma"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Posee Programa de Instrucción</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-2 pt-2">
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="SI" /></FormControl><FormLabel className="font-normal">SI</FormLabel></FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="NO" /></FormControl><FormLabel className="font-normal">NO</FormLabel></FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {poseePrograma === 'SI' && (
                                <div className="pt-2 animate-in fade-in-50">
                                    <FormField
                                        control={form.control}
                                        name="programaInstruccionFile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cargar Programa (PDF)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf"
                                                        name={field.name}
                                                        onBlur={field.onBlur}
                                                        ref={field.ref}
                                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <Separator />
            
            <div>
              <FormLabel className="text-lg font-medium">Documentos Requeridos</FormLabel>
              <FormDescription>Documentos necesarios para este trámite.</FormDescription>
              <div className="space-y-4 pt-4">
                  {fields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-[1fr_auto] gap-4 items-start p-4 border rounded-lg bg-muted/30">
                          <div className="space-y-4">
                              <FormField control={form.control} name={`documentosRequeridos.${index}.descripcion`} render={({ field }) => (
                                  <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                              )}/>
                              <FormField control={form.control} name={`documentosRequeridos.${index}.nota`} render={({ field }) => (
                                  <FormItem><FormLabel>Nota</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription className="text-destructive">Esta nota es aclaratoria.</FormDescription><FormMessage /></FormItem>
                              )}/>
                              <FormField
                                  control={form.control}
                                  name={`documentosRequeridos.${index}.departamentos`}
                                  render={({ field }) => (
                                      <FormItem>
                                          <FormLabel>Departamentos</FormLabel>
                                          <Popover>
                                              <PopoverTrigger asChild>
                                                  <FormControl>
                                                      <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}>
                                                          {field.value?.length ? `${field.value.length} seleccionado(s)` : "Seleccionar departamentos"}
                                                      </Button>
                                                  </FormControl>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-[300px] p-0">
                                                  <ScrollArea className="h-48">
                                                      <div className="p-4 space-y-2">
                                                      {departamentos.map((dep) => (
                                                            <FormField
                                                              key={dep.id}
                                                              control={form.control}
                                                              name={`documentosRequeridos.${index}.departamentos`}
                                                              render={({ field }) => {
                                                              return (
                                                                  <FormItem key={dep.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                      <FormControl>
                                                                          <Checkbox
                                                                              checked={field.value?.includes(dep.id)}
                                                                              onCheckedChange={(checked) => {
                                                                                  return checked
                                                                                  ? field.onChange([...(field.value ?? []), dep.id])
                                                                                  : field.onChange(field.value?.filter((value) => value !== dep.id));
                                                                              }}
                                                                          />
                                                                      </FormControl>
                                                                      <FormLabel className="font-normal">{dep.label}</FormLabel>
                                                                  </FormItem>
                                                              );
                                                              }}
                                                          />
                                                      ))}
                                                      </div>
                                                  </ScrollArea>
                                              </PopoverContent>
                                          </Popover>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField control={form.control} name={`documentosRequeridos.${index}.obligatorio`} render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2">
                                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                      <FormLabel className="font-normal">Obligatorio</FormLabel>
                                  </FormItem>
                              )}/>
                          </div>
                          <div className="flex flex-col gap-2">
                                {index === 0 && (
                                  <Button type="button" size="icon" className="bg-green-600 hover:bg-green-700" onClick={() => append({ id: crypto.randomUUID(), descripcion: '', nota: '', departamentos: [], obligatorio: false })}>
                                      <PlusCircle className="h-5 w-5" />
                                  </Button>
                                )}
                              {index > 0 && (
                                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                      <Trash2 className="h-5 w-5" />
                                  </Button>
                              )}
                          </div>
                      </div>
                  ))}
                    {fields.length === 0 && (
                      <Button type="button" size="sm" variant="outline" onClick={() => append({ id: crypto.randomUUID(), descripcion: '', nota: '', departamentos: [], obligatorio: false })}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Documento
                      </Button>
                  )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Guardando..." : (tramiteId ? "Guardar Cambios" : "Guardar Trámite")}
            </Button>
             <Button type="button" variant="secondary" onClick={handlePreviewClick} disabled={loading}>
              Vista previa
            </Button>
          </CardFooter>
        </form>
      </Form>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        {previewData && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Vista Previa del Trámite</DialogTitle>
              <DialogDescription>
                Revise la información del trámite antes de guardarlo.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-6">
              <div className="space-y-2 rounded-lg border p-4">
                  <h4 className="font-semibold text-primary">Información General</h4>
                  <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-2 text-sm">
                      <p className="font-medium">ID:</p><p>{previewData.id}</p>
                      <p className="font-medium">Solicitante:</p><p>{previewData.solicitante}</p>
                      <p className="font-medium">Personal:</p><p>{previewData.personal || 'N/A'}</p>
                      <p className="font-medium">Tipo:</p><p>{previewData.tipo}</p>
                      <p className="font-medium">Estado:</p><p className="font-bold">{previewData.estado}</p>
                  </div>
              </div>
              
              {previewData.tipoTramite === 'EMPRESA' && (
                  <div className="space-y-2 rounded-lg border p-4">
                      <h4 className="font-semibold text-primary">Detalles de Empresa</h4>
                      <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-2 text-sm">
                        <p className="font-medium">Categoría:</p><p>{categoriasEmpresa.find(c=>c.id === previewData.categoriaEmpresaId)?.nombre || 'No especificada'}</p>
                        <p className="font-medium">Equipos de Seguridad:</p><p>{getLabelsByIds(equiposSeguridad, previewData.equiposSeguridad)}</p>
                        <p className="font-medium">Aeropuertos:</p><p>{getLabelsByIds(aeropuertos, previewData.aeropuertos)}</p>
                        <p className="font-medium">Servicios de Seguridad:</p><p>{getLabelsByIds(serviciosSeguridad, previewData.serviciosSeguridad)}</p>
                        <p className="font-medium">Requiere No. Certificación:</p><p>{previewData.requeridoCertificacion ? 'Sí' : 'No'}</p>
                        <p className="font-medium">Requiere Modif. Programa:</p><p>{previewData.requeridoModificacionPrograma ? 'Sí' : 'No'}</p>
                        {previewData.requeridoModificacionPrograma && <>
                            <p className="font-medium">Descripción Modificación:</p><p>{previewData.descripcionModificacion || 'No especificada'}</p>
                        </>}
                      </div>
                  </div>
              )}

              {previewData.tipoTramite === 'PERSONA' && (
                  <div className="space-y-2 rounded-lg border p-4">
                      <h4 className="font-semibold text-primary">Detalles de Persona</h4>
                       <div className="grid grid-cols-[250px_1fr] gap-x-8 gap-y-2 text-sm">
                        <p className="font-medium">Aeropuertos:</p><p>{getLabelsByIds(aeropuertos, previewData.aeropuertos)}</p>
                        <p className="font-medium">Categoría de Personal:</p><p>{getLabelsByIds(categoriasPersonal, previewData.categoriaPersonal)}</p>
                        <p className="font-medium">Categoría de CIA:</p><p>{getLabelsByIds(categoriaCia, previewData.categoriaCia)}</p>
                        <p className="font-medium">Posee Programa de Instrucción:</p><p>{previewData.poseePrograma?.toUpperCase() || 'No especificado'}</p>
                        {previewData.poseePrograma === 'SI' && previewData.programaInstruccionFile && (
                          <>
                            <p className="font-medium">Archivo del Programa:</p>
                            <p className="truncate">{(previewData.programaInstruccionFile as File).name}</p>
                          </>
                        )}
                      </div>
                  </div>
              )}

              {previewData.documentosRequeridos && previewData.documentosRequeridos.length > 0 && (
                  <div className="space-y-4">
                      <h4 className="font-semibold text-primary">Documentos Requeridos</h4>
                      {previewData.documentosRequeridos.map((doc, index) => (
                          <div key={index} className="p-3 border rounded-md text-sm space-y-1">
                              <p><strong>{index + 1}. {doc.descripcion || 'Sin descripción'}</strong></p>
                              {doc.nota && <p className="text-xs pl-4">Nota: <span className="text-destructive">{doc.nota}</span></p>}
                              <p className="text-xs pl-4">Departamentos: {getLabelsByIds(departamentos, doc.departamentos)}</p>
                              <p className="text-xs pl-4">Obligatorio: <span className="font-semibold">{doc.obligatorio ? 'Sí' : 'No'}</span></p>
                          </div>
                      ))}
                  </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}

export default function TramitesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TramitesForm />
    </Suspense>
  );
}
