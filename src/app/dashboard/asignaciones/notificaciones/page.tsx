
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
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
import { cn } from "@/lib/utils";

// Mock Data based on the image
const openedNotifications = [
  {
    id: "14443",
    proceso: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil Verificación de pago",
    entidad: "ASSIST AIR GROUP S.A. (Proceso de: EMILY SANCHEZ - Identificación: 402-1897094-1)",
    motivo: [
      { text: "09-05-2025 Falta de pago: ", highlight: "PAGO PENDIENTE" },
      { text: "Aviso: documentación remitida el: 20/06/2025" },
    ],
  },
  {
    id: "14502",
    proceso: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil Recepción formulario de datos personales",
    entidad: "Trading Aviation Services MB. S.R.L. (Proceso de: YOJANNY A. CEDANO - Identificación: 402-3108492-8)",
    motivo: [
      { text: "15-05-2025 Documentación incompleta: Le falta la carta de solicitud y las analiticas HEMOGRAMA/ GLICEMIA/ UREA/ ORINA/ VDRL/ HBSAG/ OTORRINOLARINGOLOGIA, enviar la documentacion para poder continuar con el proceso." },
      { text: "Aviso: documentación remitida el: 11/06/2025" },
    ],
  },
  {
    id: "14669",
    proceso: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil Prueba de Dopaje",
    entidad: "SERVIAIR, S.A. (Proceso de: Carmen Tapia - Identificación: 028-0108456-3)",
    motivo: [
        { text: "03-06-2025 TIEMPO DE VIGENCIA EXCEDIDO: ", highlight: "DOPAJE VENCIDO" },
        { text: "DOPAJE VENCIDO" },
        { text: "Aviso: documentación remitida el: 24/06/2025" },
    ]
  },
   {
    id: "12737",
    proceso: "Certificación y Recertificación del personal AVSEC del CESAC Prueba de Dopaje",
    procesoHighlight: true,
    entidad: "Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (Proceso de: MARIA F. REYNOSO - Identificación: 402-2999863-4)",
    motivo: [
        { text: "12-11-2024 TIEMPO DE VIGENCIA EXCEDIDO: ", highlight: "DOPAJE VENCIDO" },
        { text: "DOPAJE VENCIDO" },
    ]
  },
];

const inProgressNotifications = [
    {
        id: "14830",
        proceso: "Certificación y Re-certificación del Personal de Seguridad Privada de la Aviación Civil Recepción formulario de datos personales",
        entidad: "ARAJET, S.A. (Proceso de: PAOLA L. UREÑA - Identificación: 402-2318857-0)",
        motivo: [
          { text: "09-06-2025 Documentación incompleta: falta nemograma glicemia urea creatinina orina vdrl, nosag, nvc." },
          { text: "Aviso: documentación remitida el: 01/07/2025" },
        ],
    },
    {
        id: "13027",
        proceso: "Certificación y Recertificación del personal AVSEC del CESAC Evaluación médica",
        procesoHighlight: true,
        entidad: "Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (Proceso de: JOSE LUIS GOMEZ BENA - Identificación: 402-3250225-0)",
        motivo: [
            { text: "25-11-2024 Documentación incompleta: Seguir Tratamiento y ser revaluado por Otorino" },
            { text: "Seguir Tratamiento y ser revaluado por Otorino" },
        ]
    }
];

const NotificationTable = ({ data }: { data: typeof openedNotifications }) => (
  <div className="overflow-x-auto">
    <Table className="min-w-full">
      <TableHeader className="bg-muted/30 dark:bg-muted/20">
        <TableRow>
          <TableHead className="w-[120px]">
            <p className="pb-2 text-xs font-semibold">ID</p>
            <Input placeholder="Filtrar ID..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[300px]">
            <p className="pb-2 text-xs font-semibold">Proceso</p>
            <Input placeholder="Filtrar proceso..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[300px]">
            <p className="pb-2 text-xs font-semibold">Entidad</p>
            <Input placeholder="Filtrar entidad..." className="h-8" />
          </TableHead>
          <TableHead className="min-w-[400px]">
            <p className="pb-2 text-xs font-semibold">Motivo</p>
            <Input placeholder="Filtrar motivo..." className="h-8" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((notification) => (
          <TableRow key={notification.id} className="transition-colors hover:bg-muted/50">
            <TableCell className="font-mono align-top">{notification.id}</TableCell>
            <TableCell className={cn("align-top", notification.procesoHighlight && "text-destructive")}>
              {notification.proceso}
            </TableCell>
            <TableCell className="align-top text-muted-foreground">{notification.entidad}</TableCell>
            <TableCell className="align-top text-xs">
              {notification.motivo.map((line, index) => (
                <p key={index} className="whitespace-pre-wrap">
                  {line.text}
                  {line.highlight && <span className="font-bold text-foreground"> {line.highlight}</span>}
                </p>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function NotificacionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
        <p className="text-muted-foreground">
          Gestione las notificaciones y alertas del sistema.
        </p>
      </div>

      <Card className="shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
        <CardContent className="p-0">
          <Tabs defaultValue="abiertos" className="w-full">
            <div className="border-b p-4">
                <TabsList>
                    <TabsTrigger value="abiertos">Abiertos</TabsTrigger>
                    <TabsTrigger value="en-progreso">En Progreso</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="abiertos" className="p-0">
              <NotificationTable data={openedNotifications} />
            </TabsContent>
            <TabsContent value="en-progreso" className="p-0">
              <NotificationTable data={inProgressNotifications} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
