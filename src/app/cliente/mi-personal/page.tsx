
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, PlaneTakeoff, Users, FileHeart, BarChartHorizontalBig, Eye, Cake, Droplets, Ruler, HeartPulse, PhoneCall, Globe2, ShieldAlert, Pill, Building, Briefcase, User as UserIcon, Calendar, Hash, Printer, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

const personalStatsData = [
    { habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL', vigencia: '2025-12-31', cantidad: 15, estado: 'Vigente' },
    { habilitacion: 'MANEJADOR K-9', vigencia: '2024-09-01', cantidad: 8, estado: 'Por Vencer' },
    { habilitacion: 'SUPERVISOR AVSEC', vigencia: '2023-10-20', cantidad: 5, estado: 'Vencido' },
    { habilitacion: 'GERENTE AVSEC', vigencia: '2025-06-15', cantidad: 2, estado: 'Vigente' },
    { habilitacion: 'INSPECTOR AVSEC 1RA CAT', vigencia: '2024-08-25', cantidad: 12, estado: 'Por Vencer' },
];

const recomendacionesMedicasData = [
  { 
    id: '11857', 
    fecha: '09/07/2024', 
    actividad: 'Certificación y Re-certificación del Personal de Seguridad - Evaluación médica',
    personal: { cedula: '001-0634683-6', nombre: 'Odalis Pérez Félix' },
    recomendacion: 'Faltan: -AUDIOMETRIA Y -OFTALMOLIGIA / Resultado dentro de para metros por Audiometria, y Apto por Oftalmologia con Correccion',
    estado: 'Pendiente'
  },
  { 
    id: '11902', 
    fecha: '11/07/2024', 
    actividad: 'Evaluación médica periódica',
    personal: { cedula: '002-1234567-8', nombre: 'Juan Carlos Martínez' },
    recomendacion: 'Seguimiento por hipertensión arterial. Presentar resultados de monitoreo en 30 días.',
    estado: 'Pendiente'
  },
  { 
    id: '11754', 
    fecha: '05/07/2024', 
    actividad: 'Evaluación médica inicial',
    personal: { cedula: '003-8765432-1', nombre: 'Ana Sofía Gómez' },
    recomendacion: 'Se recomienda corrección visual para labores nocturnas. Apta con uso de lentes.',
    estado: 'Completado'
  },
];

type Personal = {
    id: string;
    foto: string;
    aiHint: string;
    nombre: string;
    cedula: string;
    habilitacion: string;
    estado: string;
    posicion: string;
    aeropuerto: string;
    tipoSangre: string;
    condicionFisica: string;
    medicamentoControlado: string;
    edad: number;
    estatura: string;
    contactoEmergencia: string;
    fechaNacimiento: string;
    nacionalidad: string;
};

const personalData: Personal[] = [
  { id: '12345', foto: 'https://placehold.co/100x100.png', aiHint: 'man portrait', nombre: 'Kendy A. Qualey', cedula: '001-1234567-8', habilitacion: 'INSPECTOR AVSEC 1RA CAT', estado: 'Activo', posicion: 'Inspector AVSEC 1ra Categoría', aeropuerto: 'Las Américas (SDQ)', tipoSangre: 'O+', condicionFisica: 'Ninguna reportada', medicamentoControlado: 'No', edad: 35, estatura: "5'11\"", contactoEmergencia: '(809) 123-4567 (Esposa)', fechaNacimiento: '1989-05-15', nacionalidad: 'Dominicana' },
  { id: '67890', foto: 'https://placehold.co/100x100.png', aiHint: 'woman portrait', nombre: 'María Rodríguez', cedula: '002-8765432-1', habilitacion: 'MANEJADOR K-9', estado: 'Activo', posicion: 'Manejador K-9', aeropuerto: 'Punta Cana (PUJ)', tipoSangre: 'A-', condicionFisica: 'Asma leve', medicamentoControlado: 'Inhalador (Salbutamol)', edad: 28, estatura: "5'6\"", contactoEmergencia: '(829) 987-6543 (Madre)', fechaNacimiento: '1996-02-20', nacionalidad: 'Dominicana' },
  { id: '11223', foto: 'https://placehold.co/100x100.png', aiHint: 'person face', nombre: 'Carlos Sánchez', cedula: '003-1122334-5', habilitacion: 'SUPERVISOR AVSEC', estado: 'Vencido', posicion: 'Supervisor de Seguridad', aeropuerto: 'Cibao (STI)', tipoSangre: 'B+', condicionFisica: 'Hipertensión', medicamentoControlado: 'Lisinopril', edad: 42, estatura: "6'0\"", contactoEmergencia: '(809) 555-1212 (Hijo)', fechaNacimiento: '1982-11-30', nacionalidad: 'Dominicana' },
  { id: '44556', foto: 'https://placehold.co/100x100.png', aiHint: 'woman face smiling', nombre: 'Luisa Fernandez', cedula: '004-5566778-9', habilitacion: 'GERENTE AVSEC', estado: 'Activo', posicion: 'Gerente de Seguridad', aeropuerto: 'Oficinas Corporativas', tipoSangre: 'AB+', condicionFisica: 'Ninguna', medicamentoControlado: 'No', edad: 39, estatura: "5'4\"", contactoEmergencia: '(849) 111-2233 (Esposo)', fechaNacimiento: '1985-01-10', nacionalidad: 'Dominicana' },
  { id: '77889', foto: 'https://placehold.co/100x100.png', aiHint: 'serious man', nombre: 'Pedro Gomez', cedula: '005-9988776-5', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA', estado: 'Suspendido', posicion: 'Inspector de Seguridad Privada', aeropuerto: 'La Romana (LRM)', tipoSangre: 'O-', condicionFisica: 'Diabetes tipo 2', medicamentoControlado: 'Metformina', edad: 50, estatura: "5'9\"", contactoEmergencia: '(809) 888-9900 (Hermano)', fechaNacimiento: '1974-07-25', nacionalidad: 'Dominicana' },
  { id: '99001', foto: 'https://placehold.co/100x100.png', aiHint: 'woman professional', nombre: 'Ana Torres', cedula: '006-1231231-2', habilitacion: 'INSPECTOR AVSEC 1RA CAT', estado: 'Activo', posicion: 'Inspector AVSEC 1ra Categoría', aeropuerto: 'Las Américas (SDQ)', tipoSangre: 'A+', condicionFisica: 'Alergia al maní', medicamentoControlado: 'EpiPen (Autoinyector de epinefrina)', edad: 25, estatura: "5'8\"", contactoEmergencia: '(809) 234-5678 (Padre)', fechaNacimiento: '1999-03-12', nacionalidad: 'Dominicana' },
  { id: '22334', foto: 'https://placehold.co/100x100.png', aiHint: 'man smiling', nombre: 'Ricardo Solis', cedula: '007-4564564-5', habilitacion: 'MANEJADOR K-9', estado: 'Activo', posicion: 'Manejador K-9', aeropuerto: 'Punta Cana (PUJ)', tipoSangre: 'B-', condicionFisica: 'Ninguna', medicamentoControlado: 'No', edad: 31, estatura: "6'1\"", contactoEmergencia: '(829) 345-6789 (Amigo)', fechaNacimiento: '1993-09-05', nacionalidad: 'Venezolana' },
  { id: '55667', foto: 'https://placehold.co/100x100.png', aiHint: 'professional woman', nombre: 'Sofía Castro', cedula: '008-7897897-8', habilitacion: 'SUPERVISOR AVSEC', estado: 'Activo', posicion: 'Supervisor de Seguridad', aeropuerto: 'Puerto Plata (POP)', tipoSangre: 'O+', condicionFisica: 'Miopía', medicamentoControlado: 'Lentes de contacto', edad: 33, estatura: "5'7\"", contactoEmergencia: '(809) 456-7890 (Tía)', fechaNacimiento: '1991-12-01', nacionalidad: 'Dominicana' },
  { id: '88990', foto: 'https://placehold.co/100x100.png', aiHint: 'man face professional', nombre: 'David Luna', cedula: '009-0101010-1', habilitacion: 'INSPECTOR DE SEGURIDAD PRIVADA', estado: 'Inactivo', posicion: 'Inspector de Seguridad Privada', aeropuerto: 'Cibao (STI)', tipoSangre: 'A+', condicionFisica: 'Ninguna', medicamentoControlado: 'No', edad: 29, estatura: "5'10\"", contactoEmergencia: '(849) 567-8901 (Roommate)', fechaNacimiento: '1995-08-18', nacionalidad: 'Colombiana' },
  { id: '11235', foto: 'https://placehold.co/100x100.png', aiHint: 'woman portrait professional', nombre: 'Elena Rojas', cedula: '010-1123581-3', habilitacion: 'GERENTE AVSEC', estado: 'Activo', posicion: 'Gerente de Seguridad', aeropuerto: 'Oficinas Corporativas', tipoSangre: 'AB-', condicionFisica: 'Ninguna', medicamentoControlado: 'No', edad: 45, estatura: "5'5\"", contactoEmergencia: '(809) 678-9012 (Asistente)', fechaNacimiento: '1979-04-22', nacionalidad: 'Dominicana' },
];

const getConditionBadge = (condition: string) => {
    switch (condition) {
        case 'Vigente': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">{condition}</Badge>;
        case 'Vencido': return <Badge variant="destructive">{condition}</Badge>;
        case 'Por Vencer': return <Badge variant="destructive" className="bg-orange-500/80 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300">{condition}</Badge>;
        default: return <Badge variant="outline">{condition}</Badge>;
    }
};

const getRecomendacionBadge = (estado: string) => {
    switch (estado) {
        case 'Pendiente': return <Badge variant="destructive" className="bg-orange-500/80 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300">{estado}</Badge>;
        case 'Completado': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">{estado}</Badge>;
        default: return <Badge variant="outline">{estado}</Badge>;
    }
};

const getPersonalEstadoBadge = (estado: string) => {
    switch (estado) {
        case 'Activo': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">{estado}</Badge>;
        case 'Vencido': return <Badge variant="destructive">{estado}</Badge>;
        case 'Suspendido': return <Badge variant="destructive" className="bg-yellow-500/80 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300">{estado}</Badge>;
        case 'Inactivo': return <Badge variant="outline">{estado}</Badge>;
        default: return <Badge variant="outline">{estado}</Badge>;
    }
};

const InfoDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    </div>
);

export default function MiPersonalPage() {
    const [filters, setFilters] = React.useState({
        id: '',
        datosPersonales: '',
        habilitacion: '',
        estado: ''
    });
    const [selectedPerson, setSelectedPerson] = React.useState<Personal | null>(null);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handlePrintCV = (person: Personal) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const cvHtml = `
            <html>
              <head>
                <title>CV - ${person.nombre}</title>
                <style>
                    body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 800px; margin: 40px auto; background: #fff; box-shadow: 0 0 20px rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden; }
                    .header { background: #4a5568; color: white; padding: 40px; text-align: center; }
                    .header img { width: 150px; height: 150px; border-radius: 50%; border: 5px solid white; object-fit: cover; }
                    .header h1 { margin: 10px 0 0; font-size: 2.5em; }
                    .header h2 { margin: 0; font-size: 1.2em; font-weight: 300; }
                    .main { display: flex; }
                    .left-panel { width: 35%; background: #e2e8f0; padding: 20px; }
                    .right-panel { width: 65%; padding: 20px; }
                    h3 { color: #2c5282; border-bottom: 2px solid #2c5282; padding-bottom: 5px; margin-top: 0; margin-bottom: 20px; font-size: 1.2em;}
                    .info-item { margin-bottom: 15px; }
                    .info-item label { font-weight: bold; display: block; margin-bottom: 3px; color: #4a5568; font-size: 0.9em; }
                    .info-item span { font-size: 1em; }
                    @media print {
                      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
                      .container { box-shadow: none; margin: 0; border-radius: 0; max-width: 100%; }
                    }
                </style>
              </head>
              <body>
                <div class="container">
                    <div class="header">
                        <img src="${person.foto}" alt="${person.nombre}">
                        <h1>${person.nombre}</h1>
                        <h2>${person.posicion}</h2>
                    </div>
                    <div class="main">
                        <div class="left-panel">
                            <h3>Contacto</h3>
                            <div class="info-item"><label>Emergencia</label><span>${person.contactoEmergencia}</span></div>
                            <h3>Personal</h3>
                            <div class="info-item"><label>Cédula</label><span>${person.cedula}</span></div>
                            <div class="info-item"><label>Nacimiento</label><span>${person.fechaNacimiento} (${person.edad} años)</span></div>
                            <div class="info-item"><label>Nacionalidad</label><span>${person.nacionalidad}</span></div>
                            <div class="info-item"><label>Estatura</label><span>${person.estatura}</span></div>
                        </div>
                        <div class="right-panel">
                            <h3>Información Laboral</h3>
                            <div class="info-item"><label>Aeropuerto</label><span>${person.aeropuerto}</span></div>
                            <div class="info-item"><label>Habilitación</label><span>${person.habilitacion}</span></div>
                            <div class="info-item"><label>Condición Actual</label><span>${person.estado}</span></div>
                            <h3>Información Médica</h3>
                            <div class="info-item"><label>Tipo de Sangre</label><span>${person.tipoSangre}</span></div>
                            <div class="info-item"><label>Condición Física</label><span>${person.condicionFisica}</span></div>
                            <div class="info-item"><label>Medicamento Controlado</label><span>${person.medicamentoControlado}</span></div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    }
                </script>
              </body>
            </html>
          `;
          printWindow.document.write(cvHtml);
          printWindow.document.close();
        }
    };

    const filteredPersonal = React.useMemo(() => {
        return personalData.filter(item => {
            const searchId = filters.id.toLowerCase();
            const searchDatos = filters.datosPersonales.toLowerCase();
            const searchHabilitacion = filters.habilitacion.toLowerCase();
            const searchEstado = filters.estado.toLowerCase();

            return (
                (item.id.toLowerCase().includes(searchId) || item.cedula.toLowerCase().includes(searchId)) &&
                item.nombre.toLowerCase().includes(searchDatos) &&
                item.habilitacion.toLowerCase().includes(searchHabilitacion) &&
                item.estado.toLowerCase().includes(searchEstado)
            );
        });
    }, [filters]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Mi Personal</h1>
                <p className="mt-1 text-muted-foreground">Gestione las habilitaciones de seguridad de su personal.</p>
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
                            <Link href="/cliente/mi-personal/registro">
                                Registrar Personal <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                         </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Main Content Card */}
            <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 rounded-2xl">
                 <CardContent className="p-0">
                    <Tabs defaultValue="mi-personal" className="w-full">
                        <div className="border-b px-4">
                             <TabsList>
                                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
                                <TabsTrigger value="recomendaciones">Recomendaciones Médicas</TabsTrigger>
                                <TabsTrigger value="mi-personal">Mi Personal</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="estadisticas" className="p-4 sm:p-6">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="bg-muted/50 p-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BarChartHorizontalBig className="h-5 w-5 text-primary" />
                                            Personal de seguridad
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="border-t">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Habilitación</TableHead>
                                                        <TableHead>Vigencia</TableHead>
                                                        <TableHead className="text-center">Cantidad</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {personalStatsData.map((item, index) => (
                                                        <TableRow key={index} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                            <TableCell className="font-medium max-w-sm">{item.habilitacion}</TableCell>
                                                            <TableCell>{item.vigencia}</TableCell>
                                                            <TableCell className="text-center font-bold text-lg">{item.cantidad}</TableCell>
                                                            <TableCell>{getConditionBadge(item.estado)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                         <TabsContent value="recomendaciones" className="p-4 sm:p-6">
                            <Card>
                                <CardHeader className="bg-muted/50 p-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <FileHeart className="h-5 w-5 text-primary" />
                                        Historial de Recomendaciones Médicas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead>Actividad</TableHead>
                                                    <TableHead>Personal</TableHead>
                                                    <TableHead>Recomendación</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                    <TableHead className="text-right w-[80px]">Acción</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recomendacionesMedicasData.map((item) => (
                                                    <TableRow key={item.id} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                        <TableCell className="font-mono align-top">{item.id}</TableCell>
                                                        <TableCell className="align-top text-muted-foreground">{item.fecha}</TableCell>
                                                        <TableCell className="align-top max-w-xs">{item.actividad}</TableCell>
                                                        <TableCell className="align-top text-xs text-muted-foreground">
                                                            <p className="font-semibold text-foreground">{item.personal.nombre}</p>
                                                            <p>Cédula: {item.personal.cedula}</p>
                                                        </TableCell>
                                                        <TableCell className="align-top max-w-sm text-muted-foreground">{item.recomendacion}</TableCell>
                                                        <TableCell className="align-top">{getRecomendacionBadge(item.estado)}</TableCell>
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
                                </CardContent>
                            </Card>
                         </TabsContent>
                         <TabsContent value="mi-personal" className="p-4 sm:p-6">
                            <Card>
                                <CardHeader className="bg-muted/50 p-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        Listado de Personal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/20">
                                                    <TableHead className="p-2 w-[150px]"><div className="pl-2">ID / Cédula</div><Input name="id" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.id}/></TableHead>
                                                    <TableHead className="p-2 min-w-[250px]"><div className="pl-2">Datos personales</div><Input name="datosPersonales" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.datosPersonales}/></TableHead>
                                                    <TableHead className="p-2 min-w-[300px]"><div className="pl-2">Habilitación</div><Input name="habilitacion" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.habilitacion}/></TableHead>
                                                    <TableHead className="p-2 w-[150px]"><div className="pl-2">Estado</div><Input name="estado" placeholder="Filtrar..." className="h-8 mt-1" onChange={handleFilterChange} value={filters.estado}/></TableHead>
                                                    <TableHead className="p-2 w-[100px] text-right"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredPersonal.map((item) => (
                                                    <TableRow key={item.id} className="transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                                                        <TableCell className="font-mono">{item.id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10 border">
                                                                    <AvatarImage src={item.foto} alt={item.nombre} data-ai-hint={item.aiHint} />
                                                                    <AvatarFallback>{item.nombre.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-semibold text-foreground">{item.nombre}</p>
                                                                    <p className="text-xs text-muted-foreground">Cédula: {item.cedula}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.habilitacion}</TableCell>
                                                        <TableCell>{getPersonalEstadoBadge(item.estado)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary hover:bg-primary/10" onClick={() => setSelectedPerson(item)}>
                                                                <Eye className="h-5 w-5" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                         </TabsContent>
                    </Tabs>
                 </CardContent>
            </Card>

            {selectedPerson && (
                <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
                    <DialogContent className="sm:max-w-4xl p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-card text-card-foreground">
                        <div className="grid md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                            {/* Left Panel */}
                            <div className="p-8 bg-muted/30 flex flex-col items-center justify-center text-center">
                                <Avatar className="h-40 w-40 border-4 border-white shadow-lg mb-4">
                                    <AvatarImage src={selectedPerson.foto} alt={selectedPerson.nombre} data-ai-hint={selectedPerson.aiHint} />
                                    <AvatarFallback className="text-4xl">{selectedPerson.nombre.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">{selectedPerson.nombre}</DialogTitle>
                                    <DialogDescription>{selectedPerson.posicion}</DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                                    <p>ID: <span className="font-mono text-foreground">{selectedPerson.id}</span></p>
                                    <p>Cédula: <span className="font-mono text-foreground">{selectedPerson.cedula}</span></p>
                                </div>
                            </div>
                            
                            {/* Right Panel */}
                            <div className="p-8 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold mb-6">Información Detallada</h3>
                                        {getPersonalEstadoBadge(selectedPerson.estado)}
                                    </div>
                                    
                                    <Tabs defaultValue="personal">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="personal">Personal</TabsTrigger>
                                            <TabsTrigger value="medica">Médica</TabsTrigger>
                                            <TabsTrigger value="laboral">Laboral</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="personal" className="space-y-6">
                                            <InfoDetail icon={Cake} label="Fecha de Nacimiento" value={`${selectedPerson.fechaNacimiento} (${selectedPerson.edad} años)`} />
                                            <InfoDetail icon={Ruler} label="Estatura" value={selectedPerson.estatura} />
                                            <InfoDetail icon={Globe2} label="Nacionalidad" value={selectedPerson.nacionalidad} />
                                            <InfoDetail icon={PhoneCall} label="Contacto de Emergencia" value={selectedPerson.contactoEmergencia} />
                                        </TabsContent>

                                        <TabsContent value="medica" className="space-y-6">
                                            <InfoDetail icon={Droplets} label="Tipo de Sangre" value={selectedPerson.tipoSangre} />
                                            <InfoDetail icon={HeartPulse} label="Condición Física" value={selectedPerson.condicionFisica} />
                                            <InfoDetail icon={Pill} label="Medicamento Controlado" value={selectedPerson.medicamentoControlado} />
                                        </TabsContent>
                                        
                                         <TabsContent value="laboral" className="space-y-6">
                                            <InfoDetail icon={Building} label="Aeropuerto" value={selectedPerson.aeropuerto} />
                                            <InfoDetail icon={Briefcase} label="Habilitación" value={selectedPerson.habilitacion} />
                                            <InfoDetail icon={ShieldAlert} label="Condición Actual" value={selectedPerson.estado} />
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="p-6 border-t bg-muted/20 flex justify-end gap-2">
                             <Button variant="outline" onClick={() => selectedPerson && handlePrintCV(selectedPerson)}>
                                <Printer className="mr-2 h-4 w-4"/>
                                Imprimir CV
                            </Button>
                            <Button asChild>
                                <Link href={`/cliente/mi-personal/registro?id=${selectedPerson.id}`}>
                                    <Pencil className="mr-2 h-4 w-4"/>
                                    Editar Perfil
                                </Link>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
