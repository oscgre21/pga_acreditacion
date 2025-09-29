// src/app/dashboard/acreditaciones/components/AcreditacionesDashboard.tsx
"use client";

import * as React from "react";
import {
  ArrowDown,
  Settings2,
  Clock,
  ArchiveX,
  CheckCheck,
  Layers,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Printer,
  CalendarCheck2,
  ClipboardList,
  CalendarClock,
  FileWarning,
  Download,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import * as RechartsPrimitive from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/circular-progress";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Importar hooks personalizados
import { useDashboardData } from "@/hooks/useAcreditaciones";
import type { EstadisticasAcreditacion } from "@/lib/types/acreditacion.types";
import type { AcreditacionWithRelations } from "@/lib/repositories/acreditacion.repository";

// Use Prisma types for consistency
type AcreditacionCompleta = AcreditacionWithRelations;

// Configuración de gráficos
const chartConfig = {
  value: { label: "Value" },
  mdsd: { label: "MDSD", color: "hsl(var(--chart-1))" },
  mdst: { label: "MDST", color: "hsl(var(--chart-2))" },
  mdlr: { label: "MDLR", color: "hsl(var(--chart-3))" },
  mdpc: { label: "MDPC", color: "hsl(var(--chart-4))" },
  mdcy: { label: "MDCY", color: "hsl(var(--chart-5))" },
  mdpp: { label: "MDPP", color: "hsl(var(--chart-6))" },
  mdbh: { label: "MDBH", color: "hsl(var(--chart-7))" },
  mdjb: { label: "MDJB", color: "hsl(var(--chart-8))" },
  mdab: { label: "MDAB", color: "hsl(var(--chart-9))" },
} satisfies ChartConfig;

// Mapear estadísticas a tarjetas
function getStatCards(estadisticas: EstadisticasAcreditacion) {
  return [
    {
      title: "Aprobadas",
      value: estadisticas.concluidas.toLocaleString(),
      icon: CheckCheck,
      color: "bg-gradient-to-br from-green-500 to-emerald-500",
      textColor: "text-black",
    },
    {
      title: "En tiempo",
      value: estadisticas.enTiempo.toLocaleString(),
      icon: Clock,
      color: "bg-blue-400/80",
      textColor: "text-blue-900",
    },
    {
      title: "Atrasadas",
      value: estadisticas.atrasadas.toLocaleString(),
      icon: ArchiveX,
      color: "bg-red-500",
      textColor: "text-red-900",
    },
    {
      title: "Discrepancias",
      value: estadisticas.discrepancias.toLocaleString(),
      icon: Settings2,
      color: "bg-orange-400/80",
      textColor: "text-orange-900",
    },
    {
      title: "Total",
      value: estadisticas.total.toLocaleString(),
      icon: Layers,
      color: "bg-primary/80",
      textColor: "text-primary-foreground",
    },
  ];
}

// Componente de tarjeta de estadística
const StatCard = ({ card }: { card: ReturnType<typeof getStatCards>[0] }) => {
  return (
    <motion.div
      style={{
        transformStyle: "preserve-3d",
        boxShadow: `0 10px 15px -3px ${card.color}40`,
      }}
      whileHover={{
        boxShadow: `0 20px 30px -10px ${card.color}60`,
        y: -5
      }}
      className={cn("relative rounded-2xl overflow-hidden p-0 transition-all duration-300 ease-out", card.color)}
    >
      <Card className={cn("h-full border-none", card.color, card.textColor)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {card.title}
          </CardTitle>
          <card.icon className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{card.value}</div>
          <div className="text-xs opacity-80">
            Ver más detalles
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Componente de fila de trámite
const TramiteRow = ({ acreditacion }: { acreditacion: AcreditacionCompleta }) => {
  return (
    <TableRow key={acreditacion.id}>
      <TableCell className="font-medium text-muted-foreground align-top">
        <div className="flex flex-col gap-2 items-start whitespace-nowrap">
          <div className="flex items-center gap-1 font-bold text-foreground">
            <span>{acreditacion.numero}</span>
            {acreditacion.hasWarning && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          </div>
          <Button asChild variant="outline" size="sm" className="h-auto px-4 py-1 text-xs font-semibold">
            <Link href={`/dashboard/tramite/${acreditacion.id}`}>
              DETALLES
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <div className="flex flex-col gap-1">
          <p><span className="font-semibold text-foreground">Solicitante:</span> {acreditacion.solicitante}</p>
          {acreditacion.personal && (
            <p><span className="font-semibold text-foreground">Para:</span> {acreditacion.personal}</p>
          )}
          <p><span className="font-semibold text-foreground">Aeropuerto:</span> {acreditacion.aeropuerto.nombre}</p>
          <p><span className="font-semibold text-foreground">Categoría:</span> {acreditacion.categoria}</p>
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <p><span className="font-semibold text-foreground">Proceso:</span> {acreditacion.proceso}</p>
        <p className="text-blue-600">{acreditacion.subproceso}</p>
        <p className="text-foreground font-mono text-xs">{acreditacion.referencia}</p>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <div className="space-y-1">
          {acreditacion.ejecutores.slice(0, 2).map((ejecutor, index) => (
            <div key={index} className="text-xs">{ejecutor}</div>
          ))}
          {acreditacion.ejecutores.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{acreditacion.ejecutores.length - 2} más
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <div className="space-y-1">
          {acreditacion.validadores.slice(0, 2).map((validador, index) => (
            <div key={index} className="text-xs">{validador}</div>
          ))}
          {acreditacion.validadores.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{acreditacion.validadores.length - 2} más
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <div className="flex flex-col whitespace-nowrap">
          <span>{new Date(acreditacion.fechaIngreso).toLocaleDateString()}</span>
          <span className="font-semibold text-foreground/80">
            {new Date(acreditacion.fechaIngreso).toLocaleTimeString()}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-xs text-muted-foreground align-top">
        <div className="flex flex-col whitespace-nowrap">
          <span>{new Date(acreditacion.fechaVencimiento).toLocaleDateString()}</span>
          <span className="font-semibold text-foreground/80">
            {new Date(acreditacion.fechaVencimiento).toLocaleTimeString()}
          </span>
        </div>
      </TableCell>
      <TableCell className="align-middle">
        <div className="flex items-center justify-center">
          <CircularProgress value={acreditacion.progreso} />
        </div>
      </TableCell>
    </TableRow>
  );
};

// Componente principal
export default function AcreditacionesDashboard() {
  const { toast } = useToast();
  const { dashboardData, loading, error, refresh } = useDashboardData();

  // Estados para UI
  const [refreshing, setRefreshing] = React.useState(false);

  // Manejar refresh manual
  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
      toast({
        title: "Datos actualizados",
        description: "Los datos del dashboard se han actualizado exitosamente.",
      });
    } catch (err) {
      toast({
        title: "Error al actualizar",
        description: "No se pudieron actualizar los datos. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [refresh, toast]);

  // Auto-refresh cada 5 minutos
  React.useEffect(() => {
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los datos del dashboard: {error.message}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reintentando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </>
          )}
        </Button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">No hay datos disponibles</p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Cargar datos
        </Button>
      </div>
    );
  }

  const { estadisticas, tramitesRecientes, conDiscrepancias, distribucionAeropuertos } = dashboardData;
  const statCards = getStatCards(estadisticas);

  // Preparar datos para el gráfico
  const chartData = distribucionAeropuertos.map((dist, index) => ({
    name: dist.codigo,
    value: dist.porcentaje,
    fill: `var(--color-${dist.codigo.toLowerCase()})`,
    cantidad: dist.cantidad
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Acreditaciones
        </h1>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-2">
            {/* KPIs generales */}
            <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col">
              <CardHeader>
                <CardTitle>Resumen General</CardTitle>
                <CardDescription>
                  Estado actual del sistema de acreditaciones.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid flex-grow gap-4">
                <div className="flex items-center justify-between rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCheck className="h-6 w-6 text-green-500" />
                    <span className="font-medium">Tiempo promedio</span>
                  </div>
                  <span className="text-xl font-bold">
                    {estadisticas.tiempoPromedioProcesso} días
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-500" />
                    <span className="font-medium">Eficiencia</span>
                  </div>
                  <span className="text-xl font-bold text-blue-500">
                    {estadisticas.total > 0
                      ? Math.round((estadisticas.concluidas / estadisticas.total) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                    <span className="font-medium">Tasa de discrepancias</span>
                  </div>
                  <span className="text-xl font-bold text-amber-500">
                    {estadisticas.total > 0
                      ? Math.round((estadisticas.discrepancias / estadisticas.total) * 100)
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de distribución */}
            <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl flex flex-col">
              <CardHeader>
                <CardTitle>Distribución por Aeropuerto</CardTitle>
                <CardDescription>Acreditaciones por ubicación</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-4">
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <RechartsPrimitive.BarChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <RechartsPrimitive.CartesianGrid vertical={false} />
                    <RechartsPrimitive.XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <RechartsPrimitive.YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 'dataMax + 5']}
                    />
                    <RechartsPrimitive.Tooltip
                      cursor={false}
                      content={<ChartTooltipContent
                        formatter={(value, name, props) => [
                          `${value}% (${props.payload?.cantidad || 0} acreditaciones)`,
                          'Porcentaje'
                        ]}
                        indicator="dot"
                      />}
                    />
                    <RechartsPrimitive.Bar
                      dataKey="value"
                      name="Acreditaciones"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={900}
                    >
                      {chartData.map((entry, index) => (
                        <RechartsPrimitive.Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          className="transition-opacity hover:opacity-90"
                        />
                      ))}
                    </RechartsPrimitive.Bar>
                  </RechartsPrimitive.BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hallazgos y novedades */}
        <div className="grid">
          <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle>Hallazgos y Novedades</CardTitle>
              <CardDescription>
                {conDiscrepancias.length} acreditaciones requieren atención
              </CardDescription>
            </CardHeader>
            <CardContent className="grid flex-grow gap-6">
              <div className="flex flex-col gap-4">
                {conDiscrepancias.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>No hay discrepancias pendientes</p>
                  </div>
                ) : (
                  conDiscrepancias.slice(0, 5).map((acreditacion) => (
                    <Link
                      key={acreditacion.id}
                      href={`/dashboard/tramite/${acreditacion.id}`}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-muted/50"
                    >
                      <AlertTriangle className="h-5 w-5 text-amber-500 transition-transform duration-200 group-hover:scale-110" />
                      <div>
                        <p className="text-sm font-medium">Acreditación: {acreditacion.numero}</p>
                        <p className="text-sm text-muted-foreground">
                          {acreditacion.solicitante}
                        </p>
                      </div>
                      <Avatar className="h-9 w-9 border justify-self-end">
                        <AvatarFallback>
                          {acreditacion.solicitante.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabla de trámites recientes */}
      <Card className="transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
        <CardHeader>
          <CardTitle>Acreditaciones Recientes</CardTitle>
          <CardDescription>
            {tramitesRecientes.length} acreditaciones más recientes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">No.</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Proceso</TableHead>
                <TableHead>Ejecutores</TableHead>
                <TableHead>Validadores</TableHead>
                <TableHead>Ingreso</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead className="text-center">Progreso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tramitesRecientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No hay acreditaciones disponibles
                  </TableCell>
                </TableRow>
              ) : (
                tramitesRecientes.slice(0, 10).map((acreditacion) => (
                  <TramiteRow key={acreditacion.id} acreditacion={acreditacion} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {tramitesRecientes.length > 0 && (
          <CardFooter className="justify-center border-t pt-4">
            <Button variant="link" asChild>
              <Link href="/dashboard/acreditaciones/list">
                Ver todas las acreditaciones <ArrowDown className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}