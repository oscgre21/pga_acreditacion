
"use client";

import * as React from "react";
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
import { FileText, ArrowLeft } from "lucide-react";
import { initialApps } from "../../perfiles-pga/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

type AppWithIncidents = {
  id: string;
  nombre: string;
  logo: React.ElementType;
  incidents: {
    type: string;
    description: string;
  }[];
};

export default function HistorialIncidentesPage() {
  const appsWithIncidents = React.useMemo(() =>
    initialApps.filter(app => app.incidents.length > 0)
  , []);

  const getIncidentBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'crítico': return 'destructive';
      case 'advertencia': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><FileText className="h-8 w-8 text-primary" />Historial de Incidentes</h1>
            <p className="text-muted-foreground">
              Un registro detallado de todas las incidencias reportadas, agrupadas por aplicación.
            </p>
        </div>
        <Button asChild variant="outline">
            <Link href="/dashboard/reportes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Reportes
            </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-4">
            <Accordion type="multiple" className="w-full">
                {appsWithIncidents.map(app => (
                    <AccordionItem value={app.id} key={app.id}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center gap-4">
                                <app.logo className="h-6 w-6 text-primary" />
                                <span className="font-semibold text-lg">{app.nombre}</span>
                                <Badge variant="outline">{app.incidents.length} incidente(s)</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0 pt-2">
                             <div className="border rounded-lg overflow-hidden mx-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px]">Tipo de Incidente</TableHead>
                                            <TableHead>Descripción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {app.incidents.map((incident, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Badge variant={getIncidentBadge(incident.type)}>{incident.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{incident.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
