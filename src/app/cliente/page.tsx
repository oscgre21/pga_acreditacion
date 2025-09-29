"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bell, CheckCircle, FolderOpen, PlaneTakeoff, RefreshCw, ArrowDown, Users, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useClientPortal } from '@/contexts/client-portal-context';

const TravelGoLogo = () => (
    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-1">
        <div className="h-full w-full flex items-center justify-center rounded-xl bg-white/20">
            <PlaneTakeoff className="h-7 w-7 text-white" />
        </div>
    </div>
);

const statCardsData = [
    { id: "tramites-proceso" as const, title: "Trámites en Proceso", value: "8", icon: RefreshCw, color: { bg: "bg-cyan-500", text: "text-cyan-500", shadowColor: "rgba(6, 182, 212, 0.4)" } },
    { id: "tramites-completados" as const, title: "Trámites Completados", value: "42", icon: CheckCircle, color: { bg: "bg-green-500", text: "text-green-500", shadowColor: "rgba(34, 197, 94, 0.4)" } },
    { id: "documentos-pendientes" as const, title: "Documentos Pendientes", value: "3", icon: FolderOpen, color: { bg: "bg-yellow-500", text: "text-yellow-500", shadowColor: "rgba(234, 179, 8, 0.4)" } },
    { id: "notificaciones" as const, title: "Notificaciones", value: "3", icon: Bell, color: { bg: "bg-red-500", text: "text-red-500", shadowColor: "rgba(239, 68, 68, 0.4)" } },
    { id: "personal-activo" as const, title: "Personal Activo", value: "25", icon: Users, color: { bg: "bg-purple-500", text: "text-purple-500", shadowColor: "rgba(139, 92, 246, 0.4)" } },
    { id: "vencimientos-proximos" as const, title: "Vencimientos Próximos", value: "5", icon: CalendarClock, color: { bg: "bg-indigo-500", text: "text-indigo-500", shadowColor: "rgba(99, 102, 241, 0.4)" } },
];


const recentTramites = [
    { id: 'S-58291', producto: 'Certificación y Renovación de Certificado', tipo: 'Empresa', estado: 'En Proceso', fecha: '2024-07-28' },
    { id: 'P-12345', producto: 'Certificación del personal de seguridad privada', tipo: 'Personal', estado: 'Completado', fecha: '2024-07-25' },
    { id: 'S-98765', producto: 'Revisión y Aprobación de Programas', tipo: 'Empresa', estado: 'Requiere Atención', fecha: '2024-07-22' },
    { id: 'P-67890', producto: 'Certificación y Renovación de Certificado', tipo: 'Personal', estado: 'Completado', fecha: '2024-07-15' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'En Proceso': return <Badge variant="secondary" className="bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">En Proceso</Badge>;
        case 'Completado': return <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300">Completado</Badge>;
        case 'Requiere Atención': return <Badge variant="destructive">Requiere Atención</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ClientDashboardPage() {
    const { visibleCards } = useClientPortal();

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
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

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground drop-shadow-md">Bienvenidos</h1>
                <p className="mt-1 text-muted-foreground">Resumen de alto nivel de sus actividades y estado de cuenta.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {statCardsData.filter(card => visibleCards[card.id]).map((card, index) => {
                    const colors = card.color;
                    const number = String(index + 1).padStart(2, '0');
                    return (
                        <div key={card.title} className="relative pt-6 transition-transform duration-300 ease-in-out hover:-translate-y-2">
                            {/* Colored Tab */}
                            <div
                                style={{ '--shadow-color': colors.shadowColor } as React.CSSProperties}
                                className={cn(
                                    'absolute top-0 left-1/2 -translate-x-1/2 w-[85%] rounded-lg px-4 py-2 z-10 flex items-center justify-between',
                                    colors.bg,
                                    'shadow-[0_10px_20px_-5px_var(--shadow-color)]'
                                )}
                            >
                                <p className="text-2xl font-bold text-white">{number}</p>
                                <ArrowDown className="h-5 w-5 text-white/70" />
                            </div>
                            
                            {/* Main Content Card */}
                            <Card className="shadow-lg pt-12 pb-4 text-center bg-card">
                                <CardContent className="p-2 flex flex-col items-center justify-center min-h-[150px]">
                                    <h4 className={cn('font-bold uppercase tracking-wider text-sm', colors.text)}>
                                    {card.title}
                                    </h4>
                                    <p className="text-5xl font-extrabold text-foreground my-2">
                                    {card.value}
                                    </p>
                                    <div className={cn('flex justify-center mt-2', colors.text)}>
                                    <card.icon className="h-6 w-6"/>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            <Card className="shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ease-in-out">
                <CardHeader>
                    <CardTitle>Últimos Trámites</CardTitle>
                    <CardDescription>Un resumen de sus solicitudes más recientes.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Trámite</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTramites.map(tramite => (
                                    <TableRow key={tramite.id}>
                                        <TableCell className="font-mono text-primary font-semibold">{tramite.id}</TableCell>
                                        <TableCell className="font-medium">{tramite.producto}</TableCell>
                                        <TableCell className="text-muted-foreground">{tramite.tipo}</TableCell>
                                        <TableCell className="text-muted-foreground">{tramite.fecha}</TableCell>
                                        <TableCell>{getStatusBadge(tramite.estado)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="#">Ver Detalles</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
