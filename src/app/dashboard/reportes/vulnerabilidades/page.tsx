

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    FileText, 
    ArrowLeft, 
    ShieldQuestion, 
    Download, 
    FileSpreadsheet, 
    FileJson, 
    Printer, 
    CheckCircle, 
    AlertTriangle,
    ChevronDown,
    Activity,
    Calendar,
    Users,
    FileSearch,
    X,
    Lightbulb,
    ShieldCheck,
    GitBranch,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const PgaReportLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="100" height="100" rx="15" fill="#1A237E" />
        <text
            x="50%"
            y="52%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="40"
            fontWeight="800"
            fill="white"
            letterSpacing="-1"
        >
            PGA
        </text>
    </svg>
);


// Enhanced mock data for vulnerabilities
const vulnerabilityData = [
    { id: 'VULN-001', detectionDate: '2024-07-25', component: 'sgu_api_1', description: 'SQL Injection in user search endpoint.', cve: 'CVE-2023-4567', severity: 'Crítica', status: 'Pendiente', assignee: 'Carlos Martinez', resolutionEta: '2024-08-05', cvssScore: 9.8, attackVector: 'Network', technicalRecommendation: 'Use parameterized queries.' },
    { id: 'VULN-002', detectionDate: '2024-07-22', component: 'scu_db_1', description: 'Outdated PostgreSQL version with known exploits.', cve: 'CVE-2024-1234', severity: 'Alta', status: 'En curso', assignee: 'Luisa Fernandez', resolutionEta: '2024-08-10', cvssScore: 7.5, attackVector: 'Local', technicalRecommendation: 'Upgrade to version 14.5 or newer.' },
    { id: 'VULN-003', detectionDate: '2024-07-20', component: 'sgu_api_1', description: 'Cross-Site Scripting (XSS) in profile page.', cve: 'CVE-2023-7890', severity: 'Media', status: 'Mitigado', assignee: 'Kendy Qualey', resolutionEta: '2024-07-28', cvssScore: 6.1, attackVector: 'Network', technicalRecommendation: 'Sanitize user inputs on the frontend and backend.' },
    { id: 'VULN-004', detectionDate: '2024-06-15', component: 'sdp_worker_1', description: 'Insecure default permissions for worker container.', cve: 'N/A', severity: 'Baja', status: 'Mitigado', assignee: 'Carlos Martinez', resolutionEta: '2024-06-20', cvssScore: 3.3, attackVector: 'Local', technicalRecommendation: 'Run container with a non-root user.' },
    { id: 'VULN-005', detectionDate: '2024-07-28', component: 'rrhh_frontend', description: 'Improper error handling reveals stack trace.', cve: 'N/A', severity: 'Media', status: 'Pendiente', assignee: 'Jorge Diaz', resolutionEta: '2024-08-12', cvssScore: 5.3, attackVector: 'Network', technicalRecommendation: 'Implement generic error pages for production environment.' },
];

const trendData = [
  { month: "Mar", detected: 12, resolved: 8, accumulated: 20 },
  { month: "Abr", detected: 15, resolved: 10, accumulated: 25 },
  { month: "May", detected: 8, resolved: 12, accumulated: 21 },
  { month: "Jun", detected: 5, resolved: 9, accumulated: 17 },
  { month: "Jul", detected: 3, resolved: 10, accumulated: 10 },
];

const severityDistribution = [
  { severity: "Crítica", value: 1, fill: "hsl(0 84.2% 60.2%)" },
  { severity: "Alta", value: 1, fill: "hsl(24.6 95% 53.1%)" },
  { severity: "Media", value: 2, fill: "hsl(47.9 95.8% 53.1%)" },
  { severity: "Baja", value: 1, fill: "hsl(142.1 76.2% 36.3%)" },
];

const statusDistribution = [
  { status: "Pendiente", value: 2, fill: "hsl(0 84.2% 60.2%)" },
  { status: "En curso", value: 1, fill: "hsl(47.9 95.8% 53.1%)" },
  { status: "Mitigado", value: 2, fill: "hsl(142.1 76.2% 36.3%)" },
];

const severityChartConfig: ChartConfig = {
  value: { label: "Vulnerabilidades" },
  critical: { label: "Crítica", color: "hsl(0 84.2% 60.2%)" },
  high: { label: "Alta", color: "hsl(24.6 95% 53.1%)" },
  medium: { label: "Media", color: "hsl(47.9 95.8% 53.1%)" },
  low: { label: "Baja", color: "hsl(142.1 76.2% 36.3%)" },
};

const statusChartConfig: ChartConfig = {
  value: { label: "Vulnerabilidades" },
  pending: { label: "Pendiente", color: "hsl(0 84.2% 60.2%)" },
  in_progress: { label: "En curso", color: "hsl(47.9 95.8% 53.1%)" },
  mitigated: { label: "Mitigado", color: "hsl(142.1 76.2% 36.3%)" },
};

const trendChartConfig = {
  detected: { label: "Detectadas", color: "hsl(var(--chart-5))" },
  resolved: { label: "Solucionadas", color: "hsl(var(--chart-2))" },
  accumulated: { label: "Acumuladas", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;


const KPICard = ({ title, value, icon: Icon, colorClass, description }: { title: string, value: string | number, icon: React.ElementType, colorClass: string, description: string }) => (
    <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${colorClass}`} />
        </CardHeader>
        <CardContent>
            <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <RechartsPrimitive.Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg"
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-sm font-semibold">{`${payload.severity || payload.status}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">{`(${(percent * 100).toFixed(0)}%)`}</text>
    </g>
  );
};


const VulnerabilityReport = ({ kpiData, onDownload }: { kpiData: any; onDownload: () => void; }) => {
    return (
        <div className="bg-gray-200 p-4 font-body mt-8 print-section">
            <div className="download-button-container fixed bottom-8 right-8 z-50 no-print">
                <Button onClick={onDownload} size="lg" className="rounded-full shadow-2xl bg-primary hover:bg-primary/90">
                    <Download className="mr-2 h-5 w-5" /> Descargar
                </Button>
            </div>
            <div id="pdf-content" className="max-w-4xl mx-auto bg-white">
                <div className="p-8">
                    <header className="flex justify-between items-start pb-4">
                        <div className="text-left">
                            <h1 className="text-2xl font-bold text-gray-800 tracking-wider">INFORME EJECUTIVO DE VULNERABILIDADES</h1>
                            <p className="text-sm text-gray-500">Generado el: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <PgaReportLogo className="h-20 w-auto flex-shrink-0" />
                    </header>
                    <div className="bg-primary text-primary-foreground py-2 px-4 rounded-md text-center font-semibold text-lg mb-8">
                        Portal de Gestión Administrativa (PGA) - Dirección de Tecnología
                    </div>
                    <main className="mt-8 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Resumen de Estado</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {kpiData.map((kpi: any) => (
                                    <KPICard key={kpi.title} {...kpi} />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Distribución de Vulnerabilidades</h2>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="shadow-lg">
                                    <CardHeader><CardTitle>Por Severidad</CardTitle></CardHeader>
                                    <CardContent>
                                        <ChartContainer config={severityChartConfig} className="h-[250px] w-full">
                                            <RechartsPrimitive.PieChart>
                                                <RechartsPrimitive.Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                                                <RechartsPrimitive.Pie data={severityDistribution} dataKey="value" nameKey="severity" innerRadius={60} outerRadius={80} labelLine={false}>
                                                    {severityDistribution.map((entry, index) => (
                                                        <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </RechartsPrimitive.Pie>
                                            </RechartsPrimitive.PieChart>
                                            <ChartLegendContent payload={severityDistribution.map(item => ({ value: item.severity, type: 'square', color: item.fill }))} nameKey="severity" />
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                 <Card className="shadow-lg">
                                    <CardHeader><CardTitle>Por Estado</CardTitle></CardHeader>
                                    <CardContent>
                                        <ChartContainer config={statusChartConfig} className="h-[250px] w-full">
                                            <RechartsPrimitive.PieChart>
                                                <RechartsPrimitive.Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                                                <RechartsPrimitive.Pie data={statusDistribution} dataKey="value" nameKey="status" innerRadius={60} outerRadius={80} labelLine={false}>
                                                    {statusDistribution.map((entry, index) => (
                                                        <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </RechartsPrimitive.Pie>
                                            </RechartsPrimitive.PieChart>
                                            <ChartLegendContent payload={statusDistribution.map(item => ({ value: item.status, type: 'square', color: item.fill }))} nameKey="status" />
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                        <section>
                             <h2 className="text-xl font-bold text-gray-700 mb-4">Recomendaciones y Políticas Violadas (ISO 27001)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-lg">
                                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb /> Recomendaciones</CardTitle></CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <p><strong>1. Actualización Urgente:</strong> Priorizar la actualización de PostgreSQL en `scu_db_1` para mitigar CVE-2024-1234.</p>
                                        <p><strong>2. Parametrización de Consultas:</strong> Implementar consultas parametrizadas en `sgu_api_1` para eliminar el riesgo de SQL Injection.</p>
                                        <p><strong>3. Hardening de Contenedores:</strong> Aplicar principios de mínimo privilegio en todos los contenedores, evitando el uso de root.</p>
                                    </CardContent>
                                </Card>
                                 <Card className="shadow-lg">
                                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck /> Políticas Violadas</CardTitle></CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <p><strong>A.12.1.2:</strong> Protección contra malware (versión desactualizada de PostgreSQL).</p>
                                        <p><strong>A.14.2.5:</strong> Principios de ingeniería de sistemas seguros (vulnerabilidad de SQL Injection).</p>
                                        <p><strong>A.9.4.4:</strong> Uso de programas de utilidad privilegiados (permisos de root en contenedores).</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                         <section>
                             <h2 className="text-xl font-bold text-gray-700 mb-4">Listado de Vulnerabilidades Detectadas</h2>
                             <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Componente</TableHead><TableHead>Descripción</TableHead><TableHead>Severidad</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {vulnerabilityData.map(vuln => (
                                            <TableRow key={vuln.id}><TableCell>{vuln.id}</TableCell><TableCell>{vuln.component}</TableCell><TableCell>{vuln.description}</TableCell><TableCell><Badge variant={vuln.severity === 'Crítica' || vuln.severity === 'Alta' ? 'destructive' : 'secondary'}>{vuln.severity}</Badge></TableCell><TableCell><Badge className={vuln.status === 'Mitigado' ? 'bg-green-600' : ''}>{vuln.status}</Badge></TableCell></TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                        </section>
                    </main>
                    <footer className="text-center text-xs text-gray-400 pt-8 mt-8 border-t">
                        Confidencial - Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil (CESAC)
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default function VulnerabilidadesPage() {
    const { toast } = useToast();
    const [date, setDate] = React.useState<DateRange | undefined>({ from: addDays(new Date(), -90), to: new Date() });
    const [isReportVisible, setIsReportVisible] = React.useState(false);
    const reportRef = React.useRef(null);
    const [activeIndexSeverity, setActiveIndexSeverity] = React.useState<number | undefined>(undefined);
    const [activeIndexStatus, setActiveIndexStatus] = React.useState<number | undefined>(undefined);
    
    const kpiData = [
        { title: "Vulnerabilidades Totales", value: "5", icon: Activity, colorClass: "text-blue-500", description: "Detectadas en los últimos 90 días" },
        { title: "Críticas / Altas", value: "2", icon: AlertTriangle, colorClass: "text-red-500", description: "Requieren acción inmediata" },
        { title: "Pendientes", value: "2", icon: AlertTriangle, colorClass: "text-yellow-500", description: "Vulnerabilidades sin mitigar" },
        { title: "Asignadas", value: "5", icon: Users, colorClass: "text-purple-500", description: "Asignadas a equipos de corrección" },
    ];
    
    const handleDownload = async () => {
        const element = (reportRef.current as any)?.querySelector('#pdf-content');
        if (!element) return;

        const downloadButton = (reportRef.current as any)?.querySelector('.download-button-container');
        if (downloadButton) downloadButton.style.display = 'none';

        toast({ title: "Generando PDF...", description: "Por favor espere." });

        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        
        if (downloadButton) downloadButton.style.display = '';

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
        pdf.save(`informe-vulnerabilidades-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'crítica': return 'destructive';
            case 'alta': return 'secondary';
            case 'media': return 'outline';
            default: return 'default';
        }
    };
  
    const getStatusBadge = (status: string) => {
        switch(status.toLowerCase()) {
            case 'mitigado': return 'bg-green-600 hover:bg-green-700';
            case 'en curso': return 'bg-yellow-500 hover:bg-yellow-600';
            default: return 'bg-red-600 hover:bg-red-700';
        }
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
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3"><ShieldQuestion className="h-8 w-8 text-primary" />Informe de Vulnerabilidades</h1>
                <p className="text-muted-foreground">Un informe consolidado de vulnerabilidades detectadas en las auditorías de seguridad.</p>
            </div>
             <div className="flex items-center gap-2">
                <Button onClick={() => setIsReportVisible(!isReportVisible)} variant="secondary">
                    {isReportVisible ? <X className="mr-2 h-4 w-4"/> : <FileSearch className="mr-2 h-4 w-4" />}
                    {isReportVisible ? 'Ocultar Informe' : 'Generar Informe'}
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard/reportes"><ArrowLeft className="mr-2 h-4 w-4" />Volver a Reportes</Link>
                </Button>
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </div>
            
            <AnimatePresence>
            {isReportVisible && (
                <motion.div
                    ref={reportRef}
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <VulnerabilityReport kpiData={kpiData} onDownload={handleDownload} />
                </motion.div>
            )}
            </AnimatePresence>

            <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                    <TabsTrigger value="general">Reporte General</TabsTrigger>
                    <TabsTrigger value="severidad">Por Severidad</TabsTrigger>
                    <TabsTrigger value="tendencia">Tendencias</TabsTrigger>
                    <TabsTrigger value="asignacion">Por Asignación</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <Card className="shadow-2xl">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Reporte General de Vulnerabilidades</CardTitle>
                                    <CardDescription>Vista global de todas las vulnerabilidades detectadas.</CardDescription>
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />{date?.from ? (date.to ? (<>{format(date.from, "LLL dd, y", { locale: es })} - {format(date.to, "LLL dd, y", { locale: es })}</>) : (format(date.from, "LLL dd, y", { locale: es }))) : (<span>Seleccione una fecha</span>)}</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><CalendarPicker initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={es} /></PopoverContent>
                                </Popover>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible className="w-full">
                                {vulnerabilityData.map(vuln => (
                                    <AccordionItem value={vuln.id} key={vuln.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex justify-between items-center w-full pr-4">
                                                <div className="flex items-center gap-4 text-left">
                                                    <AlertTriangle className={cn("h-6 w-6", vuln.severity === 'Crítica' && 'text-red-500', vuln.severity === 'Alta' && 'text-orange-500', vuln.severity === 'Media' && 'text-yellow-500')} />
                                                    <div>
                                                        <p className="font-semibold">{vuln.description}</p>
                                                        <p className="text-xs text-muted-foreground">{vuln.component} • {vuln.detectionDate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant={getSeverityBadge(vuln.severity)}>{vuln.severity}</Badge>
                                                    <Badge className={getStatusBadge(vuln.status)}>{vuln.status}</Badge>
                                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-6 bg-muted/30">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div><h4 className="font-semibold text-primary mb-2">Detalles Técnicos</h4>
                                                <div className="space-y-3 text-sm">
                                                    <p><strong className="w-24 inline-block">CVE ID:</strong> <span className="font-mono">{vuln.cve}</span></p>
                                                    <p><strong className="w-24 inline-block">CVSS Score:</strong> {vuln.cvssScore}</p>
                                                    <p><strong className="w-24 inline-block">Vector:</strong> {vuln.attackVector}</p>
                                                </div></div>
                                                <div><h4 className="font-semibold text-primary mb-2">Recomendación</h4><p className="text-sm">{vuln.technicalRecommendation}</p></div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="severidad" className="mt-6">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="shadow-2xl">
                            <CardHeader>
                                <CardTitle>Distribución por Severidad</CardTitle>
                                <CardDescription>Visualización del riesgo general del sistema.</CardDescription>
                            </CardHeader>
                           <CardContent>
                                <div className="flex items-center gap-8">
                                    <ChartContainer config={severityChartConfig} className="h-[250px] w-full flex-1">
                                        <RechartsPrimitive.PieChart>
                                            <RechartsPrimitive.Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                                            <RechartsPrimitive.Pie data={severityDistribution} dataKey="value" nameKey="severity" innerRadius={60} outerRadius={80} activeIndex={activeIndexSeverity} onMouseEnter={(_, index) => setActiveIndexSeverity(index)} onMouseLeave={() => setActiveIndexSeverity(undefined)} activeShape={renderActiveShape}>
                                                {severityDistribution.map((entry) => ( <RechartsPrimitive.Cell key={`cell-${entry.severity}`} fill={entry.fill} /> ))}
                                            </RechartsPrimitive.Pie>
                                        </RechartsPrimitive.PieChart>
                                    </ChartContainer>
                                    <div className="flex flex-col gap-4">
                                        {severityDistribution.map(entry => (
                                            <div key={entry.severity} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                                                <span className="text-sm font-medium">{entry.severity}</span>
                                                <span className="text-sm font-bold ml-auto">{entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-2xl">
                            <CardHeader>
                                <CardTitle>Distribución por Estado</CardTitle>
                                <CardDescription>Progreso en la mitigación de vulnerabilidades.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-8">
                                    <ChartContainer config={statusChartConfig} className="h-[250px] w-full flex-1">
                                        <RechartsPrimitive.PieChart>
                                            <RechartsPrimitive.Tooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                                            <RechartsPrimitive.Pie data={statusDistribution} dataKey="value" nameKey="status" innerRadius={60} outerRadius={80} activeIndex={activeIndexStatus} onMouseEnter={(_, index) => setActiveIndexStatus(index)} onMouseLeave={() => setActiveIndexStatus(undefined)} activeShape={renderActiveShape}>
                                                {statusDistribution.map((entry) => ( <RechartsPrimitive.Cell key={`cell-${entry.status}`} fill={entry.fill} /> ))}
                                            </RechartsPrimitive.Pie>
                                        </RechartsPrimitive.PieChart>
                                    </ChartContainer>
                                     <div className="flex flex-col gap-4">
                                        {statusDistribution.map(entry => (
                                            <div key={entry.status} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                                                <span className="text-sm font-medium">{entry.status}</span>
                                                <span className="text-sm font-bold ml-auto">{entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                 <TabsContent value="tendencia" className="mt-6">
                    <Card className="shadow-2xl">
                        <CardHeader>
                            <CardTitle>Tendencia de Vulnerabilidades en el Tiempo</CardTitle>
                            <CardDescription>Evolución mensual de la detección y resolución de vulnerabilidades.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={trendChartConfig} className="h-[350px] w-full">
                                <RechartsPrimitive.AreaChart data={trendData}>
                                    <RechartsPrimitive.CartesianGrid vertical={false} />
                                    <RechartsPrimitive.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                    <RechartsPrimitive.YAxis />
                                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                    <RechartsPrimitive.Legend />
                                    <RechartsPrimitive.Area dataKey="detected" type="natural" fill="var(--color-detected)" fillOpacity={0.1} stroke="var(--color-detected)" stackId="a" />
                                    <RechartsPrimitive.Area dataKey="resolved" type="natural" fill="var(--color-resolved)" fillOpacity={0.1} stroke="var(--color-resolved)" stackId="b" />
                                    <RechartsPrimitive.Area dataKey="accumulated" type="natural" fill="var(--color-accumulated)" fillOpacity={0.2} stroke="var(--color-accumulated)" stackId="c" />
                                </RechartsPrimitive.AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                 <TabsContent value="asignacion" className="mt-6">
                    <Card className="shadow-2xl">
                         <CardHeader>
                            <CardTitle>Reporte de Asignación de Corrección</CardTitle>
                            <CardDescription>Seguimiento en tiempo real de las tareas de remediación.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Vulnerabilidad</TableHead>
                                            <TableHead>Asignado a</TableHead>
                                            <TableHead>Fecha Estimada</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vulnerabilityData.map(vuln => (
                                            <TableRow key={vuln.id}>
                                                <TableCell className="font-mono">{vuln.id}</TableCell>
                                                <TableCell>{vuln.description}</TableCell>
                                                <TableCell>{vuln.assignee}</TableCell>
                                                <TableCell>{vuln.resolutionEta}</TableCell>
                                                <TableCell><Badge className={getStatusBadge(vuln.status)}>{vuln.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </motion.div>
    );
}
