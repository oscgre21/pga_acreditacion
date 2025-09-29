
"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, FileClock, Search, Download, ArrowLeft, User, Server, AlertTriangle, KeyRound, FileJson, FileSpreadsheet, Printer } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const auditLogData = [
  // General
  { id: 'log-001', date: '2024-07-30 14:25:10', user: 'kqualey', app: 'SGU', action: 'CREATE_USER', details: 'Se creó el usuario "j.perez" con rol "Lector".', ip: '200.45.18.1', type: 'general' },
  { id: 'log-002', date: '2024-07-30 11:10:05', user: 'mrodriguez', app: 'SCC', action: 'UPDATE_DOCUMENT', details: 'Se actualizó el documento de procedimiento "PROC-01-CALIDAD".', ip: '200.45.18.2', type: 'general' },
  // Critical
  { id: 'log-003', date: '2024-07-29 18:05:45', user: 'admin', app: 'PGA', action: 'LOGIN_FAIL', details: 'Intento de inicio de sesión fallido.', ip: '192.168.1.100', type: 'critical' },
  { id: 'log-005', date: '2024-07-28 16:45:12', user: 'kqualey', app: 'SGU', action: 'DELETE_USER', details: 'Se eliminó el usuario "temporal_01".', ip: '200.45.18.1', type: 'critical' },
  // Login
  { id: 'log-008', date: '2024-07-30 14:20:00', user: 'kqualey', app: 'PGA', action: 'LOGIN_SUCCESS', details: 'Inicio de sesión exitoso.', ip: '200.45.18.1', type: 'login' },
  { id: 'log-009', date: '2024-07-30 11:05:00', user: 'mrodriguez', app: 'PGA', action: 'LOGIN_SUCCESS', details: 'Inicio de sesión exitoso.', ip: '200.45.18.2', type: 'login' },
  // Module-specific
  { id: 'log-004', date: '2024-07-29 09:30:00', user: 'lfernandez', app: 'SCF', action: 'ASSIGN_VEHICLE', details: 'Se asignó el vehículo F-015 al conductor "R. Martinez".', ip: '200.45.18.3', type: 'module' },
  { id: 'log-006', date: '2024-07-28 10:00:21', user: 'j.perez', app: 'SIARED', action: 'UPLOAD_COURSE_DOC', details: 'Se subió la certificación para el curso "AVSEC Básico".', ip: '200.45.18.4', type: 'module' },
  { id: 'log-007', date: '2024-07-27 12:00:00', user: 'security_audit', app: 'PGA', action: 'SECURITY_SCAN', details: 'Escaneo de seguridad completado. 2 vulnerabilidades medias encontradas.', ip: '127.0.0.1', type: 'critical' },
];

const users = [...new Set(auditLogData.map(log => log.user))].map(user => ({ id: user, name: user }));
const modules = [...new Set(auditLogData.map(log => log.app))].map(app => ({ id: app, name: app }));
const criticalActions = ['LOGIN_FAIL', 'DELETE_USER', 'SECURITY_SCAN'];
const loginActions = ['LOGIN_SUCCESS', 'LOGIN_FAIL'];

export default function HistorialAuditoriasPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedUser, setSelectedUser] = React.useState<string>('all-users');
  const [selectedModule, setSelectedModule] = React.useState<string>('all-modules');
  
  const getFilteredData = (filters: Partial<typeof auditLogData[0]>) => {
      let data = auditLogData;

      if (date?.from) { data = data.filter(log => new Date(log.date) >= date.from!); }
      if (date?.to) { data = data.filter(log => new Date(log.date) <= date.to!); }

      Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
              data = data.filter(log => value.includes(log[key as keyof typeof log]));
          } else if (value && value !== `all-${key}s`) {
              data = data.filter(log => log[key as keyof typeof log] === value);
          }
      });
      return data;
  };

  const generalData = getFilteredData({});
  const userData = getFilteredData({ user: selectedUser === 'all-users' ? undefined : selectedUser });
  const moduleData = getFilteredData({ app: selectedModule === 'all-modules' ? undefined : selectedModule });
  const criticalData = getFilteredData({ action: criticalActions });
  const loginData = getFilteredData({ action: loginActions });

  const handleExport = (data: typeof auditLogData, formatType: 'csv' | 'json') => {
    let content, mimeType, fileExtension;
    
    if (formatType === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else { // csv
      const headers = ["ID", "Fecha", "Usuario", "Aplicación", "Acción", "Detalles", "IP"];
      const csvContent = headers.join(",") + "\n" +
        data.map(row => 
          [row.id, `"${row.date}"`, row.user, row.app, row.action, `"${row.details.replace(/"/g, '""')}"`, row.ip].join(",")
        ).join("\n");
      content = csvContent;
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }
    
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historial_auditoria_${format(new Date(), 'yyyy-MM-dd')}.${fileExtension}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const RenderTable = ({ data, showIp = true }: { data: typeof auditLogData, showIp?: boolean }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Fecha y Hora</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Módulo</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Detalles</TableHead>
                        {showIp && <TableHead>IP Origen</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-mono text-xs">{log.date}</TableCell>
                                <TableCell className="font-medium">{log.user}</TableCell>
                                <TableCell><Badge variant="outline">{log.app}</Badge></TableCell>
                                <TableCell><Badge variant={criticalActions.includes(log.action) ? "destructive" : "secondary"}>{log.action}</Badge></TableCell>
                                <TableCell className="text-muted-foreground text-xs">{log.details}</TableCell>
                                {showIp && <TableCell className="font-mono text-xs">{log.ip}</TableCell>}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={showIp ? 6 : 5} className="h-24 text-center">No se encontraron registros.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </motion.div>
  );

  const ExportButton = ({ data }: { data: typeof auditLogData }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button disabled={data.length === 0}><Download className="mr-2 h-4 w-4" /> Exportar</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleExport(data, 'csv')}><FileSpreadsheet className="mr-2 h-4 w-4"/> CSV / Excel</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleExport(data, 'json')}><FileJson className="mr-2 h-4 w-4"/> JSON</DropdownMenuItem>
            <DropdownMenuItem disabled><Printer className="mr-2 h-4 w-4"/> PDF (Próximamente)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
    >
       <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <FileClock className="h-8 w-8 text-primary" />
                    Historial de Auditorías
                </h1>
                <p className="text-muted-foreground">
                    Consulta y exporta los registros de auditoría de seguridad y cambios.
                </p>
            </div>
            <Button asChild variant="outline">
                <Link href="/dashboard/reportes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Reportes
                </Link>
            </Button>
        </div>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Filtro General por Fecha</CardTitle>
          <CardDescription>
            Seleccione un rango de fechas para aplicar a todos los reportes.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className={cn("w-full max-w-sm justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (date.to ? (<>{format(date.from, "LLL dd, y", { locale: es })} - {format(date.to, "LLL dd, y", { locale: es })}</>) : (format(date.from, "LLL dd, y", { locale: es }))) : (<span>Seleccione una fecha</span>)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={es} />
              </PopoverContent>
            </Popover>
        </CardContent>
      </Card>
      
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
                <TabsTrigger value="general">Reporte General</TabsTrigger>
                <TabsTrigger value="usuario">Por Usuario</TabsTrigger>
                <TabsTrigger value="modulo">Por Módulo</TabsTrigger>
                <TabsTrigger value="critico">Acciones Críticas</TabsTrigger>
                <TabsTrigger value="accesos">Accesos y Sesiones</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
                 <motion.div key={React.useId()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <TabsContent value="general" className="mt-6">
                        <Card className="shadow-xl">
                            <CardHeader><div className="flex justify-between items-center"><CardTitle>Reporte General de Actividad</CardTitle><ExportButton data={generalData} /></div></CardHeader>
                            <CardContent><RenderTable data={generalData} /></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="usuario" className="mt-6">
                        <Card className="shadow-xl">
                            <CardHeader><div className="flex justify-between items-center"><CardTitle>Reporte de Actividad por Usuario</CardTitle><ExportButton data={userData} /></div></CardHeader>
                            <CardContent>
                                <div className="max-w-xs mb-4">
                                  <Label htmlFor="user-select">Seleccione un Usuario</Label>
                                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger id="user-select"><SelectValue placeholder="Todos los usuarios..." /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all-users">Todos los usuarios</SelectItem>
                                      {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <RenderTable data={userData} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="modulo" className="mt-6">
                        <Card className="shadow-xl">
                            <CardHeader><div className="flex justify-between items-center"><CardTitle>Reporte por Módulo</CardTitle><ExportButton data={moduleData} /></div></CardHeader>
                            <CardContent>
                                <div className="max-w-xs mb-4">
                                  <Label htmlFor="module-select">Seleccione un Módulo</Label>
                                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                                    <SelectTrigger id="module-select"><SelectValue placeholder="Todos los módulos..." /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all-modules">Todos los módulos</SelectItem>
                                      {modules.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <RenderTable data={moduleData} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="critico" className="mt-6">
                        <Card className="shadow-xl">
                            <CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Reporte de Acciones Críticas</CardTitle><ExportButton data={criticalData} /></div></CardHeader>
                            <CardContent><RenderTable data={criticalData} /></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="accesos" className="mt-6">
                        <Card className="shadow-xl">
                            <CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center gap-2"><KeyRound/>Reporte de Inicios de Sesión</CardTitle><ExportButton data={loginData} /></div></CardHeader>
                            <CardContent><RenderTable data={loginData} /></CardContent>
                        </Card>
                    </TabsContent>
                 </motion.div>
            </AnimatePresence>
        </Tabs>

    </motion.div>
  );
}
