
"use client";

import * as React from "react";
// Imports for the existing part
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Download, FileText, Loader2, Sparkles, X, Lightbulb, AlertTriangle, ChevronsRight, ShieldCheck, PlusCircle, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { initialApps } from "../../perfiles-pga/data";
import { generarAnalisisDeIncidentes } from "./actions";
import { Separator } from "@/components/ui/separator";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Imports for the new form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Schema for the new incident form
const incidentFormSchema = z.object({
  appName: z.string({ required_error: "Debe seleccionar una aplicación." }),
  userName: z.string().min(1, "El nombre de usuario es requerido."),
  incidentLevel: z.string({ required_error: "Debe seleccionar un nivel." }),
  reportingDepartment: z.string({ required_error: "Debe seleccionar una dependencia." }),
  incidentDateTime: z.string().min(1, "La fecha y hora del fallo son requeridas."),
  attachment: z.any().optional(),
  os: z.string({ required_error: "Debe seleccionar un sistema operativo." }),
  osOther: z.string().optional(),
  incidentType: z.string({ required_error: "Debe seleccionar un tipo de incidencia." }),
  incidentTypeOther: z.string().optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
}).refine((data) => {
    if (data.os === "otro" && !data.osOther) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifique el sistema operativo.",
    path: ["osOther"],
}).refine((data) => {
    if (data.incidentType === "otro" && !data.incidentTypeOther) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifique el tipo de incidencia.",
    path: ["incidentTypeOther"],
});


type Incident = {
  appName: string;
  appId: string;
  incidentType: string;
  description: string;
};

type AnalysisResult = {
    executiveSummary: string;
    rootCauseAnalysis: string[];
    shortTermFixes: string[];
    longTermRecommendations: string[];
};

// Mock data for dependencies
const dependencies = [
    { id: "d1", name: "DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN" },
    { id: "d2", name: "DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN" },
    { id: "d3", name: "DEPARTAMENTO DE TESORERIA" },
    { id: "d4", name: "ESCUELA DE SEGURIDAD DE LA AVIACIÓN CIVIL (ESAC)" },
    { id: "d5", name: "DIRECCIÓN DE ASUNTOS INTERNOS" },
];

const PgaReportLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="100" height="100" rx="15" fill="#1A237E" />
        <text
            x="50%"
            y="52%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="40"
            fontWeight="800"
            fill="white"
            letterSpacing="-1"
        >
            PGA
        </text>
    </svg>
);

const InfoCard = ({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType, children: React.ReactNode; className?: string }) => (
  <Card className={`shadow-lg border-t-2 border-transparent bg-white print:shadow-none print:border-gray-200 ${className} flex flex-col`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow text-sm text-gray-600 leading-relaxed">
      {children}
    </CardContent>
  </Card>
);

function IncidentAnalysisPageContent() {
  const { toast } = useToast();
  const allIncidents = React.useMemo(() => 
    initialApps.flatMap(app => 
      app.incidents.map(inc => ({
        appName: app.nombre,
        appId: app.id,
        incidentType: inc.type,
        description: inc.description,
      }))
    ), []);
  
  const [selectedIncidents, setSelectedIncidents] = React.useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const reportRef = React.useRef<HTMLDivElement>(null);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  
  const searchParams = useSearchParams();
  const appFromQuery = searchParams.get('app');
  const appNameToSet = initialApps.find(app => app.id === appFromQuery)?.nombre || '';

  const form = useForm<z.infer<typeof incidentFormSchema>>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
        userName: "",
        description: "",
        incidentTypeOther: "",
        osOther: "",
        appName: appNameToSet,
    },
  });

  React.useEffect(() => {
    if (appNameToSet) {
      form.setValue('appName', appNameToSet);
      setIsFormOpen(true);
    }
  }, [appNameToSet, form]);


  const osValue = form.watch("os");
  const incidentTypeValue = form.watch("incidentType");

  const handleSelectIncident = (index: number, checked: boolean) => {
    const newSelection = new Set(selectedIncidents);
    if (checked) {
      newSelection.add(index);
    } else {
      newSelection.delete(index);
    }
    setSelectedIncidents(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncidents(new Set(allIncidents.map((_, index) => index)));
    } else {
      setSelectedIncidents(new Set());
    }
  };

  const handleGenerateAnalysis = async () => {
    if (selectedIncidents.size === 0) {
      toast({
        variant: "destructive",
        title: "No hay incidentes seleccionados",
        description: "Por favor, seleccione al menos un incidente para analizar.",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    
    const incidentsToAnalyze = Array.from(selectedIncidents).map(index => allIncidents[index]);

    try {
      const result = await generarAnalisisDeIncidentes(incidentsToAnalyze);
      setAnalysisResult(result);
    } catch (e) {
      setError("Ocurrió un error al generar el análisis. Por favor, intente de nuevo.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    const buttonContainer = document.querySelector('.download-button-container');
    if (buttonContainer) (buttonContainer as HTMLElement).style.visibility = 'hidden';

    toast({ title: "Generando PDF...", description: "Por favor espere." });

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    
    if (buttonContainer) (buttonContainer as HTMLElement).style.visibility = 'visible';

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth / ratio;

    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = finalHeight * ratio;
    }
    
    const x = (pdfWidth - finalWidth) / 2;
    const y = 0;
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(`analisis-incidentes-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getIncidentBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'crítico': return 'destructive';
      case 'advertencia': return 'secondary';
      default: return 'outline';
    }
  };
  
  async function onFormSubmit(data: z.infer<typeof incidentFormSchema>) {
    setIsSubmitting(true);
    console.log(data);

    // Store data in sessionStorage to pass to the new tab
    sessionStorage.setItem('incidentReportData', JSON.stringify(data));
    
    // Open the report page in a new tab
    const reportWindow = window.open('/dashboard/reportes/incidentes/reporte', '_blank');
    if (!reportWindow) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo abrir la nueva pestaña. Por favor, revise la configuración de su navegador.",
        });
    }

    toast({
        title: "Incidencia Reportada",
        description: "El reporte de incidencia ha sido creado y se está generando el PDF.",
    });

    form.reset();
    setIsFormOpen(false);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><Bot className="h-8 w-8 text-primary" />Análisis de Incidentes con IA</h1>
        <p className="text-muted-foreground">
          Seleccione los incidentes que desea analizar para obtener una evaluación de causa raíz y soluciones recomendadas.
        </p>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <CardTitle>Listado de Incidentes</CardTitle>
                    <CardDescription>
                        Mostrando todos los incidentes reportados en las aplicaciones.
                    </CardDescription>
                </div>
                 <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Registrar Incidencia</Button>
                </DialogTrigger>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">
                      <Checkbox
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        checked={selectedIncidents.size === allIncidents.length && allIncidents.length > 0}
                      />
                    </TableHead>
                    <TableHead>Aplicación</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allIncidents.map((incident, index) => (
                    <TableRow key={index}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => handleSelectIncident(index, !selectedIncidents.has(index))}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIncidents.has(index)}
                          onCheckedChange={(checked) => handleSelectIncident(index, Boolean(checked))}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{incident.appName}</TableCell>
                      <TableCell>
                        <Badge variant={getIncidentBadge(incident.incidentType)}>{incident.incidentType}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{incident.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGenerateAnalysis} disabled={isLoading || selectedIncidents.size === 0} size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Generar Análisis con IA ({selectedIncidents.size})
              </Button>
            </div>
          </CardContent>
        </Card>

        <DialogContent className="sm:max-w-4xl p-0 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-black">
            <DialogHeader className="p-6 pb-4 bg-muted/30">
                <DialogTitle className="text-2xl font-bold">Registrar Nueva Incidencia</DialogTitle>
                <DialogDescription>
                    Complete el formulario para reportar una nueva incidencia. Se generará un PDF al enviarlo.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)}>
                    <div className="px-6 py-4 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-6">
                                <FormField control={form.control} name="appName" render={({ field }) => ( <FormItem><FormLabel>Aplicación</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione la aplicación" /></SelectTrigger></FormControl><SelectContent>{initialApps.map(app => (<SelectItem key={app.id} value={app.nombre}>{app.nombre}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )}/>
                                <FormField control={form.control} name="userName" render={({ field }) => (<FormItem><FormLabel>Nombre del usuario</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="incidentLevel" render={({ field }) => (<FormItem><FormLabel>Nivel de la incidencia</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione el nivel" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Crítico">Crítico</SelectItem><SelectItem value="Advertencia">Advertencia</SelectItem><SelectItem value="Menor">Menor</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="reportingDepartment" render={({ field }) => (<FormItem><FormLabel>Dependencia que reporta</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione la dependencia" /></SelectTrigger></FormControl><SelectContent>{dependencies.map(dep => <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="incidentDateTime" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha y hora del fallo</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="attachment" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Adjuntar foto del problema</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                             <div className="space-y-6">
                                <FormField control={form.control} name="os" render={({ field }) => (
                                    <FormItem className="space-y-3"><FormLabel>Sistema operativo</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Android" /></FormControl><FormLabel className="font-normal">Android</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="iOS" /></FormControl><FormLabel className="font-normal">iOS</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Windows 11" /></FormControl><FormLabel className="font-normal">Windows 11</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Windows 10" /></FormControl><FormLabel className="font-normal">Windows 10</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Windows 7" /></FormControl><FormLabel className="font-normal">Windows 7</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="otro" /></FormControl><FormLabel className="font-normal">Otro</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                        {osValue === 'otro' && <FormField control={form.control} name="osOther" render={({ field }) => (<FormControl><Input {...field} placeholder="Especifique el SO" /></FormControl>)} />}
                                    </FormItem>
                                )}/>
                                 <Separator />
                                <FormField control={form.control} name="incidentType" render={({ field }) => (
                                    <FormItem className="space-y-3"><FormLabel>Tipo de incidencia</FormLabel>
                                        <FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Error al iniciar sesión" /></FormControl><FormLabel className="font-normal">Error al iniciar sesión</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="La app se cierra sola (crash)" /></FormControl><FormLabel className="font-normal">La app se cierra sola (crash)</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Problemas de visualización o diseño" /></FormControl><FormLabel className="font-normal">Problemas de visualización o diseño</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Error en los datos mostrados" /></FormControl><FormLabel className="font-normal">Error en los datos mostrados</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="Funcionalidad que no responde" /></FormControl><FormLabel className="font-normal">Funcionalidad que no responde</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="otro" /></FormControl><FormLabel className="font-normal">Otro</FormLabel></FormItem>
                                        </RadioGroup></FormControl><FormMessage />
                                        {incidentTypeValue === 'otro' && <FormField control={form.control} name="incidentTypeOther" render={({ field }) => (<FormControl><Textarea {...field} placeholder="Especifique el tipo" /></FormControl>)} />}
                                    </FormItem>
                                )}/>
                             </div>
                        </div>
                        <div className="md:col-span-2">
                            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción detallada de la incidencia</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        </div>
                    </div>
                    <DialogFooter className="p-6 border-t bg-muted/20">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Crear Incidencia
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>


      {isLoading && (
        <Card className="p-8 flex flex-col items-center justify-center gap-4 text-primary animate-in fade-in-50 duration-500">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className="font-semibold text-lg">Analizando incidentes...</p>
            <p className="text-sm text-muted-foreground">La IA está procesando la información. Esto puede tardar unos segundos.</p>
        </Card>
      )}

       {error && (
         <Card className="p-8 flex flex-col items-center justify-center gap-4 text-destructive animate-in fade-in-50 duration-500 bg-destructive/10 border-destructive">
            <AlertTriangle className="h-12 w-12" />
            <p className="font-semibold text-lg">Error en el Análisis</p>
            <p className="text-sm text-destructive/80">{error}</p>
        </Card>
       )}

      {analysisResult && (
        <div className="mt-8 font-body animate-in fade-in-50 duration-500 bg-gray-200 p-4">
             <div className="download-button-container fixed bottom-8 right-8 z-50">
                <Button onClick={handleDownloadPdf} size="lg" className="rounded-full shadow-2xl bg-primary hover:bg-primary/90">
                    <Download className="mr-2 h-5 w-5" /> Descargar
                </Button>
            </div>
            <div id="pdf-content" ref={reportRef} className="max-w-4xl mx-auto bg-white">
                <div className="p-8">
                    <header className="flex justify-between items-start pb-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-gray-800 tracking-wider">INFORME DE ANÁLISIS DE INCIDENTES</h1>
                            <p className="text-sm text-gray-500">Generado por IA el: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <PgaReportLogo className="h-20 w-auto flex-shrink-0" />
                    </header>
                    <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-center font-semibold text-lg mb-8">
                        Portal de Gestión Administrativa (PGA)
                    </div>

                    <main className="mt-8 space-y-6">
                        <InfoCard title="Resumen Ejecutivo" icon={ChevronsRight}>
                            <p>{analysisResult.executiveSummary}</p>
                        </InfoCard>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard title="Análisis de Causa Raíz" icon={Lightbulb}>
                                <ul className="space-y-2 list-disc pl-5">
                                    {analysisResult.rootCauseAnalysis.map((cause, i) => <li key={i}>{cause}</li>)}
                                </ul>
                            </InfoCard>
                            <InfoCard title="Soluciones a Corto Plazo" icon={ShieldCheck}>
                                <ul className="space-y-2 list-disc pl-5">
                                    {analysisResult.shortTermFixes.map((fix, i) => <li key={i}>{fix}</li>)}
                                </ul>
                            </InfoCard>
                        </div>

                        <InfoCard title="Recomendaciones Estratégicas a Largo Plazo" icon={Sparkles}>
                             <ul className="space-y-2 list-disc pl-5">
                                {analysisResult.longTermRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </InfoCard>
                    </main>

                    <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                        Confidencial - Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC)
                    </footer>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default function IncidentAnalysisPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <IncidentAnalysisPageContent />
        </Suspense>
    )
}
