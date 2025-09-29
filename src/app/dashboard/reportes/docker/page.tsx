
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronDown, Cpu, Database, HardDrive, Network, Power, RefreshCw, Search, Shield, TriangleAlert, XCircle, FileText, BarChart2, TrendingUp, ClockIcon, AlertCircleIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as RechartsPrimitive from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";


const containerData = {
  'sgu_api_1': {
    name: 'sgu_api_1',
    status: 'running',
    uptime: '48d 12h',
    restarts: 0,
    health: 'healthy',
    image: 'sgu-api:2.5.1',
    cpu: 18,
    memory: { used: 480, total: 2048 },
    disk: { read: 12.5, write: 4.2 },
    network: { in: 1.2, out: 3.5 },
    logs: [
      { level: 'INFO', msg: 'API server started on port 3000' },
      { level: 'INFO', msg: 'Database connection successful' },
      { level: 'WARN', msg: 'Token for user "kqualey" nearing expiration' },
    ],
    security: {
        dockerBench: 'passed',
        vulnerabilities: [
            { id: 'CVE-2023-4567', severity: 'Medium', status: 'Patched', package: 'openssl', version: '1.1.1g-r0' },
        ],
        permissions: 'ninguno'
    },
    history: {
        responseTime: 120, // ms
        uptimePercent: 99.98,
        events: 12530,
        performance: [
            { hour: '12 AM', cpu: 15, ram: 450 }, { hour: '3 AM', cpu: 12, ram: 440 },
            { hour: '6 AM', cpu: 18, ram: 480 }, { hour: '9 AM', cpu: 25, ram: 520 },
            { hour: '12 PM', cpu: 22, ram: 510 }, { hour: '3 PM', cpu: 20, ram: 500 },
            { hour: '6 PM', cpu: 28, ram: 550 }, { hour: '9 PM', cpu: 21, ram: 490 },
        ]
    }
  },
  'scu_db_1': {
    name: 'scu_db_1',
    status: 'running',
    uptime: '120d 5h',
    restarts: 0,
    health: 'healthy',
    image: 'postgres:14-alpine',
    cpu: 8,
    memory: { used: 1228, total: 4096 },
    disk: { read: 890.1, write: 1204.5 },
    network: { in: 450.6, out: 450.6 },
    logs: [
      { level: 'INFO', msg: 'database system is ready to accept connections' },
    ],
     security: {
        dockerBench: 'passed',
        vulnerabilities: [
            { id: 'CVE-2024-1234', severity: 'High', status: 'Pending', package: 'glibc', version: '2.31-r0' },
            { id: 'CVE-2024-5678', severity: 'Low', status: 'Patched', package: 'libcrypto1.1', version: '1.1.1k-r0' },
        ],
        permissions: 'ninguno'
    },
    history: {
        responseTime: 80,
        uptimePercent: 99.99,
        events: 890432,
        performance: [
            { hour: '12 AM', cpu: 8, ram: 1200 }, { hour: '3 AM', cpu: 7, ram: 1190 },
            { hour: '6 AM', cpu: 9, ram: 1220 }, { hour: '9 AM', cpu: 12, ram: 1250 },
            { hour: '12 PM', cpu: 10, ram: 1230 }, { hour: '3 PM', cpu: 9, ram: 1210 },
            { hour: '6 PM', cpu: 11, ram: 1240 }, { hour: '9 PM', cpu: 8, ram: 1228 },
        ]
    }
  },
  'sdp_worker_1': {
    name: 'sdp_worker_1',
    status: 'exited',
    uptime: 'N/A',
    restarts: 5,
    health: 'unhealthy',
    image: 'sdp-worker:3.0.0',
    cpu: 0,
    memory: { used: 0, total: 1024 },
    disk: { read: 0, write: 0 },
    network: { in: 0, out: 0 },
    logs: [
      { level: 'ERROR', msg: 'Failed to connect to Redis: connection refused' },
      { level: 'INFO', msg: 'Worker process exited with code 1' },
    ],
    security: {
        dockerBench: 'failed',
        vulnerabilities: [],
        permissions: 'CAP_SYS_ADMIN'
    },
    history: {
        responseTime: 0,
        uptimePercent: 85.5,
        events: 50,
        performance: []
    }
  },
};

const HeaderCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) => (
    <Card className={`relative overflow-hidden border-l-4 ${color} bg-card/80 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-4xl font-bold">{value}</p>
            </div>
            <Icon className="h-12 w-12 text-muted-foreground/30" />
        </CardContent>
    </Card>
);

const ResourceChart = ({ value, total, label, color, icon: Icon }: { value: number, total: number, label: string, color: string, icon: React.ElementType }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex-shrink-0">
                 <div
                    className="relative flex items-center justify-center"
                    style={{ width: 64, height: 64 }}
                >
                    <svg
                        width={64} height={64} viewBox="0 0 64 64" className="transform -rotate-90" >
                        <circle className="text-muted/20" stroke="currentColor" strokeWidth={6} fill="transparent" r={26} cx={32} cy={32} />
                        <circle
                            className={`transition-all duration-1000 ease-out ${color}`}
                            stroke="currentColor" strokeWidth={6} strokeDasharray={2 * Math.PI * 26}
                            strokeDashoffset={(2 * Math.PI * 26) - (percentage / 100) * (2 * Math.PI * 26)}
                            strokeLinecap="round" fill="transparent" r={26} cx={32} cy={32} />
                    </svg>
                    <div className={`absolute flex items-center justify-center h-full w-full ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </div>
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-2xl font-bold">{value}<span className="text-sm font-normal text-muted-foreground">/{total}</span></p>
            </div>
        </div>
    );
};

const LogViewer = ({ logs }: { logs: { level: string, msg: string }[] }) => {
    const getLevelColor = (level: string) => {
        if (level === 'ERROR') return 'text-red-400';
        if (level === 'WARN') return 'text-yellow-400';
        return 'text-green-400';
    };
    return (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white h-64 overflow-y-auto shadow-inner">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-4">
                    <span className={getLevelColor(log.level)}>[{log.level}]</span>
                    <span className="flex-1 whitespace-pre-wrap">{log.msg}</span>
                </div>
            ))}
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (
    <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="text-sm font-semibold text-foreground">{value}</div>
        </div>
    </div>
);


export default function DockerReportsPage() {
    const [selectedContainer, setSelectedContainer] = useState('sgu_api_1');
    const data = containerData[selectedContainer as keyof typeof containerData] || Object.values(containerData)[0];

    const stats = {
        running: Object.values(containerData).filter(c => c.status === 'running').length,
        stopped: Object.values(containerData).filter(c => c.status === 'exited').length,
        problems: Object.values(containerData).filter(c => c.health !== 'healthy').length,
    };
    
    const accordionItems = [
        { id: "resources", title: "Uso de recursos (CPU, RAM, red, disco)", description: "Útil para analizar rendimiento y detectar cuellos de botella.", icon: Cpu, color: "border-cyan-500" },
        { id: "health", title: "Estado y salud de contenedores", description: "Útil para garantizar disponibilidad y detectar errores de arranque.", icon: Power, color: "border-green-500" },
        { id: "logs", title: "Logs de aplicaciones", description: "Útil para debugging, errores en tiempo de ejecución y análisis de eventos.", icon: FileText, color: "border-amber-500" },
        { id: "security", title: "Seguridad y vulnerabilidades", description: "Útil para cumplimiento, hardening y prevención de ataques.", icon: Shield, color: "border-red-500" },
        { id: "history", title: "Reportes históricos de desempeño", description: "Ideal para dashboards de monitoreo continuo.", icon: BarChart2, color: "border-indigo-500" },
    ];
    
    const historyChartConfig: ChartConfig = {
      cpu: { label: "CPU (%)", color: "hsl(var(--chart-1))" },
      ram: { label: "RAM (MB)", color: "hsl(var(--chart-2))" },
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reportes de Contenedores Docker</h1>
                    <p className="text-muted-foreground">Monitorización y análisis del ecosistema de contenedores.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/reportes">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Reportes
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <HeaderCard title="En ejecución" value={stats.running} icon={CheckCircle} color="border-green-500" />
                <HeaderCard title="Detenidos" value={stats.stopped} icon={XCircle} color="border-slate-500" />
                <HeaderCard title="Con problemas" value={stats.problems} icon={TriangleAlert} color="border-red-500" />
            </div>

            <Card className="shadow-xl">
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Análisis por Contenedor</CardTitle>
                        <CardDescription>Seleccione un contenedor para ver sus detalles.</CardDescription>
                    </div>
                     <Select value={selectedContainer} onValueChange={setSelectedContainer}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Seleccionar contenedor" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(containerData).map(key => (
                                <SelectItem key={key} value={key}>{containerData[key as keyof typeof containerData].name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                     <motion.div
                        key={selectedContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                         <Accordion type="multiple" defaultValue={["resources"]} className="w-full space-y-4">
                            {accordionItems.map(item => (
                                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                                     <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                        <Card className={`overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${item.color}`}>
                                            <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/50">
                                                <div className="flex items-center gap-4 text-left">
                                                    <item.icon className={`h-8 w-8 ${item.color.replace('border-', 'text-')}`} />
                                                    <div>
                                                        <h4 className="font-semibold text-base">{item.title}</h4>
                                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                                    </div>
                                                </div>
                                                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                            </AccordionTrigger>
                                            <AccordionContent className="p-6 bg-background/50">
                                                 {item.id === 'resources' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <ResourceChart value={data.cpu} total={100} label="CPU (%)" color="text-cyan-400" icon={Cpu} />
                                                        <ResourceChart value={data.memory.used} total={data.memory.total} label="Memoria (MB)" color="text-fuchsia-400" icon={Database} />
                                                        <InfoItem icon={Network} label="Red (Entrada/Salida)" value={`${data.network.in}GB / ${data.network.out}GB`} />
                                                        <InfoItem icon={HardDrive} label="Disco (Lectura/Escritura)" value={`${data.disk.read}MB / ${data.disk.write}MB`} />
                                                    </div>
                                                )}
                                                {item.id === 'health' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <InfoItem icon={data.status === 'running' ? CheckCircle : XCircle} label="Estado" value={<Badge variant={data.status === 'running' ? 'default' : 'destructive'} className={data.status === 'running' ? 'bg-green-600' : ''}>{data.status}</Badge>} />
                                                        <InfoItem icon={Shield} label="Healthcheck" value={<Badge variant={data.health === 'healthy' ? 'secondary' : 'destructive'}>{data.health}</Badge>} />
                                                        <InfoItem icon={RefreshCw} label="Reinicios" value={data.restarts} />
                                                        <InfoItem icon={Power} label="Tiempo activo" value={data.uptime} />
                                                    </div>
                                                )}
                                                {item.id === 'logs' && <LogViewer logs={data.logs} />}
                                                {item.id === 'security' && (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                                            <Card className="p-4">
                                                                <h4 className="font-semibold text-sm mb-1">Docker Bench</h4>
                                                                {data.security.dockerBench === 'passed' ? (
                                                                    <div className="flex items-center justify-center gap-2 text-green-600">
                                                                        <ShieldCheckIcon className="h-5 w-5" />
                                                                        <span className="font-bold">Pasó</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center justify-center gap-2 text-red-600">
                                                                        <XCircle className="h-5 w-5" />
                                                                        <span className="font-bold">Falló</span>
                                                                    </div>
                                                                )}
                                                            </Card>
                                                            <Card className="p-4">
                                                                <h4 className="font-semibold text-sm mb-1">Vulnerabilidades Críticas</h4>
                                                                <p className="text-2xl font-bold text-red-500">{data.security.vulnerabilities.filter(v => v.severity === 'High').length}</p>
                                                            </Card>
                                                            <Card className="p-4">
                                                                <h4 className="font-semibold text-sm mb-1">Permisos Excesivos</h4>
                                                                 {data.security.permissions === 'ninguno' ? (
                                                                    <p className="text-lg font-bold text-green-600">Ninguno</p>
                                                                ) : (
                                                                    <p className="text-lg font-bold text-red-500">{data.security.permissions}</p>
                                                                )}
                                                            </Card>
                                                        </div>
                                                        <div className="border rounded-lg overflow-hidden">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>CVE ID</TableHead>
                                                                        <TableHead>Paquete</TableHead>
                                                                        <TableHead>Versión</TableHead>
                                                                        <TableHead>Severidad</TableHead>
                                                                        <TableHead>Estado</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {data.security.vulnerabilities.length > 0 ? data.security.vulnerabilities.map(vuln => (
                                                                        <TableRow key={vuln.id}>
                                                                            <TableCell className="font-mono">{vuln.id}</TableCell>
                                                                            <TableCell>{vuln.package}</TableCell>
                                                                            <TableCell>{vuln.version}</TableCell>
                                                                            <TableCell><Badge variant={vuln.severity === 'High' ? 'destructive' : 'secondary'}>{vuln.severity}</Badge></TableCell>
                                                                            <TableCell><Badge variant={vuln.status === 'Patched' ? 'default' : 'outline'} className={vuln.status === 'Patched' ? 'bg-green-600' : ''}>{vuln.status}</Badge></TableCell>
                                                                        </TableRow>
                                                                    )) : <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No se encontraron vulnerabilidades.</TableCell></TableRow>}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.id === 'history' && (
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <Card className="bg-background/50"><CardHeader><CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.history.responseTime}ms</p></CardContent></Card>
                                                            <Card className="bg-background/50"><CardHeader><CardTitle className="text-sm font-medium">Uptime</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.history.uptimePercent}%</p></CardContent></Card>
                                                            <Card className="bg-background/50"><CardHeader><CardTitle className="text-sm font-medium">Eventos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.history.events.toLocaleString()}</p></CardContent></Card>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Uso histórico de CPU y RAM (Últimas 24h)</h4>
                                                            <ChartContainer config={historyChartConfig} className="h-[250px] w-full">
                                                                <RechartsPrimitive.LineChart data={data.history.performance}>
                                                                    <RechartsPrimitive.CartesianGrid vertical={false} />
                                                                    <RechartsPrimitive.XAxis dataKey="hour" tickLine={false} tickMargin={10} axisLine={false} />
                                                                    <RechartsPrimitive.YAxis />
                                                                    <ChartTooltip content={<ChartTooltipContent />} />
                                                                    <RechartsPrimitive.Legend />
                                                                    <RechartsPrimitive.Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} dot={false} />
                                                                    <RechartsPrimitive.Line type="monotone" dataKey="ram" stroke="var(--color-ram)" strokeWidth={2} dot={false} />
                                                                </RechartsPrimitive.LineChart>
                                                            </ChartContainer>
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </Card>
                                     </motion.div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
