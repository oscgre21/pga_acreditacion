
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlaneTakeoff, Eye, CheckCircle, XCircle, Clock, MinusCircle, FileText, MessageSquare, Paperclip, Printer, ChevronDown, ChevronLeft, Download, Loader2 as LoaderIcon, Circle as CircleIcon, Circle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

// DATA MOCKS
const discrepanciasData = [
    { anio: 2024, tramite: 'Certificación del personal de seguridad privada de la aviación civil; Habilitación: Inspector De Seguridad Privada De La Aviación Civil', tema: 'Documentación incompleta', cantidad: 1, estado: 'Abierta' },
    { anio: 2021, tramite: 'Programa de Seguridad de Explotadores de Aeronaves', tema: 'Documentación', cantidad: 2, estado: 'Cerrada' },
    { anio: 2023, tramite: 'Revisión y Aprobación de Programas', tema: 'Falta de pago', cantidad: 1, estado: 'Abierta' },
    { anio: 2022, tramite: 'Certificación y Renovación de Certificado', tema: 'Información incorrecta', cantidad: 3, estado: 'Cerrada' },
];

const discrepanciasDetalladasData = [
    { 
        id: 'disc-1',
        tramiteId: '12022',
        solicitante: 'LONGPORT AVIATION SECURITY, S.R.L',
        personal: 'WILKENIA EDOUARD FILMONOR',
        tramite: 'Certificación del personal de seguridad privada de la aviación civil', 
        tema: 'Documentación incompleta', 
        estado: 'Abierta',
        fechaReporte: '08-07-2024',
        hallazgos: [
            { id: 'h1', descripcion: 'Falta documento de Audiometría.', fecha: '08-07-2024', reportadoPor: 'Ana Garcia' },
            { id: 'h2', descripcion: 'Falta documento de Oftalmología.', fecha: '08-07-2024', reportadoPor: 'Ana Garcia' },
        ],
        comunicaciones: [
            { id: 'c1', fecha: '09-07-2024 10:30 AM', tipo: 'Correo Electrónico', resumen: 'Se notificó al cliente sobre la documentación faltante. A la espera de respuesta.', usuario: 'Juan Perez' },
            { id: 'c2', fecha: '10-07-2024 02:15 PM', tipo: 'Llamada Telefónica', resumen: 'Cliente confirma recepción del correo y se compromete a enviar los documentos en 48 horas.', usuario: 'Juan Perez' },
        ],
        documentos: [
            { id: 'd1', nombre: 'Solicitud_Inicial_12022.pdf', url: '#' },
            { id: 'd2', nombre: 'Reporte_Discrepancia_Disc-1.pdf', url: '#' },
        ]
    },
    { 
        id: 'disc-2',
        tramiteId: '9608',
        solicitante: 'TrackAviation Security S.R.L',
        personal: 'Carlos Sanchez',
        tramite: 'Revisión y Aprobación de Programas', 
        tema: 'Falta de pago', 
        estado: 'Abierta',
        fechaReporte: '15-06-2024',
        hallazgos: [
            { id: 'h3', descripcion: 'El pago de la tasa de revisión no ha sido registrado en el sistema.', fecha: '15-06-2024', reportadoPor: 'Maria Rodriguez' },
        ],
        comunicaciones: [
             { id: 'c3', fecha: '16-06-2024 09:00 AM', tipo: 'Correo Electrónico', resumen: 'Se envió recordatorio de pago al cliente.', usuario: 'Luis Gomez' },
        ],
        documentos: [
            { id: 'd3', nombre: 'Solicitud_Revision_9608.pdf', url: '#' },
        ]
    },
];

const mapAdminToClientData = (adminData: any[]) => {
    const adminStatusMap: { [key: string]: string } = {
        "Discrepancias": "En proceso con hallazgos",
        "En proceso": "En proceso",
        "Aprobado": "Licencia lista",
        "Sin validación": "En proceso con hallazgos",
        "Abierto": "En proceso",
        "Reprobado": "En proceso con hallazgos",
        "Concluido": "Licencia lista",
    };

    const adminHallazgosMap: { [key: string]: string } = {
        "Discrepancias": "Tiene discrepancias. Revise la sección correspondiente.",
        "Reprobado": "Trámite reprobado. Contacte a soporte.",
        "Sin validación": "Requiere validación inicial.",
    };

    const getProgressHistory = (progress: number) => {
        const steps = ['Recepción', 'Análisis', 'Evaluación', 'Emisión', 'Entrega'];
        const currentStepIndex = Math.floor(progress / 20) -1;
        
        let currentStepName = 'Recepción';
        if (progress > 0) {
            const stepIndex = Math.floor((progress - 1) / 20);
            currentStepName = steps[stepIndex] || 'Entrega';
        }

        return {
            currentStep: currentStepName,
            steps: steps,
            history: steps.map((step, index) => {
                let status = 'pending';
                if (index < currentStepIndex) {
                    status = 'completed';
                } else if (index === currentStepIndex) {
                    status = 'in-progress';
                }
                return {
                    step,
                    status,
                    date: status !== 'pending' ? new Date().toLocaleDateString('es-ES') : null,
                    user: status !== 'pending' ? 'Sistema PGA' : null,
                };
            }),
        };
    };

    return adminData.map(item => ({
        id: item.id,
        tramite: item.proceso,
        detalles: {
            fecha: item.ingreso,
            proceso: item.subproceso,
            personal: item.para,
            identificacion: item.referencia,
        },
        estado: adminStatusMap[item.status] || "En proceso",
        hallazgos: item.hasWarning ? adminHallazgosMap[item.status] || "Sin hallazgos abiertos" : "Sin hallazgos abiertos",
        progress: getProgressHistory(item.progress),
    }));
};

const adminTramites = [
  { id: "12022", hasWarning: true, solicitante: "LONGPORT AVIATION SECURITY, S.R.L", para: "WILKENIA EDOUARD FILMONOR", asignadoA: "MDPP", categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL", proceso: "Certificación del personal de seguridad privada de la aviación civil", referencia: "40236591208", subproceso: "Recepción formulario de datos personales", ejecutores: [ "AMAURIS MERCEDES CASTILLO", "KENDY ALEJANDRO QUALEY TAVERAS", "MICHEL ALT. MARIANO QUEZADA" ], validadores: [ "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA", "YISSEL MARCIAL DE JESUS" ], ingreso: "01/08/2024 10:00 AM", vence: "02/08/2024 10:00 AM", progress: 75, status: "Discrepancias" },
  { id: "12023", hasWarning: false, solicitante: "SWISSPORT", para: "JUAN PEREZ", asignadoA: "MDST", categoria: "SUPERVISOR DE SEGURIDAD", proceso: "Renovación de carnet", referencia: "123456789", subproceso: "Entrega de documentos", ejecutores: ["MARIA RODRIGUEZ", "PEDRO GOMEZ"], validadores: ["ANA LOPEZ"], ingreso: "02/08/2024 11:30 AM", vence: "03/08/2024 11:30 AM", progress: 40, status: "En proceso" },
  { id: "12024", hasWarning: false, solicitante: "AERODOM", para: "CARLOS SANCHEZ", asignadoA: "MDLR", categoria: "OFICIAL DE SEGURIDAD", proceso: "Certificación inicial", referencia: "987654321", subproceso: "Toma de fotografía", ejecutores: ["LUISA FERNANDEZ", "JORGE MARTINEZ"], validadores: ["MIGUEL CASTRO"], ingreso: "03/08/2024 09:00 AM", vence: "04/08/2024 09:00 AM", progress: 90, status: "Aprobado" },
  { id: "12025", hasWarning: true, solicitante: "Fauget Cafe", para: "CLAUDIA STORE", asignadoA: "MDCY", categoria: "ACCESSORIES", proceso: "Proceso de Certificación", referencia: "ID-2530", subproceso: "Recepción de formulario", ejecutores: ["CHIDI BARBER"], validadores: ["CAHAYA DEWI"], ingreso: "26/06/2025 09:00 AM", vence: "28/06/2025 09:00 AM", progress: 25, status: "Sin validación" },
  { id: "12026", hasWarning: false, solicitante: "Servicios Aereos", para: "EMPRESA XYZ", asignadoA: "MDPP", categoria: "Transporte Carga", proceso: "Permiso de acceso a rampa", referencia: "789012345", subproceso: "Validación de seguridad", ejecutores: ["ROBERTO DIAZ", "SONIA PEREZ"], validadores: ["CARLOS MENDEZ"], ingreso: "05/08/2024 14:00 PM", vence: "06/08/2024 14:00 PM", progress: 60, status: "En proceso" },
  { id: "10708", hasWarning: false, solicitante: "SKY HIGH AVIATION SERVICE", para: "JEISON A. UBEN", asignadoA: "MDSD", categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL", proceso: "Re-impresión de licencia por cambio de compañía del Personal de Seguridad de la Aviación Civil", referencia: "40212743062", subproceso: "Recepción de solicitud", ejecutores: [ "KENDY ALEJANDRO QUALEY TAVERAS", "RAMON ANEURY SUGILIO VIRGEN", "REYES GONZALEZ MARTINEZ" ], validadores: [ "NOELIA ALEXANDRA DIAZ AMPARO", "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA" ], ingreso: "29/12/2023 12:10 PM", vence: "03/01/2024 12:10 PM", progress: 60, status: "Abierto" },
  { id: "10707", hasWarning: false, solicitante: "SKY HIGH AVIATION SERVICE", para: "BRYAN MATEO MORETA", asignadoA: "MDSD", categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL", proceso: "Re-impresión de licencia por cambio de compañía del Personal de Seguridad Privada de la Aviación Civil", referencia: "40235624893", subproceso: "Recepción de solicitud", ejecutores: [ "KENDY ALEJANDRO QUALEY TAVERAS", "RAMON ANEURY SUGILIO VIRGEN", "REYES GONZALEZ MARTINEZ" ], validadores: [ "NOELIA ALEXANDRA DIAZ AMPARO", "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA" ], ingreso: "03/01/2024 11:34 AM", vence: "03/01/2024 12:10 PM", progress: 20, status: "Abierto" },
  { id: "10706", hasWarning: true, solicitante: "LONGPORT AVIATION SECURITY, S.R.L", para: "FRANCISCO J. BERAS M.", asignadoA: "MDSD", categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL", proceso: "Re-Certificación del personal de seguridad privada de la aviación civil", referencia: "40225166806", subproceso: "Verificación de antecedentes", ejecutores: [ "AMAURIS MERCEDES CASTILLO", "JOAN CARLOS MONTAÑO TAPIA", "JUAN FRANCISCO MENDEZ LOPEZ", "KENDY ALEJANDRO QUALEY TAVERAS", "MICHEL ALT. MARIANO QUEZADA", "RAUDIS DE LOS REYES PEREZ GUZMAN" ], validadores: [ "HENRY ANTONIO MORILLO BIDO", "ROBINSON ACOSTA PEÑA", "STARLYN A. REYES ZAYAS", "VICTOR RONALD BARETT CASTILLO", "WASCAR BIENVENIDO CASTRO GARCIA" ], ingreso: "30/12/2023 10:13 AM", vence: "03/01/2024 10:13 AM", progress: 0, status: "Reprobado" },
  { id: "10705", hasWarning: false, solicitante: "AERODOM", para: "N/A", asignadoA: "MDPC", categoria: "ARRENDATARIOS EN AEROPUERTO", proceso: "Certificación inicial de arrendatario", referencia: "CERT-AERO-001", subproceso: "Entrega de documentos legales", ejecutores: ["MARIA GOMEZ"], validadores: ["JUAN CASTILLO"], ingreso: "01/02/2024 09:00 AM", vence: "15/02/2024 05:00 PM", progress: 95, status: "Concluido" },
  { id: "10704", hasWarning: false, solicitante: "SWISSPORT", para: "CARLOS PEREZ", asignadoA: "MDLR", categoria: "SUPERVISOR AVSEC", proceso: "Re-certificación de supervisor", referencia: "REC-SW-056", subproceso: "Examen práctico", ejecutores: ["LUISA FERNANDEZ", "PEDRO MARTINEZ"], validadores: ["ANA RODRIGUEZ"], ingreso: "10/01/2024 08:30 AM", vence: "12/01/2024 08:30 AM", progress: 100, status: "Concluido" },
];

const resumenProcesosData = mapAdminToClientData(adminTramites);

const evaluacionesPlanificadasData = [
    { id: 'EV-001', fechaPresentacion: '15-08-2024 09:00', tramite: 'Certificación Inicial AVSEC', datosPersonales: { nombre: 'Laura Gómez', identificacion: '001-1234567-8' }, categoriaEmitir: 'Inspector AVSEC', lugar: 'Sede Central - Aula 1' },
    { id: 'EV-002', fechaPresentacion: '15-08-2024 11:00', tramite: 'Re-certificación K-9', datosPersonales: { nombre: 'Marcos Díaz', identificacion: '001-8765432-1' }, categoriaEmitir: 'Manejador K-9', lugar: 'Unidad Canina' },
];

const resultadosEvaluacionesData = [
    { id: 'EVR-001', infoGeneral: { nombre: 'Laura Gómez', identificacion: '001-1234567-8' }, teorico: 'aprobado' as const, rTeorico: 'na' as const, practica: 'aprobado' as const, rPractica: 'na' as const, evaMedica: 'aprobado' as const, antecedentes: 'aprobado' as const, dopaje: 'aprobado' as const, evaPsicologica: 'aprobado' as const, fechaCertificacion: '20-08-2024', fechaVencimiento: '20-08-2026', condicion: 'Vigente' },
];


// UTILITY FUNCTIONS & COMPONENTS
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Abierta': return <Badge variant="destructive">Abierta</Badge>;
        case 'Cerrada': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">Cerrada</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const getProcessStatusBadge = (status: string) => {
    switch (status) {
        case 'En proceso con hallazgos': return <Badge variant="destructive" className="bg-yellow-500/80 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300">En proceso con hallazgos</Badge>;
        case 'Licencia lista': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">Licencia lista</Badge>;
        case 'En proceso': return <Badge variant="secondary" className="bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">En proceso</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const EvaluationStatusIcon = ({ status }: { status: 'aprobado' | 'reprobado' | 'pendiente' | 'na' }) => {
    switch (status) {
        case 'aprobado': return <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />;
        case 'reprobado': return <XCircle className="h-6 w-6 text-destructive mx-auto" />;
        case 'pendiente': return <Clock className="h-6 w-6 text-yellow-500 mx-auto" />;
        case 'na': return <MinusCircle className="h-6 w-6 text-muted-foreground mx-auto" />;
        default: return null;
    }
};

const getConditionBadge = (condition: string) => {
    switch (condition) {
        case 'Vigente': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">Vigente</Badge>;
        case 'Vencido': return <Badge variant="destructive">Vencido</Badge>;
        case 'Por Vencer': return <Badge variant="destructive" className="bg-orange-500/80 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300">Por Vencer</Badge>;
        case 'En proceso': return <Badge variant="secondary" className="bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">En proceso</Badge>;
        case 'Reprobado': return <Badge variant="destructive" className="bg-red-700 text-white">Reprobado</Badge>;
        default: return <Badge variant="outline">{condition}</Badge>;
    }
};

const statusIcons = {
  completed: <CheckCircle className="h-6 w-6 text-green-500" />,
  'in-progress': <LoaderIcon className="h-6 w-6 text-blue-500 animate-spin" />,
  pending: <CircleIcon className="h-6 w-6 text-muted-foreground" />,
};

const TramiteProgressTimeline = ({ history, steps }: { history: any[], steps: string[] }) => {
    return (
        <div className="space-y-0">
            {steps.map((step, index) => {
                const event = history.find(h => h.step === step) || { status: 'pending', date: null, user: null };
                const isLast = index === steps.length - 1;
                const isActive = event.status === 'completed' || event.status === 'in-progress';
                
                return (
                    <div key={step} className="flex">
                        <div className="flex flex-col items-center mr-4">
                            <div>
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2",
                                    isActive ? "border-primary bg-primary/10" : "border-border bg-muted/50",
                                    event.status === 'completed' && "bg-green-100 border-green-500"
                                )}>
                                    {statusIcons[event.status as keyof typeof statusIcons]}
                                </div>
                            </div>
                            {!isLast && <div className={cn("w-px h-full", isActive ? "bg-primary" : "bg-border")}></div>}
                        </div>
                        <div className="pb-8 pt-1">
                            <p className={cn("font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>{step}</p>
                            {event.date && (
                                <p className="text-sm text-muted-foreground">
                                    {event.date} por <span className="font-medium text-foreground/80">{event.user}</span>
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const TramiteDetailView = ({ tramiteId }: { tramiteId: string }) => {
    const tramite = resumenProcesosData.find(t => t.id === tramiteId);

    if (!tramite) {
        notFound();
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in-50">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Detalle del Trámite</h1>
                    <p className="font-mono text-primary">{tramite.id}</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/cliente/mis-tramites"><ChevronLeft className="mr-2 h-4 w-4"/> Volver al listado</Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Línea de Tiempo</CardTitle>
                            <CardDescription>Progreso actual de su solicitud.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TramiteProgressTimeline history={tramite.progress.history} steps={tramite.progress.steps} />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Trámite</p>
                                <p>{tramite.tramite}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Estado Actual</p>
                                <div>{getProcessStatusBadge(tramite.estado)}</div>
                            </div>
                             {tramite.hallazgos && (
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">Hallazgos</p>
                                    <p className="text-destructive font-medium">{tramite.hallazgos}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">Solicitante</p>
                                <p>{tramite.detalles.personal} ({tramite.detalles.identificacion})</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Acciones</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Button><MessageSquare className="mr-2 h-4 w-4"/>Enviar Mensaje</Button>
                            <Button variant="secondary"><Download className="mr-2 h-4 w-4"/>Descargar Resumen</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

function MisTramitesPageContent() {
    const searchParams = useSearchParams();
    const [activeConditionFilter, setActiveConditionFilter] = React.useState('Todos');

    const filteredResultados = React.useMemo(() => {
        if (activeConditionFilter === 'Todos') {
            return resultadosEvaluacionesData;
        }
        return resultadosEvaluacionesData.filter(item => item.condicion === activeConditionFilter);
    }, [activeConditionFilter]);

    const tramiteId = searchParams.get('id');

    if (tramiteId) {
        return <TramiteDetailView tramiteId={tramiteId} />;
    }
    
    const conditionFilters = [
        { label: 'Todos', value: 'Todos', color: 'bg-primary text-primary-foreground hover:bg-primary/90' },
        { label: 'Vigente', value: 'Vigente', color: 'bg-green-600 hover:bg-green-700 text-white' },
        { label: 'Por Vencer', value: 'Por Vencer', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
        { label: 'En proceso', value: 'En proceso', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
        { label: 'Vencido', value: 'Vencido', color: 'bg-red-500 hover:bg-red-600 text-white' },
        { label: 'Reprobado', value: 'Reprobado', color: 'bg-red-700 hover:bg-red-800 text-white' },
    ];

    const getConditionCount = (condition: string) => {
        if (condition === 'Todos') return resultadosEvaluacionesData.length;
        return resultadosEvaluacionesData.filter(item => item.condicion === condition).length;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Mis Trámites</h1>
                <p className="mt-1 text-muted-foreground">Consulte el estado y los detalles de todas sus solicitudes.</p>
            </div>
            {/* Header Card */}
            <Card className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-400 p-6 text-white relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <TravelGoLogo />
                            <div>
                                <p className="text-sm font-light">Identificación: <span className="font-semibold">130677195</span></p>
                                <p className="text-lg font-bold">TrackAviation Security S.R.L</p>
                                <div className="flex items-center gap-x-6 mt-1">
                                    <p className="text-sm font-light">RNC: <span className="font-semibold">130-12345-6</span></p>
                                    <p className="text-sm font-light">Teléfono: <span className="font-semibold">(809) 555-1234</span></p>
                                </div>
                            </div>
                        </div>
                         <Button asChild className="bg-white/90 text-orange-600 hover:bg-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform duration-200">
                            <Link href="/cliente/solicitudes">
                                Nueva Solicitud <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                         </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Content Card */}
            <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 rounded-2xl">
                 <CardContent className="p-0">
                    <Tabs defaultValue="resumen" className="w-full">
                        <div className="border-b px-4">
                             <TabsList>
                                <TabsTrigger value="resumen">Resumen de procesos</TabsTrigger>
                                <TabsTrigger value="estadisticas">Estadísticas discrepancias</TabsTrigger>
                                <TabsTrigger value="evaluaciones">Evaluaciones del personal planificadas</TabsTrigger>
                                <TabsTrigger value="resultados">Resultados de evaluaciones</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="estadisticas" className="p-4 sm:p-6">
                            <Tabs defaultValue="por-tema" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 max-w-md">
                                    <TabsTrigger value="por-tema">Por tema</TabsTrigger>
                                    <TabsTrigger value="detallados">Detallados</TabsTrigger>
                                </TabsList>
                                <TabsContent value="por-tema">
                                    <div className="space-y-4">
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-muted/50">
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Año</TableHead>
                                                        <TableHead>Trámite</TableHead>
                                                        <TableHead>Tema</TableHead>
                                                        <TableHead className="w-[100px] text-center">Cantidad</TableHead>
                                                        <TableHead className="w-[120px]">Estado</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {discrepanciasData.map((item, index) => (
                                                        <TableRow key={index} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                            <TableCell className="font-medium">{item.anio}</TableCell>
                                                            <TableCell>{item.tramite}</TableCell>
                                                            <TableCell>{item.tema}</TableCell>
                                                            <TableCell className="text-center">{item.cantidad}</TableCell>
                                                            <TableCell>{getStatusBadge(item.estado)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </TabsContent>
                                 <TabsContent value="detallados">
                                    <Accordion type="single" collapsible className="w-full space-y-4">
                                        {discrepanciasDetalladasData.map((item) => (
                                            <AccordionItem value={item.id} key={item.id} className="border-b-0">
                                                <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 rounded-lg overflow-hidden">
                                                    <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50">
                                                        <div className="flex justify-between items-center w-full">
                                                            <div className="text-left">
                                                                <p className="font-bold text-primary">Trámite ID: {item.tramiteId}</p>
                                                                <p className="text-sm text-muted-foreground">{item.solicitante} - {item.personal}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                 <Badge variant={item.estado === 'Abierta' ? 'destructive' : 'secondary'}>{item.estado}</Badge>
                                                                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="p-6 bg-background/50">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-primary" />Hallazgos</h4>
                                                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                                    {item.hallazgos.map(h => <li key={h.id}><span className="font-semibold text-foreground">{h.descripcion}</span> (Reportado por: {h.reportadoPor} el {h.fecha})</li>)}
                                                                </ul>
                                                            </div>
                                                            <Separator />
                                                            <div>
                                                                <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><MessageSquare className="h-5 w-5 text-primary" />Historial de Comunicación</h4>
                                                                <div className="space-y-2 text-sm">
                                                                    {item.comunicaciones.map(c => (
                                                                        <p key={c.id} className="text-muted-foreground">
                                                                            <span className="font-semibold text-foreground">[{c.fecha} - {c.tipo}]</span> {c.resumen} <span className="italic">({c.usuario})</span>
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Separator />
                                                            <div>
                                                                <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><Paperclip className="h-5 w-5 text-primary" />Documentos Adjuntos</h4>
                                                                <div className="flex gap-4">
                                                                     {item.documentos.map(d => (
                                                                        <Button key={d.id} variant="outline" asChild><Link href={d.url}>{d.nombre}</Link></Button>
                                                                     ))}
                                                                </div>
                                                            </div>
                                                            <Separator />
                                                            <div className="flex justify-end">
                                                                 <Button><Printer className="mr-2 h-4 w-4"/> Imprimir PDF</Button>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </Card>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                 </TabsContent>
                            </Tabs>
                        </TabsContent>
                        <TabsContent value="resumen" className="p-4 sm:p-6">
                            <div className="space-y-4">
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[120px]">ID</TableHead>
                                                <TableHead>Trámite</TableHead>
                                                <TableHead>Detalles</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Hallazgos</TableHead>
                                                <TableHead className="text-right w-[80px]">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {resumenProcesosData.map((item) => (
                                                <TableRow key={item.id} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                    <TableCell className="font-medium align-top">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-primary font-bold">{item.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="align-top font-medium max-w-xs">{item.tramite}</TableCell>
                                                    <TableCell className="align-top text-xs text-muted-foreground max-w-sm">
                                                        <p className="text-foreground"><span className="font-semibold">Fecha:</span> {item.detalles.fecha}</p>
                                                        <p><span className="font-semibold">Proceso:</span> {item.detalles.proceso}</p>
                                                        {item.detalles.personal && (
                                                            <p><span className="font-semibold">Personal:</span> {item.detalles.personal}</p>
                                                        )}
                                                        {item.detalles.identificacion && (
                                                            <p><span className="font-semibold">ID:</span> {item.detalles.identificacion}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        {getProcessStatusBadge(item.estado)}
                                                    </TableCell>
                                                    <TableCell className="align-top text-destructive text-xs font-semibold max-w-xs">{item.hallazgos}</TableCell>
                                                     <TableCell className="text-right align-top">
                                                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full text-primary hover:bg-primary/10">
                                                            <Link href={`/cliente/mis-tramites?id=${item.id}`}>
                                                                <Eye className="h-5 w-5" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="evaluaciones" className="p-4 sm:p-6">
                            <div className="space-y-4">
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Fecha de presentación</TableHead>
                                                <TableHead>Trámite</TableHead>
                                                <TableHead>Datos personales</TableHead>
                                                <TableHead>Categoría a emitir</TableHead>
                                                <TableHead>Lugar</TableHead>
                                                <TableHead className="text-right w-[80px]">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {evaluacionesPlanificadasData.map((item, index) => (
                                                <TableRow key={index} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                    <TableCell className="font-medium align-top">{item.id}</TableCell>
                                                    <TableCell className="align-top">{item.fechaPresentacion}</TableCell>
                                                    <TableCell className="align-top max-w-xs">{item.tramite}</TableCell>
                                                    <TableCell className="align-top text-xs text-muted-foreground">
                                                        <p className="font-semibold text-foreground">{item.datosPersonales.nombre}</p>
                                                        <p>ID: {item.datosPersonales.identificacion}</p>
                                                    </TableCell>
                                                    <TableCell className="align-top max-w-xs">{item.categoriaEmitir}</TableCell>
                                                    <TableCell className="align-top">{item.lugar}</TableCell>
                                                    <TableCell className="text-right align-top">
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary hover:bg-primary/10">
                                                            <Eye className="h-5 w-5" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="resultados" className="p-4 sm:p-6">
                             <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-muted/30 rounded-lg">
                                    <p className="text-sm font-semibold text-muted-foreground pr-2">Filtrar por condición:</p>
                                    {conditionFilters.map(filter => {
                                        const count = getConditionCount(filter.value);
                                        if (count === 0 && filter.value !== 'Todos') return null;

                                        const isActive = activeConditionFilter === filter.value;

                                        return (
                                            <Button
                                                key={filter.value}
                                                onClick={() => setActiveConditionFilter(filter.value)}
                                                className={cn(
                                                    "group rounded-full h-9 px-4 text-sm font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2",
                                                    isActive
                                                        ? `${filter.color} ring-2 ring-offset-2 ring-primary/50`
                                                        : 'bg-background text-foreground hover:bg-muted'
                                                )}
                                            >
                                                {filter.label}
                                                <span className={cn(
                                                    "ml-2.5 text-xs font-bold px-2 py-0.5 rounded-full",
                                                    isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'
                                                )}>
                                                    {count}
                                                </span>
                                            </Button>
                                        )
                                    })}
                                </div>
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead className="min-w-[200px]">Información general</TableHead>
                                                <TableHead className="text-center">Teórico</TableHead>
                                                <TableHead className="text-center">R-Teórico</TableHead>
                                                <TableHead className="text-center">Práctica</TableHead>
                                                <TableHead className="text-center">R-Práctica</TableHead>
                                                <TableHead className="text-center">Eva-Médica</TableHead>
                                                <TableHead className="text-center">Antecedentes</TableHead>
                                                <TableHead className="text-center">Dopaje</TableHead>
                                                <TableHead className="text-center">Eva-Psicológica</TableHead>
                                                <TableHead>Fecha certificación</TableHead>
                                                <TableHead>Fecha vencimiento</TableHead>
                                                <TableHead>Condición</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredResultados.length > 0 ? (
                                                filteredResultados.map((item, index) => (
                                                    <TableRow key={index} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                        <TableCell className="font-medium align-top">{item.id}</TableCell>
                                                        <TableCell className="align-top text-xs text-muted-foreground">
                                                            <p className="font-semibold text-foreground">{item.infoGeneral.nombre}</p>
                                                            <p>ID: {item.infoGeneral.identificacion}</p>
                                                        </TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.teorico} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.rTeorico} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.practica} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.rPractica} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.evaMedica} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.antecedentes} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.dopaje} /></TableCell>
                                                        <TableCell className="align-middle"><EvaluationStatusIcon status={item.evaPsicologica} /></TableCell>
                                                        <TableCell className="align-top">{item.fechaCertificacion}</TableCell>
                                                        <TableCell className="align-top">{item.fechaVencimiento}</TableCell>
                                                        <TableCell className="align-top">{getConditionBadge(item.condicion)}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={13} className="h-24 text-center">
                                                        No se encontraron resultados para la condición seleccionada.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                 </CardContent>
            </Card>
        </div>
    );
}

export default function MisTramitesPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8"><LoaderIcon className="h-8 w-8 animate-spin" /></div>}>
            <MisTramitesPageContent />
        </Suspense>
    );
}
