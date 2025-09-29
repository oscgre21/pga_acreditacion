
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { ArrowRight, Check, AppWindow, CheckCircle, Users, TrendingUp, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import { initialApps } from "./data";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const KPICard = ({ title, value, icon: Icon, description, colorClass, progressValue }: { title: string, value: string | number, icon: React.ElementType, description?: string, colorClass?: string, progressValue?: number }) => {
    const [clientValue, setClientValue] = React.useState<string | null>(null);

    React.useEffect(() => {
        // This effect runs only on the client, after hydration, to prevent mismatch
        if (typeof value === 'number') {
            setClientValue(value.toLocaleString());
        } else {
            setClientValue(value);
        }
    }, [value]);
    
    return (
        <Card className="shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl border-t-4 border-transparent hover:border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={cn("h-5 w-5 text-muted-foreground", colorClass)} />
            </CardHeader>
            <CardContent>
                <div className={cn("text-3xl font-bold", colorClass)}>{clientValue ?? value.toString()}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                {progressValue !== undefined && <Progress value={progressValue} className="mt-2 h-2" />}
            </CardContent>
        </Card>
    );
};


export default function PerfilesPGASummaryPage() {
    
    const recentApps = initialApps.slice(0, 5);

    const stats = React.useMemo(() => {
        const total = initialApps.length;
        const activas = initialApps.filter(app => app.activa).length;
        const adopcion = total > 0 ? Math.round((activas / total) * 100) : 0;
        const totalUsers = 790; // Updated from 9500
        return { total, activas, adopcion, totalUsers };
    }, []);


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard de Aplicaciones</h1>
                <p className="text-muted-foreground">Un vistazo a las aplicaciones más recientes y acceso rápido a la gestión.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Aplicaciones Totales" value={stats.total} icon={AppWindow} description="Sistemas registrados" colorClass="text-blue-500" />
                <KPICard title="Aplicaciones Activas" value={stats.activas} icon={CheckCircle} description="Sistemas actualmente en uso" colorClass="text-green-500" />
                <KPICard title="Usuarios Registrados" value={stats.totalUsers} icon={Users} description="Total de usuarios en la plataforma" colorClass="text-cyan-500" />
                <KPICard title="Tasa de Adopción" value={`${stats.adopcion}%`} icon={TrendingUp} description="Porcentaje de apps activas" colorClass="text-purple-500" progressValue={stats.adopcion} />
            </div>
            
             <Card className="shadow-2xl transition-all duration-300 ease-in-out hover:shadow-primary/20">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        <CardTitle>Últimas Aplicaciones Registradas</CardTitle>
                        <CardDescription>Estas son las 5 aplicaciones más recientes añadidas al sistema.</CardDescription>
                    </div>
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform w-full md:w-auto">
                        <Link href="/dashboard/perfiles-pga/form">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Nueva Aplicación
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Logo</TableHead>
                                    <TableHead className="w-[150px]">Siglas</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Versión</TableHead>
                                    <TableHead>Última Actualización</TableHead>
                                    <TableHead>Última Auditoría</TableHead>
                                    <TableHead className="text-center w-[100px]">Activa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentApps.map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                                                <AvatarFallback><app.logo className="h-5 w-5"/></AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{app.id}</TableCell>
                                        <TableCell>{app.nombre}</TableCell>
                                        <TableCell className="text-muted-foreground">{app.version}</TableCell>
                                        <TableCell className="text-muted-foreground">{app.lastUpdate}</TableCell>
                                        <TableCell className="text-muted-foreground">{app.lastAudit}</TableCell>
                                        <TableCell className="text-center">{app.activa && <Check className="h-5 w-5 text-green-500 mx-auto" />}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                 <CardFooter className="justify-center border-t p-4">
                    <Button variant="link" asChild>
                        <Link href="/dashboard/perfiles-pga/list">
                            Ver todas las aplicaciones <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
