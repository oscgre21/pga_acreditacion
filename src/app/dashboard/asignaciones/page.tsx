
"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation'
import { AlertTriangle, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';


// Combined and expanded data for a more complete list of "trámites"
const tramites = [
  // Data from dashboard page
  {
    id: "12022",
    hasWarning: true,
    solicitante: "LONGPORT AVIATION SECURITY, S.R.L",
    para: "WILKENIA EDOUARD FILMONOR",
    asignadoA: "MDPP",
    categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL",
    proceso: "Certificación del personal de seguridad privada de la aviación civil",
    referencia: "40236591208",
    subproceso: "Recepción formulario de datos personales",
    ejecutores: [ "AMAURIS MERCEDES CASTILLO", "KENDY ALEJANDRO QUALEY TAVERAS", "MICHEL ALT. MARIANO QUEZADA" ],
    validadores: [ "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA", "YISSEL MARCIAL DE JESUS" ],
    ingreso: "01/08/2024 10:00 AM",
    vence: "02/08/2024 10:00 AM",
    progress: 75,
    status: "Discrepancias"
  },
  {
    id: "12023",
    hasWarning: false,
    solicitante: "SWISSPORT",
    para: "JUAN PEREZ",
    asignadoA: "MDST",
    categoria: "SUPERVISOR DE SEGURIDAD",
    proceso: "Renovación de carnet",
    referencia: "123456789",
    subproceso: "Entrega de documentos",
    ejecutores: ["MARIA RODRIGUEZ", "PEDRO GOMEZ"],
    validadores: ["ANA LOPEZ"],
    ingreso: "02/08/2024 11:30 AM",
    vence: "03/08/2024 11:30 AM",
    progress: 40,
    status: "En proceso"
  },
  {
    id: "12024",
    hasWarning: false,
    solicitante: "AERODOM",
    para: "CARLOS SANCHEZ",
    asignadoA: "MDLR",
    categoria: "OFICIAL DE SEGURIDAD",
    proceso: "Certificación inicial",
    referencia: "987654321",
    subproceso: "Toma de fotografía",
    ejecutores: ["LUISA FERNANDEZ", "JORGE MARTINEZ"],
    validadores: ["MIGUEL CASTRO"],
    ingreso: "03/08/2024 09:00 AM",
    vence: "04/08/2024 09:00 AM",
    progress: 90,
    status: "Aprobado"
  },
  {
    id: "12025",
    hasWarning: true,
    solicitante: "Fauget Cafe",
    para: "CLAUDIA STORE",
    asignadoA: "MDCY",
    categoria: "ACCESSORIES",
    proceso: "Proceso de Certificación",
    referencia: "ID-2530",
    subproceso: "Recepción de formulario",
    ejecutores: ["CHIDI BARBER"],
    validadores: ["CAHAYA DEWI"],
    ingreso: "26/06/2025 09:00 AM",
    vence: "28/06/2025 09:00 AM",
    progress: 25,
    status: "Sin validación"
  },
  {
    id: "12026",
    hasWarning: false,
    solicitante: "Servicios Aereos",
    para: "EMPRESA XYZ",
    asignadoA: "MDPP",
    categoria: "Transporte Carga",
    proceso: "Permiso de acceso a rampa",
    referencia: "789012345",
    subproceso: "Validación de seguridad",
    ejecutores: ["ROBERTO DIAZ", "SONIA PEREZ"],
    validadores: ["CARLOS MENDEZ"],
    ingreso: "05/08/2024 14:00 PM",
    vence: "06/08/2024 14:00 PM",
    progress: 60,
    status: "En proceso"
  },
  {
    id: "10708",
    hasWarning: false,
    solicitante: "SKY HIGH AVIATION SERVICE",
    para: "JEISON A. UBEN",
    asignadoA: "MDSD",
    categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL",
    proceso: "Re-impresión de licencia por cambio de compañía del Personal de Seguridad de la Aviación Civil",
    referencia: "40212743062",
    subproceso: "Recepción de solicitud",
    ejecutores: [ "KENDY ALEJANDRO QUALEY TAVERAS", "RAMON ANEURY SUGILIO VIRGEN", "REYES GONZALEZ MARTINEZ" ],
    validadores: [ "NOELIA ALEXANDRA DIAZ AMPARO", "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA" ],
    ingreso: "29/12/2023 12:10 PM",
    vence: "03/01/2024 12:10 PM",
    progress: 60,
    status: "Abierto"
  },
  {
    id: "10707",
    hasWarning: false,
    solicitante: "SKY HIGH AVIATION SERVICE",
    para: "BRYAN MATEO MORETA",
    asignadoA: "MDSD",
    categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL",
    proceso: "Re-impresión de licencia por cambio de compañía del Personal de Seguridad de la Aviación Civil",
    referencia: "40235624893",
    subproceso: "Recepción de solicitud",
    ejecutores: [ "KENDY ALEJANDRO QUALEY TAVERAS", "RAMON ANEURY SUGILIO VIRGEN", "REYES GONZALEZ MARTINEZ" ],
    validadores: [ "NOELIA ALEXANDRA DIAZ AMPARO", "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA" ],
    ingreso: "03/01/2024 11:34 AM",
    vence: "03/01/2024 12:10 PM",
    progress: 20,
    status: "Abierto"
  },
  {
    id: "10706",
    hasWarning: true,
    solicitante: "LONGPORT AVIATION SECURITY, S.R.L",
    para: "FRANCISCO J. BERAS M.",
    asignadoA: "MDSD",
    categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL",
    proceso: "Re-Certificación del personal de seguridad privada de la aviación civil",
    referencia: "40225166806",
    subproceso: "Verificación de antecedentes",
    ejecutores: [ "AMAURIS MERCEDES CASTILLO", "JOAN CARLOS MONTAÑO TAPIA", "JUAN FRANCISCO MENDEZ LOPEZ", "KENDY ALEJANDRO QUALEY TAVERAS", "MICHEL ALT. MARIANO QUEZADA", "RAUDIS DE LOS REYES PEREZ GUZMAN" ],
    validadores: [ "HENRY ANTONIO MORILLO BIDO", "ROBINSON ACOSTA PEÑA", "STARLYN A. REYES ZAYAS", "VICTOR RONALD BARETT CASTILLO", "WASCAR BIENVENIDO CASTRO GARCIA" ],
    ingreso: "30/12/2023 10:13 AM",
    vence: "03/01/2024 10:13 AM",
    progress: 0,
    status: "Reprobado"
  },
   {
    id: "10705",
    hasWarning: false,
    solicitante: "AERODOM",
    para: "N/A",
    asignadoA: "MDPC",
    categoria: "ARRENDATARIOS EN AEROPUERTO",
    proceso: "Certificación inicial de arrendatario",
    referencia: "CERT-AERO-001",
    subproceso: "Entrega de documentos legales",
    ejecutores: ["MARIA GOMEZ"],
    validadores: ["JUAN CASTILLO"],
    ingreso: "01/02/2024 09:00 AM",
    vence: "15/02/2024 05:00 PM",
    progress: 95,
    status: "Concluido"
  },
  {
    id: "10704",
    hasWarning: false,
    solicitante: "SWISSPORT",
    para: "CARLOS PEREZ",
    asignadoA: "MDLR",
    categoria: "SUPERVISOR AVSEC",
    proceso: "Re-certificación de supervisor",
    referencia: "REC-SW-056",
    subproceso: "Examen práctico",
    ejecutores: ["LUISA FERNANDEZ", "PEDRO MARTINEZ"],
    validadores: ["ANA RODRIGUEZ"],
    ingreso: "10/01/2024 08:30 AM",
    vence: "12/01/2024 08:30 AM",
    progress: 100,
    status: "Concluido"
  },
];

const filters = [
  { label: "Todos", status: "Todos", bgClass: "bg-primary", textClass: "text-primary" },
  { label: "Abierto", status: "Abierto", bgClass: "bg-green-500", textClass: "text-green-500" },
  { label: "En proceso", status: "En proceso", bgClass: "bg-cyan-500", textClass: "text-cyan-500" },
  { label: "Sin validación", status: "Sin validación", bgClass: "bg-purple-500", textClass: "text-purple-500" },
  { label: "Concluido", status: "Concluido", bgClass: "bg-slate-500", textClass: "text-slate-500" },
  { label: "Aprobado", status: "Aprobado", bgClass: "bg-gray-800 dark:bg-gray-300", textClass: "text-gray-800 dark:text-gray-300" },
  { label: "Reprobado", status: "Reprobado", bgClass: "bg-red-500", textClass: "text-red-500" },
  { label: "Discrepancias", status: "Discrepancias", bgClass: "bg-yellow-500", textClass: "text-yellow-500" },
];

const statusColors: { [key: string]: string } = {
  Abierto: "border-l-green-400",
  "En proceso": "border-l-cyan-400",
  "Sin validación": "border-l-purple-400",
  Concluido: "border-l-slate-400",
  Aprobado: "border-l-gray-800 dark:border-l-gray-300",
  Reprobado: "border-l-red-400",
  Discrepancias: "border-l-yellow-400",
};

const FilterTag = ({ label, count, bgClass, textClass, isActive, onClick }: { label: string, count: number, bgClass: string, textClass: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full transform items-center overflow-hidden rounded-lg p-0 text-left shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive ? `${bgClass} text-white` : 'bg-card text-card-foreground'
      )}
    >
      <div className={cn(
        "flex h-full w-12 flex-shrink-0 flex-col items-center justify-center p-1 transition-colors duration-300",
        isActive ? 'bg-black/10' : 'bg-muted/30'
      )}>
        <p className={cn(
          "text-lg font-bold tracking-tighter",
          isActive ? 'text-white' : textClass
        )}>{count}</p>
        <p className={cn(
          "text-[8px] font-bold uppercase tracking-wider",
           isActive ? 'text-white/70' : 'text-muted-foreground'
           )}>Casos</p>
      </div>
      
      <div className="flex-grow px-2 py-1">
        <p className="text-xs font-semibold">{label}</p>
        <p className={cn(
          "text-[10px]",
          isActive ? 'text-white/80' : 'text-muted-foreground'
        )}>
          Filtrar por este estado
        </p>
      </div>
    </button>
  );
};

function AsignacionesPageComponent() {
  const [activeFilter, setActiveFilter] = React.useState("Todos");
  const searchParams = useSearchParams();
  const router = useRouter();
  const solicitanteFilter = searchParams.get('solicitante');

  const statusCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = { Todos: tramites.length };
    filters.forEach(filter => {
        if (filter.status !== 'Todos') {
            counts[filter.status] = tramites.filter(t => t.status === filter.status).length;
        }
    });
    return counts;
  }, []);

  const filteredTramites = React.useMemo(() => {
    let results = tramites;
    if (activeFilter !== "Todos") {
      results = results.filter((tramite) => tramite.status === activeFilter);
    }
    if (solicitanteFilter) {
      results = results.filter((tramite) => tramite.solicitante === solicitanteFilter);
    }
    return results;
  }, [activeFilter, solicitanteFilter]);

  const clearFilter = () => {
    router.push('/dashboard/asignaciones');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-5 md:gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Asignaciones y Trámites
          </h1>
          <p className="text-muted-foreground">
            Listado completo de todos los trámites registrados en el sistema.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-3">
            {filters.map((filter) => (
                <FilterTag
                    key={filter.status}
                    label={filter.label}
                    count={statusCounts[filter.status]}
                    bgClass={filter.bgClass}
                    textClass={filter.textClass}
                    isActive={activeFilter === filter.status && !solicitanteFilter}
                    onClick={() => setActiveFilter(filter.status)}
                />
            ))}
        </div>
      </div>
      <Card>
        <CardHeader>
           {solicitanteFilter ? (
              <div className="flex justify-between items-center">
                  <CardTitle>Mostrando trámites para: <span className="text-primary">{solicitanteFilter}</span> ({filteredTramites.length})</CardTitle>
                  <Button variant="ghost" onClick={clearFilter}>
                      <X className="mr-2 h-4 w-4" />
                      Limpiar filtro
                  </Button>
              </div>
          ) : (
            <>
              <CardTitle>Listado de Trámites ({filteredTramites.length})</CardTitle>
              <CardDescription>
                Revise el estado, progreso y detalles de cada trámite.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">No.</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Ejecutores</TableHead>
                    <TableHead>Validadores</TableHead>
                    <TableHead>Ingreso</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead className="text-center">Progreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTramites.map((tx) => (
                    <TableRow key={tx.id} className={cn("border-l-4", statusColors[tx.status])}>
                      <TableCell className="font-medium text-muted-foreground align-top">
                        <div className="flex flex-col gap-2 items-start whitespace-nowrap">
                          <div className="flex items-center gap-1 font-bold text-foreground">
                            <span>{tx.id}</span>
                            {tx.hasWarning && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                          </div>
                          <Button asChild variant="outline" size="sm" className="h-auto px-4 py-1 text-xs font-semibold">
                            <Link href={`/dashboard/tramite/${tx.id}`}>TAREAS</Link>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        <div className="flex flex-col gap-1">
                          <p><span className="font-semibold text-foreground">Solicitante:</span> {tx.solicitante}, para: {tx.para}</p>
                          <p><span className="font-semibold text-foreground">Asignado a:</span> {tx.asignadoA}</p>
                          <p><span className="font-semibold text-foreground">Categoría solicitada:</span> {tx.categoria}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        <p><span className="font-semibold text-foreground">Proceso:</span> {tx.proceso} / <span className="text-foreground">{tx.referencia}</span></p>
                        <Link href="#" className="text-blue-600 hover:underline">{tx.subproceso}</Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        {tx.ejecutores.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        {tx.validadores.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                         <div className="flex flex-col whitespace-nowrap">
                            <span>{tx.ingreso.split(' ')[0]}</span>
                            <span className="font-semibold text-foreground/80">{tx.ingreso.split(' ').slice(1).join(' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top">
                        <div className="flex flex-col whitespace-nowrap">
                            <span>{tx.vence.split(' ')[0]}</span>
                            <span className="font-semibold text-foreground/80">{tx.vence.split(' ').slice(1).join(' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center justify-center">
                            <CircularProgress value={tx.progress} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AsignacionesPage() {
    return (
        <React.Suspense fallback={<div>Cargando...</div>}>
            <AsignacionesPageComponent />
        </React.Suspense>
    );
}
