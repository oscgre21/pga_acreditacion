
"use client";

import React, { useState, useMemo } from "react";
import { GitCommit, ArrowLeft, ArrowRight, TrendingUp, TrendingDown, Minus, Clock, ShieldAlert, MemoryStick, Cpu } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { initialApps } from "../../perfiles-pga/data";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for versions
const versionData: { [key: string]: any[] } = {
    'SGU': [
        { version: '2.5.1', date: '2024-07-28', loadTime: 0.8, memoryUsage: 480, cpuUsage: 18, uptime: 99.99, incidents: 0 },
        { version: '2.5.0', date: '2024-06-15', loadTime: 0.9, memoryUsage: 512, cpuUsage: 15, uptime: 99.98, incidents: 3 },
        { version: '2.4.0', date: '2024-04-20', loadTime: 1.1, memoryUsage: 550, cpuUsage: 22, uptime: 99.95, incidents: 5 },
    ],
    'SDP': [
        { version: '3.0.0', date: '2024-07-20', loadTime: 1.2, memoryUsage: 600, cpuUsage: 28, uptime: 99.92, incidents: 1 },
        { version: '2.9.5', date: '2024-05-30', loadTime: 1.5, memoryUsage: 620, cpuUsage: 25, uptime: 99.95, incidents: 2 },
        { version: '2.9.0', date: '2024-03-10', loadTime: 1.6, memoryUsage: 680, cpuUsage: 35, uptime: 99.90, incidents: 4 },
    ],
    'SCF': [
        { version: '2.2.0', date: '2024-07-18', loadTime: 1.8, memoryUsage: 450, cpuUsage: 20, uptime: 99.96, incidents: 1 },
        { version: '2.1.0', date: '2024-05-05', loadTime: 1.9, memoryUsage: 470, cpuUsage: 24, uptime: 99.94, incidents: 3 },
    ]
};

const KPICard = ({ title, value, change, icon: Icon, unit = '' }: { title: string, value: string | number, change: { type: 'better' | 'worse' | 'same', text: string }, icon: React.ElementType, unit?: string }) => {
  const getChangeColor = () => {
    switch (change.type) {
      case 'better': return 'text-green-500';
      case 'worse': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  const ChangeIcon = change.type === 'better' ? TrendingUp : change.type === 'worse' ? TrendingDown : Minus;

  return (
    <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}{unit}</div>
        <div className={`text-xs flex items-center gap-1 ${getChangeColor()}`}>
            <ChangeIcon className="h-4 w-4" />
            <span>{change.text}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ComparativaVersionesPage() {
    const [selectedAppId, setSelectedAppId] = useState<string>('');
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    
    const availableVersions = selectedAppId ? versionData[selectedAppId] || [] : [];
    
    const handleVersionToggle = (version: string) => {
        setSelectedVersions(prev => 
            prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
        );
    };

    const comparisonData = useMemo(() => {
        return availableVersions.filter(v => selectedVersions.includes(v.version)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [selectedVersions, availableVersions]);

    const latestVersion = comparisonData[0];
    const previousVersion = comparisonData[1];

    const getChange = (latest: number, previous: number, lowerIsBetter = false) => {
        if (latest === previous) return { type: 'same', text: 'Sin cambios' };
        const diff = ((latest - previous) / previous) * 100;
        const isBetter = lowerIsBetter ? latest < previous : latest > previous;
        return {
            type: isBetter ? 'better' : 'worse',
            text: `${diff.toFixed(1)}% ${isBetter ? 'mejora' : 'empeora'}`
        };
    };

    const chartData = comparisonData.map(v => ({
        name: `v${v.version}`,
        'Tiempo de Carga': v.loadTime,
        'Uso de Memoria': v.memoryUsage,
        'Uso de CPU': v.cpuUsage,
    })).reverse(); // Reverse for chronological order in chart

    const incidentChartData = comparisonData.map(v => ({
        name: `v${v.version}`,
        'Incidentes': v.incidents
    })).reverse();

    const chartConfig: ChartConfig = {
        "Tiempo de Carga": { label: "Tiempo de Carga (s)", color: "hsl(var(--chart-1))" },
        "Uso de Memoria": { label: "Uso de Memoria (MB)", color: "hsl(var(--chart-2))" },
        "Uso de CPU": { label: "Uso de CPU (%)", color: "hsl(var(--chart-3))" },
        "Incidentes": { label: "Incidentes", color: "hsl(var(--chart-5))" },
    };

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
                        <GitCommit className="h-8 w-8 text-primary" />
                        Informe de Comparativa de Versiones
                    </h1>
                    <p className="text-muted-foreground">
                        Analice el impacto de las actualizaciones en el rendimiento y la estabilidad.
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
                <CardHeader>
                    <CardTitle>Paso 1: Selección de Aplicación</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={setSelectedAppId}>
                        <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
                            <SelectValue placeholder="Seleccione una aplicación para comparar..." />
                        </SelectTrigger>
                        <SelectContent>
                            {initialApps.filter(app => versionData[app.id]).map(app => (
                                <SelectItem key={app.id} value={app.id}>{app.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <AnimatePresence>
                {selectedAppId && (
                     <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                         <Card className="shadow-xl">
                             <CardHeader>
                                <CardTitle>Paso 2: Selección de Versiones</CardTitle>
                                <CardDescription>Elija al menos dos versiones para iniciar la comparación.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-4">
                                {availableVersions.map(v => (
                                    <motion.div key={v.version} whileHover={{ scale: 1.05 }}>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={v.version}
                                                checked={selectedVersions.includes(v.version)}
                                                onCheckedChange={() => handleVersionToggle(v.version)}
                                            />
                                            <Label htmlFor={v.version} className="p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                                                <span className="font-bold">v{v.version}</span>
                                                <span className="text-xs text-muted-foreground ml-2">({v.date})</span>
                                            </Label>
                                        </div>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

             <AnimatePresence>
                {comparisonData.length >= 2 && (
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-center">Resultados de la Comparación</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KPICard title="Tiempo de Carga" value={latestVersion.loadTime} unit="s" icon={Clock} change={getChange(latestVersion.loadTime, previousVersion.loadTime, true)} />
                            <KPICard title="Uso de Memoria" value={latestVersion.memoryUsage} unit="MB" icon={MemoryStick} change={getChange(latestVersion.memoryUsage, previousVersion.memoryUsage, true)} />
                            <KPICard title="Uso de CPU" value={latestVersion.cpuUsage} unit="%" icon={Cpu} change={getChange(latestVersion.cpuUsage, previousVersion.cpuUsage, true)} />
                            <KPICard title="Incidentes" value={latestVersion.incidents} icon={ShieldAlert} change={getChange(latestVersion.incidents, previousVersion.incidents, true)} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="shadow-2xl">
                                <CardHeader>
                                    <CardTitle>Rendimiento General</CardTitle>
                                    <CardDescription>Comparativa de métricas clave de rendimiento.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <RechartsPrimitive.BarChart data={chartData}>
                                            <RechartsPrimitive.CartesianGrid vertical={false} />
                                            <RechartsPrimitive.XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                            <RechartsPrimitive.YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <RechartsPrimitive.Legend />
                                            <RechartsPrimitive.Bar dataKey="Tiempo de Carga" fill="var(--color-Tiempo de Carga)" radius={4} />
                                            <RechartsPrimitive.Bar dataKey="Uso de Memoria" fill="var(--color-Uso de Memoria)" radius={4} />
                                            <RechartsPrimitive.Bar dataKey="Uso de CPU" fill="var(--color-Uso de CPU)" radius={4} />
                                        </RechartsPrimitive.BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                             <Card className="shadow-2xl">
                                <CardHeader>
                                    <CardTitle>Estabilidad (Incidentes)</CardTitle>
                                    <CardDescription>Número de incidentes reportados por versión.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                        <RechartsPrimitive.LineChart data={incidentChartData}>
                                            <RechartsPrimitive.CartesianGrid vertical={false} />
                                            <RechartsPrimitive.XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                            <RechartsPrimitive.YAxis allowDecimals={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <RechartsPrimitive.Legend />
                                            <RechartsPrimitive.Line type="monotone" dataKey="Incidentes" stroke="var(--color-Incidentes)" strokeWidth={3} dot={{ r: 5, fill: 'var(--color-Incidentes)' }} />
                                        </RechartsPrimitive.LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                        
                         <Card className="shadow-2xl">
                             <CardHeader>
                                <CardTitle>Tabla de Datos Detallada</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead>Versión</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead className="text-right">Tiempo de Carga (s)</TableHead>
                                                <TableHead className="text-right">Memoria (MB)</TableHead>
                                                <TableHead className="text-right">CPU (%)</TableHead>
                                                <TableHead className="text-right">Uptime (%)</TableHead>
                                                <TableHead className="text-right">Incidentes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {comparisonData.map(v => (
                                                <TableRow key={v.version} className="font-mono">
                                                    <TableCell className="font-semibold text-primary">v{v.version}</TableCell>
                                                    <TableCell className="text-muted-foreground">{v.date}</TableCell>
                                                    <TableCell className="text-right">{v.loadTime}</TableCell>
                                                    <TableCell className="text-right">{v.memoryUsage}</TableCell>
                                                    <TableCell className="text-right">{v.cpuUsage}</TableCell>
                                                    <TableCell className="text-right">{v.uptime}</TableCell>
                                                    <TableCell className="text-right font-bold">{v.incidents}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
