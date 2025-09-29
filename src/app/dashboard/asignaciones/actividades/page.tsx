
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for activities
const pendingActivities = [
  {
    id: "12022",
    tramite: "Certificación de personal",
    entidad: "LONGPORT AVIATION SECURITY, S.R.L - WILKENIA EDOUARD FILMONOR",
    actividad: "Recepción formulario de datos personales",
    responsable: "ROBINSON ACOSTA PEÑA",
    estado: "Pendiente",
    progress: 40,
    completedTasks: ["Recepción de Solicitud", "Validación de Pago"],
    pendingTasks: ["Verificación de Antecedentes", "Prueba de Dopaje", "Evaluación Médica"],
  },
  {
    id: "10706",
    tramite: "Re-Certificación de personal",
    entidad: "LONGPORT AVIATION SECURITY, S.R.L - FRANCISCO J. BERAS M.",
    actividad: "Verificación de antecedentes",
    responsable: "AMAURIS MERCEDES CASTILLO",
    estado: "Pendiente",
    progress: 10,
    completedTasks: ["Recepción de Solicitud"],
    pendingTasks: ["Validación de Pago", "Verificación de Antecedentes", "Prueba de Dopaje", "Evaluación Médica", "Examen Teórico", "Examen Práctico"],
  },
   {
    id: "12023",
    tramite: "Renovación de carnet",
    entidad: "SWISSPORT - JUAN PEREZ",
    actividad: "Entrega de documentos",
    responsable: "MARIA RODRIGUEZ",
    estado: "En Progreso",
    progress: 75,
    completedTasks: ["Recepción de Solicitud", "Validación de Pago", "Verificación de Antecedentes"],
    pendingTasks: ["Emisión de Carnet"],
  },
];

const completedActivities = [
    {
        id: "12024",
        tramite: "Certificación inicial",
        entidad: "AERODOM - CARLOS SANCHEZ",
        actividad: "Toma de fotografía",
        responsable: "LUISA FERNANDEZ",
        estado: "Completado",
        progress: 100,
        completedTasks: ["Recepción de Solicitud", "Validación de Pago", "Verificación de Antecedentes", "Prueba de Dopaje", "Evaluación Médica", "Examen Teórico", "Examen Práctico", "Emisión de Licencia"],
        pendingTasks: [],
    },
    {
        id: "10704",
        tramite: "Re-certificación de supervisor",
        entidad: "SWISSPORT - CARLOS PEREZ",
        actividad: "Examen práctico",
        responsable: "LUISA FERNANDEZ",
        estado: "Completado",
        progress: 100,
        completedTasks: ["Recepción de Solicitud", "Validación de Pago", "Verificación de Antecedentes", "Evaluación Médica", "Examen Teórico", "Examen Práctico"],
        pendingTasks: [],
    }
];

const getActivityStatusBadge = (status: string) => {
    switch (status) {
        case 'Pendiente': return <Badge variant="destructive" className="bg-orange-500/80 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300">{status}</Badge>;
        case 'En Progreso': return <Badge variant="secondary" className="bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{status}</Badge>;
        case 'Completado': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">{status}</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

const ActivityTable = ({ data }: { data: typeof pendingActivities }) => (
  <div className="overflow-x-auto">
    <Table className="min-w-full">
      <TableHeader className="bg-muted/30 dark:bg-muted/20">
        <TableRow>
          <TableHead className="w-[120px]">
            <p className="pb-2 text-xs font-semibold">Trámite ID</p>
            <Input placeholder="Filtrar ID..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[250px]">
            <p className="pb-2 text-xs font-semibold">Trámite</p>
            <Input placeholder="Filtrar trámite..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[300px]">
            <p className="pb-2 text-xs font-semibold">Entidad / Persona</p>
            <Input placeholder="Filtrar entidad..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[300px]">
            <p className="pb-2 text-xs font-semibold">Actividad Actual</p>
            <Input placeholder="Filtrar actividad..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[200px]">
            <p className="pb-2 text-xs font-semibold">Responsable</p>
            <Input placeholder="Filtrar responsable..." className="h-8" />
          </TableHead>
           <TableHead className="w-[150px]">
            <p className="pb-2 text-xs font-semibold">Estado</p>
          </TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      {data.map((activity) => (
         <Collapsible asChild key={activity.id}>
            <tbody className="group">
              <CollapsibleTrigger asChild>
                <TableRow className="cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-muted/40 hover:-translate-y-0.5">
                  <TableCell className="font-mono align-top">
                      <Link href={`/dashboard/tramite/${activity.id}`} className="text-primary hover:underline">{activity.id}</Link>
                  </TableCell>
                  <TableCell className="align-top">
                    {activity.tramite}
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground">{activity.entidad}</TableCell>
                  <TableCell className="align-top text-foreground font-medium">{activity.actividad}</TableCell>
                  <TableCell className="align-top text-muted-foreground">{activity.responsable}</TableCell>
                  <TableCell className="align-top">{getActivityStatusBadge(activity.estado)}</TableCell>
                  <TableCell className="align-top text-center">
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <TableRow className="bg-muted/20 dark:bg-muted/10">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 md:p-6 space-y-6 animate-in fade-in-50 duration-500">
                        <Card className="shadow-lg border-primary/20 bg-card">
                            <CardHeader>
                                <CardTitle className="text-lg">Progreso del Trámite</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Progress value={activity.progress} className="h-3" />
                                <p className="text-right text-sm font-bold text-primary mt-2">{activity.progress}% completado</p>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-green-600 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Actividades Completadas
                                        </h4>
                                        <ul className="space-y-2 pl-4">
                                            {activity.completedTasks.map((task, i) => (
                                                <li key={i} className="text-sm text-muted-foreground list-disc">{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Actividades Pendientes
                                        </h4>
                                        <ul className="space-y-2 pl-4">
                                            {activity.pendingTasks.map((task, i) => (
                                                <li key={i} className="text-sm text-muted-foreground list-disc">{task}</li>
                                            ))}
                                            {activity.pendingTasks.length === 0 && <p className="text-sm text-muted-foreground">Ninguna.</p>}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                      </div>
                    </TableCell>
                </TableRow>
              </CollapsibleContent>
            </tbody>
         </Collapsible>
      ))}
    </Table>
  </div>
);

export default function ActividadesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actividades de Trámites</h1>
        <p className="text-muted-foreground">
          Seguimiento de todas las actividades pendientes y completadas.
        </p>
      </div>

      <Card className="shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
        <CardContent className="p-0">
          <Tabs defaultValue="pendientes" className="w-full">
            <div className="border-b p-4">
                <TabsList>
                    <TabsTrigger value="pendientes">Pendientes / En Progreso</TabsTrigger>
                    <TabsTrigger value="completadas">Completadas</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="pendientes" className="p-0">
              <ActivityTable data={pendingActivities} />
            </TabsContent>
            <TabsContent value="completadas" className="p-0">
              <ActivityTable data={completedActivities} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
