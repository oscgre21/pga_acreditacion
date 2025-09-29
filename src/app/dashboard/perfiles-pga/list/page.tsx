
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
import { 
    PlusCircle, 
    AppWindow, 
    Pencil, 
    Trash2, 
    Check,
    CheckCircle,
    XCircle,
    TrendingUp,
    ArrowLeft,
    Activity,
    Users as UsersIcon,
    GitBranch,
    Calendar,
    Fingerprint,
    ShieldAlert,
    Code,
    Link as LinkIcon,
    ArrowRightLeft,
    UserCog,
    ChevronDown,
    FileText,
    Download,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { initialApps } from "../data";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PgaLogo } from "@/components/gateway-pga-logo";


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
                <div className={cn("text-3xl font-bold", colorClass)}>{clientValue ?? String(value)}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                {progressValue !== undefined && <Progress value={progressValue} className="mt-2 h-2" />}
            </CardContent>
        </Card>
    );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode; }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">{value || 'No disponible'}</p>
        </div>
    </div>
);

const AppDetailView = ({ app }: { app: typeof initialApps[0] }) => {
    const getIncidentBadge = (type: string) => {
        switch (type.toLowerCase()) {
            case 'crítico': return 'destructive';
            case 'advertencia': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="print-section">
            <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-white dark:from-slate-900/95 dark:via-slate-800/95 dark:to-gray-900/95 p-4 md:p-6 backdrop-blur-xl">
                 <Card className="w-full bg-transparent border-none shadow-none">
                    <CardHeader className="p-0 mb-4">
                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl text-primary flex items-center gap-3">
                                    <app.logo className="h-7 w-7" />
                                    {app.nombre}
                                </CardTitle>
                                <CardDescription className="pl-10">{app.id}</CardDescription>
                            </div>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                        <Card className="shadow-lg bg-card/60 border-border/20">
                            <CardHeader>
                                <CardTitle className="text-base text-primary">Descripción del Aplicativo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{app.descripcion}</p>
                            </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-6">
                                <Card className="shadow-xl bg-card/60 border-border/20 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10">
                                    <CardHeader><CardTitle className="text-base text-primary">Detalles de Uso</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <InfoItem icon={Activity} label="Uso (Últimas 72h)" value={`${app.users72h} usuarios`} />
                                        <InfoItem icon={UsersIcon} label="Usuarios Registrados" value={`${app.totalUsers} usuarios`} />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-xl bg-card/60 border-border/20 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10">
                                    <CardHeader><CardTitle className="text-base text-primary">Incidentes</CardTitle></CardHeader>
                                    <CardContent>
                                        {app.incidents.length > 0 ? (
                                            <ul className="space-y-3">
                                            {app.incidents.map((incident, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <Badge variant={getIncidentBadge(incident.type)}>{incident.type}</Badge>
                                                        <p className="text-sm text-muted-foreground mt-1">{incident.count} caso(s): {incident.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No hay incidentes reportados.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <Card className="shadow-xl bg-card/60 border-border/20 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10 lg:col-span-2">
                                <CardHeader><CardTitle className="text-base text-primary">Información Detallada</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                       <InfoItem icon={GitBranch} label="Versión" value={app.version} />
                                       <InfoItem icon={Calendar} label="Última Actualización" value={app.lastUpdate} />
                                       <InfoItem icon={Fingerprint} label="Última Auditoría" value={`${app.lastAudit} por ${app.auditor}`} />
                                       <InfoItem icon={UserCog} label="Programador Asignado" value={app.assignedDev} />
                                       <InfoItem icon={UserCog} label="Desarrollo Backend" value={app.backendDev} />
                                       <InfoItem icon={UserCog} label="Desarrollo Frontend" value={app.frontendDev} />
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                       <InfoItem icon={Code} label="Cliente ID" value={<span className="font-mono">{app.clientId}</span>} />
                                       <InfoItem icon={Code} label="Código" value={<span className="font-mono">{app.code}</span>} />
                                       <InfoItem icon={LinkIcon} label="URL Destino" value={<a href={app.urlDestino} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{app.urlDestino}</a>} />
                                       <InfoItem icon={ArrowRightLeft} label="URL Redirección" value={<a href={app.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{app.redirectUrl}</a>} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const FichaTecnicaReport = ({ app }: { app: typeof initialApps[0] }) => {
    return (
        <div className="bg-white text-black p-8 font-sans">
            <header className="flex justify-between items-center pb-4 border-b-2 border-gray-800">
                <PgaLogo />
                <div className="text-right">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-wider">FICHA TÉCNICA</h1>
                    <p className="text-lg text-gray-600">Portal de Gestión Administrativa (PGA)</p>
                </div>
            </header>
            <main className="mt-8 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2">Información de la Aplicación</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <p><strong>Nombre:</strong> {app.nombre}</p>
                        <p><strong>Siglas:</strong> {app.id}</p>
                        <p><strong>Versión Actual:</strong> {app.version}</p>
                        <p><strong>Estado:</strong> <span className={app.activa ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{app.activa ? 'Activa' : 'Inactiva'}</span></p>
                        <p className="col-span-2"><strong>Descripción:</strong> {app.descripcion}</p>
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2">Detalles Técnicos y de Desarrollo</h2>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <p><strong>URL Destino:</strong> <a href={app.urlDestino} className="text-blue-600">{app.urlDestino}</a></p>
                        <p><strong>URL Redirección:</strong> <a href={app.redirectUrl} className="text-blue-600">{app.redirectUrl}</a></p>
                        <p><strong>Stack Tecnológico:</strong> {app.technicalDetails.stack.join(', ')}</p>
                        <p><strong>Arquitectura:</strong> {app.technicalDetails.architecture}</p>
                        <p><strong>Base de Datos:</strong> {app.technicalDetails.database}</p>
                        <p><strong>Repositorio:</strong> <a href={`https://${app.technicalDetails.repository}`} className="text-blue-600">{app.technicalDetails.repository}</a></p>
                        <p><strong>Responsable Asignado:</strong> {app.assignedDev}</p>
                        <p><strong>Desarrollador Backend:</strong> {app.backendDev}</p>
                        <p><strong>Desarrollador Frontend:</strong> {app.frontendDev}</p>
                    </div>
                </section>
                 <section>
                    <h2 className="text-xl font-bold text-primary mb-4 border-b pb-2">Auditoría y Mantenimiento</h2>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <p><strong>Última Actualización:</strong> {app.lastUpdate}</p>
                        <p><strong>Última Auditoría:</strong> {app.lastAudit}</p>
                        <p><strong>Auditor:</strong> {app.auditor}</p>
                    </div>
                </section>
            </main>
             <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                Confidencial - Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC)
            </footer>
        </div>
    )
}


export default function PerfilesPGAListPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [apps, setApps] = React.useState(initialApps);
    const [openAppId, setOpenAppId] = React.useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);
    const [isFichaTecnicaModalOpen, setIsFichaTecnicaModalOpen] = React.useState(false);
    const [selectedApp, setSelectedApp] = React.useState<(typeof initialApps[0]) | null>(null);
    const fichaTecnicaRef = React.useRef(null);


    const handleRowClick = (appId: string) => {
        setOpenAppId(prevId => (prevId === appId ? null : appId));
    };

    const handleDelete = (e: React.MouseEvent, appId: string) => {
        e.stopPropagation(); 
        const app = apps.find(a => a.id === appId);
        if (app) {
            setApps(prev => prev.filter(a => a.id !== appId));
            toast({
                title: "Aplicación Eliminada",
                description: `La aplicación "${app.nombre}" ha sido eliminada.`,
                variant: "destructive",
            });
        }
    };
    
    const stats = React.useMemo(() => {
        const total = apps.length;
        const activas = apps.filter(app => app.activa).length;
        const inactivas = total - activas;
        const adopcion = total > 0 ? Math.round((activas / total) * 100) : 0;
        const totalUsers = 790;
        return { total, activas, inactivas, adopcion, totalUsers };
    }, [apps]);

    const handleContinueReport = () => {
        if (selectedApp) {
            router.push(`/dashboard/reportes/incidentes?app=${selectedApp.id}`);
        }
    };

    const handleOpenFichaTecnica = (e: React.MouseEvent, app: typeof initialApps[0]) => {
        e.stopPropagation();
        setSelectedApp(app);
        setIsFichaTecnicaModalOpen(true);
    };
    
    const handleDownloadFicha = async () => {
        const element = fichaTecnicaRef.current;
        if (!element || !selectedApp) return;

        toast({ title: "Generando PDF...", description: `Ficha Técnica para ${selectedApp.nombre}.` });

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / ratio;

        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * ratio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save(`ficha-tecnica-${selectedApp.id}.pdf`);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Aplicaciones Totales" value={stats.total} icon={AppWindow} description="Sistemas registrados en el portal" colorClass="text-blue-500" />
                <KPICard title="Aplicaciones Activas" value={stats.activas} icon={CheckCircle} description={`${stats.inactivas} inactivas`} colorClass="text-green-500" />
                <KPICard title="Usuarios Registrados" value={stats.totalUsers} icon={UsersIcon} description="Total en todas las apps" colorClass="text-cyan-500" />
                <KPICard title="Tasa de Adopción" value={`${stats.adopcion}%`} icon={TrendingUp} description="Porcentaje de apps activas" colorClass="text-purple-500" progressValue={stats.adopcion} />
            </div>

            <Card className="shadow-2xl transition-all duration-300 ease-in-out hover:shadow-primary/20">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        <CardTitle>Listado Completo de Aplicaciones</CardTitle>
                        <CardDescription>Busque, filtre y gestione todas las aplicaciones del sistema.</CardDescription>
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-2 flex-wrap">
                         <Button asChild variant="outline" className="w-full sm:w-auto">
                            <Link href="/dashboard/perfiles-pga">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button>
                        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform w-full sm:w-auto"
                                    onClick={() => setSelectedApp(null)}
                                >
                                    <ShieldAlert className="mr-2 h-5 w-5" />
                                    Reportar Incidente
                                </Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Reportar un Incidente</DialogTitle>
                                <DialogDescription>
                                    Seleccione la aplicación en la que ocurrió el incidente para continuar.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-2">
                                <Label htmlFor="app-select-report">Aplicación</Label>
                                <Select onValueChange={(value) => setSelectedApp(apps.find(a => a.id === value) || null)}>
                                    <SelectTrigger id="app-select-report">
                                    <SelectValue placeholder="Seleccione una aplicación..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {apps.map(app => (
                                        <SelectItem key={app.id} value={app.id}>
                                        {app.nombre}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </div>
                                <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Cancelar</Button>
                                <Button
                                    disabled={!selectedApp}
                                    onClick={handleContinueReport}
                                >
                                    Continuar
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform w-full sm:w-auto">
                            <Link href="/dashboard/perfiles-pga/form">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Nueva Aplicación
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-blue-800 text-white">
                                <TableRow className="hover:bg-blue-800">
                                    <TableHead className="w-[100px] p-4 text-white">Logo</TableHead>
                                    <TableHead className="w-[150px] text-white">Siglas</TableHead>
                                    <TableHead className="min-w-[250px] text-white">Nombre</TableHead>
                                    <TableHead className="min-w-[150px] text-white">Última Actualización</TableHead>
                                    <TableHead className="min-w-[150px] text-white">Última Auditoría</TableHead>
                                    <TableHead className="w-[150px] text-white">Activa</TableHead>
                                    <TableHead className="w-[150px] text-white text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apps.map(app => (
                                    <React.Fragment key={app.id}>
                                        <TableRow 
                                            onClick={() => handleRowClick(app.id)}
                                            className={cn("cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1",
                                                !app.activa ? "bg-destructive/20 hover:bg-destructive/30" : "hover:bg-muted/30"
                                            )}
                                        >
                                            <TableCell>
                                                <Avatar className="h-10 w-10 bg-primary/10 text-primary border border-muted/50">
                                                    <AvatarFallback><app.logo className="h-5 w-5"/></AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{app.id}</TableCell>
                                            <TableCell>{app.nombre}</TableCell>
                                            <TableCell className="text-muted-foreground">{app.lastUpdate}</TableCell>
                                            <TableCell className="text-muted-foreground">{app.lastAudit}</TableCell>
                                            <TableCell>
                                                {app.activa && <Check className="h-5 w-5 text-green-500" />}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => handleOpenFichaTecnica(e, app)}>
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/dashboard/perfiles-pga/form?id=${app.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Está seguro de eliminar esta aplicación?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Esto eliminará permanentemente la aplicación <span className="font-bold">{app.nombre}</span>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={(e) => handleDelete(e, app.id)} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <ChevronDown className={cn("inline-block h-5 w-5 ml-2 text-muted-foreground transition-transform", openAppId === app.id && "rotate-180")} />
                                            </TableCell>
                                        </TableRow>
                                        {openAppId === app.id && (
                                            <tr className="bg-muted/10 hover:bg-muted/10">
                                                <TableCell colSpan={7} className="p-0">
                                                    <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
                                                        <AppDetailView app={app} />
                                                    </div>
                                                </TableCell>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isFichaTecnicaModalOpen} onOpenChange={setIsFichaTecnicaModalOpen}>
                <DialogContent className="max-w-4xl p-0">
                   <div ref={fichaTecnicaRef}>
                     {selectedApp && <FichaTecnicaReport app={selectedApp} />}
                   </div>
                   <DialogFooter className="p-4 border-t">
                        <Button variant="outline" onClick={() => setIsFichaTecnicaModalOpen(false)}>Cerrar</Button>
                        <Button onClick={handleDownloadFicha}><Download className="mr-2 h-4 w-4"/>Descargar PDF</Button>
                   </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
