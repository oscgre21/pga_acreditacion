
"use client";

import React from "react";
import { AreaChart, BarChart, FileText, ArrowLeft, TrendingUp, Users, Clock, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const usageChartData = [
  { date: "Ene", sgu: 400, scu: 240, sdp: 300, rrhh: 150 },
  { date: "Feb", sgu: 300, scu: 139, sdp: 250, rrhh: 180 },
  { date: "Mar", sgu: 200, scu: 980, sdp: 200, rrhh: 210 },
  { date: "Abr", sgu: 278, scu: 390, sdp: 230, rrhh: 200 },
  { date: "May", sgu: 189, scu: 480, sdp: 190, rrhh: 250 },
  { date: "Jun", sgu: 239, scu: 380, sdp: 210, rrhh: 230 },
  { date: "Jul", sgu: 349, scu: 430, sdp: 250, rrhh: 270 },
];

const usageChartConfig = {
  sgu: { label: "SGU", color: "hsl(var(--chart-1))" },
  scu: { label: "SCU", color: "hsl(var(--chart-2))" },
  sdp: { label: "SDP", color: "hsl(var(--chart-3))" },
  rrhh: { label: "RRHH", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const distributionChartData = [
    { name: 'SGU', users: 3590, fill: 'var(--color-sgu)' },
    { name: 'SCU', users: 1980, fill: 'var(--color-scu)' },
    { name: 'SIARED', users: 1500, fill: 'var(--color-siared)' },
    { name: 'RRHH', users: 1200, fill: 'var(--color-rrhh)' },
    { name: 'SDP', users: 800, fill: 'var(--color-sdp)' },
    { name: 'Otros', users: 1321, fill: 'var(--color-otros)' },
];

const distributionChartConfig = {
  users: { label: 'Usuarios' },
  sgu: { label: 'SGU', color: 'hsl(var(--chart-1))' },
  scu: { label: 'SCU', color: 'hsl(var(--chart-2))' },
  siared: { label: 'SIARED', color: 'hsl(var(--chart-3))' },
  rrhh: { label: 'RRHH', color: 'hsl(var(--chart-4))' },
  sdp: { label: 'SDP', color: 'hsl(var(--chart-5))' },
  otros: { label: 'Otros', color: 'hsl(var(--muted))' },
} satisfies ChartConfig;

const performanceData = [
    { app: 'Sistema Gestión Usuario', uptime: 99.98, loadTime: 1.2, memoryUsage: 512, cpuUsage: 15 },
    { app: 'Sistema Carnet Unico', uptime: 99.99, loadTime: 0.8, memoryUsage: 350, cpuUsage: 12 },
    { app: 'Sistema de documentacion de poligrafia', uptime: 99.95, loadTime: 1.5, memoryUsage: 620, cpuUsage: 25 },
    { app: 'Sistema de Reclutamiento', uptime: 100, loadTime: 0.9, memoryUsage: 410, cpuUsage: 18 },
    { app: 'Sistema Automatizado de Recepción...', uptime: 99.90, loadTime: 2.1, memoryUsage: 730, cpuUsage: 35 },
    { app: 'Sistema de Gestión de Correspondencia', uptime: 99.99, loadTime: 1.1, memoryUsage: 550, cpuUsage: 22 },
];


export default function RendimientoUsoPage() {
    
    const kpiData = [
        { title: "Usuarios Activos (30d)", value: "6,8K", icon: Users, description: "+15% vs mes anterior", color: "text-green-500" },
        { title: "Tiempo Actividad Promedio", value: "99.97%", icon: TrendingUp, description: "Todas las aplicaciones", color: "text-blue-500" },
        { title: "Sesiones Totales (30d)", value: "25,430", icon: Clock, description: "+8.2K vs mes anterior", color: "text-indigo-500" },
        { title: "Incidentes Críticos (7d)", value: "1", icon: AlertCircle, description: "Fuga de datos en SDP", color: "text-red-500" },
    ];

    return (
        <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <AreaChart className="h-8 w-8 text-primary" />
                        Informe de Rendimiento y Uso de Aplicaciones
                    </h1>
                    <p className="text-muted-foreground">
                        Análisis detallado de la actividad y performance de los sistemas PGA.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/perfiles-pga">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
                                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                 <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 h-full">
                        <CardHeader>
                            <CardTitle>Uso de Aplicaciones por Día</CardTitle>
                            <CardDescription>Actividad de usuarios en las principales aplicaciones durante los últimos 7 meses.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={usageChartConfig} className="h-[300px] w-full">
                                <RechartsPrimitive.AreaChart data={usageChartData} margin={{ left: -20, right: 20, top: 10, bottom: 0 }}>
                                    <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <RechartsPrimitive.XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                    <RechartsPrimitive.YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    {Object.entries(usageChartConfig).map(([key, config]) => (
                                        <RechartsPrimitive.Area key={key} dataKey={key} type="monotone" fillOpacity={0.1} fill={config.color} stroke={config.color} strokeWidth={2} />
                                    ))}
                                </RechartsPrimitive.AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                 </motion.div>
                 
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                >
                    <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500 h-full">
                        <CardHeader>
                            <CardTitle>Distribución de Usuarios</CardTitle>
                            <CardDescription>Porcentaje de usuarios registrados por aplicación.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={distributionChartConfig} className="h-[300px] w-full">
                                <RechartsPrimitive.RadialBarChart data={distributionChartData} innerRadius="30%" outerRadius="80%" startAngle={90} endAngle={-270}>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <RechartsPrimitive.RadialBar dataKey="users" background>
                                         {distributionChartData.map((entry, index) => (
                                            <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </RechartsPrimitive.RadialBar>
                                    <RechartsPrimitive.Legend content={({ payload }) => (
                                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                                            {payload?.map((entry, index) => (
                                                <div key={`item-${index}`} className="flex items-center gap-1.5 text-xs">
                                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span>{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )} />
                                </RechartsPrimitive.RadialBarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
            >
                <Card className="shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
                    <CardHeader>
                        <CardTitle>Tabla de Rendimiento</CardTitle>
                        <CardDescription>Métricas de rendimiento clave para cada aplicación.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Aplicación</TableHead>
                                        <TableHead className="text-center">Tiempo Actividad (%)</TableHead>
                                        <TableHead className="text-center">Tiempo de Carga (s)</TableHead>
                                        <TableHead className="text-center">Uso de Memoria (MB)</TableHead>
                                        <TableHead className="text-center">Uso de CPU (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceData.map((item) => (
                                        <TableRow key={item.app} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{item.app}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span>{item.uptime.toFixed(2)}</span>
                                                    <Progress value={item.uptime} className="h-1.5 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{item.loadTime.toFixed(1)}</TableCell>
                                            <TableCell className="text-center">{item.memoryUsage}</TableCell>
                                            <TableCell className="text-center">{item.cpuUsage}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
