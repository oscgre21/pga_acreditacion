
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FilePlus2,
  ShieldCheck,
  Plane,
  FileText,
  UserCheck,
  Network,
  Activity,
  Eye,
  PlusCircle,
  Briefcase,
  Tags,
  ClipboardList,
  Shield,
  User,
  BookCopy, // Importa el nuevo icono
  AlertTriangle,
} from "lucide-react";
import Link from 'next/link';
import { cn } from "@/lib/utils";

// Importar servicios
import { companiaService } from '@/lib/services/compania.service';
import { categoriaService } from '@/lib/services/categoria.service';
import { perfilEmpresaService } from '@/lib/services/perfilEmpresa.service';
import { dependenciaService } from '@/lib/services/dependencia.service';
import { validadorService } from '@/lib/services/validador.service';
import { ejecutorService } from '@/lib/services/ejecutor.service';
import { equipoSeguridadService } from '@/lib/services/equipoSeguridad.service';
import { tipoDocumentoService } from '@/lib/services/tipoDocumento.service';
import { personaEspecificaService } from '@/lib/services/personaEspecifica.service';
import { documentacionProcesoService } from '@/lib/services/documentacion-proceso.service';
import { prisma } from '@/lib/prisma';

// Función auxiliar para manejar timeouts en las consultas
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database query timeout')), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// Función auxiliar para obtener un conteo con manejo de errores
async function safeCount(countFunction: () => Promise<number>, fallbackValue: number = 0): Promise<number> {
  try {
    return await withTimeout(countFunction(), 3000);
  } catch (error) {
    console.warn(`Database count failed, using fallback value: ${fallbackValue}`);
    return fallbackValue;
  }
}

// Función para obtener los conteos reales de la base de datos
async function getMaintenanceCounts() {
  console.log('Obteniendo conteos de mantenimiento...');

  try {
    // Intentar obtener conteos con timeout más corto y manejo individual de errores
    const [
      companiasCount,
      categoriasCount,
      perfilesEmpresaCount,
      aeropuertosCount,
      dependenciasCount,
      validadoresCount,
      ejecutoresCount,
      serviciosSeguridadCount,
      equiposSeguridadCount,
      tiposDocumentoCount,
      personasEspecificasCount,
      documentacionProcesoCount
    ] = await Promise.allSettled([
      safeCount(() => companiaService.getActiveCount()),
      safeCount(() => categoriaService.getActiveCount()),
      safeCount(() => perfilEmpresaService.getActiveCount()),
      safeCount(() => prisma.aeropuerto.count({ where: { activo: true } })),
      safeCount(() => dependenciaService.getActiveCount()),
      safeCount(() => validadorService.getActiveCount()),
      safeCount(() => ejecutorService.getActiveCount()),
      safeCount(() => prisma.servicioSeguridad.count({ where: { activo: true } })),
      safeCount(() => equipoSeguridadService.getActiveCount()),
      safeCount(() => tipoDocumentoService.getActiveCount()),
      safeCount(() => personaEspecificaService.getActiveCount()),
      safeCount(() => documentacionProcesoService.getActiveCount())
    ]);

    const getCountValue = (result: PromiseSettledResult<number>): number => {
      return result.status === 'fulfilled' ? result.value : 0;
    };

    return {
      companias: getCountValue(companiasCount),
      categorias: getCountValue(categoriasCount),
      perfilesEmpresa: getCountValue(perfilesEmpresaCount),
      aeropuertos: getCountValue(aeropuertosCount),
      dependencias: getCountValue(dependenciasCount),
      validadores: getCountValue(validadoresCount),
      ejecutores: getCountValue(ejecutoresCount),
      serviciosSeguridad: getCountValue(serviciosSeguridadCount),
      equiposSeguridad: getCountValue(equiposSeguridadCount),
      tiposDocumento: getCountValue(tiposDocumentoCount),
      personasEspecificas: getCountValue(personasEspecificasCount),
      documentacionProceso: getCountValue(documentacionProcesoCount),
      databaseAvailable: true
    };
  } catch (error) {
    console.error('Error crítico obteniendo conteos:', error);
    // Valores por defecto en caso de error completo
    return {
      companias: 0,
      categorias: 0,
      perfilesEmpresa: 0,
      aeropuertos: 0,
      dependencias: 0,
      validadores: 0,
      ejecutores: 0,
      serviciosSeguridad: 0,
      equiposSeguridad: 0,
      tiposDocumento: 0,
      personasEspecificas: 0,
      documentacionProceso: 0,
      databaseAvailable: false
    };
  }
}

function getMaintenanceOptions(counts: Awaited<ReturnType<typeof getMaintenanceCounts>>) {
  return [
  {
    title: "Compañías",
    description: "Registradas",
    count: counts.companias.toLocaleString(),
    icon: Building2,
    href: "/dashboard/mantenimiento/companias",
    viewHref: "/dashboard/mantenimiento/companias/list",
    shadow: "hover:shadow-cyan-500/30",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Categorías",
    description: "Categorías de trámites",
    count: counts.categorias.toLocaleString(),
    icon: Tags,
    href: "/dashboard/mantenimiento/categorias",
    viewHref: "/dashboard/mantenimiento/categorias/list",
    shadow: "hover:shadow-pink-500/30",
    iconBg: "bg-pink-100 dark:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "Perfil de empresa",
    description: "Perfiles de empresas",
    count: counts.perfilesEmpresa.toLocaleString(),
    icon: Briefcase,
    href: "/dashboard/mantenimiento/perfil-empresa",
    viewHref: "/dashboard/mantenimiento/perfil-empresa/list",
    shadow: "hover:shadow-indigo-500/30",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Aeropuertos",
    description: "Registrados",
    count: counts.aeropuertos.toLocaleString(),
    icon: Plane,
    href: "/dashboard/mantenimiento/aeropuertos",
    viewHref: "/dashboard/mantenimiento/aeropuertos/list",
    shadow: "hover:shadow-amber-500/30",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Dependencias",
    description: "Configuradas",
    count: counts.dependencias.toLocaleString(),
    icon: Network,
    href: "/dashboard/mantenimiento/dependencias",
    viewHref: "/dashboard/mantenimiento/dependencias/list",
    shadow: "hover:shadow-fuchsia-500/30",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    title: "Validadores",
    description: "Activos",
    count: counts.validadores.toLocaleString(),
    icon: UserCheck,
    href: "/dashboard/mantenimiento/validadores",
    viewHref: "/dashboard/mantenimiento/validadores/list",
    shadow: "hover:shadow-rose-500/30",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    title: "Ejecutores",
    description: "Activos",
    count: counts.ejecutores.toLocaleString(),
    icon: ClipboardList,
    href: "/dashboard/mantenimiento/ejecutores",
    viewHref: "/dashboard/mantenimiento/ejecutores/list",
    shadow: "hover:shadow-teal-500/30",
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    title: "Trámites",
    description: "Configurados",
    count: "0", // Este parece no tener servicio aún
    icon: FilePlus2,
    href: "/dashboard/mantenimiento/tramites",
    viewHref: "/dashboard/mantenimiento/tramites/list",
    shadow: "hover:shadow-blue-500/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Documentación de Proceso",
    description: "Documentos de acreditación",
    count: counts.documentacionProceso.toLocaleString(),
    icon: BookCopy,
    href: "/dashboard/mantenimiento/documentacion-proceso",
    viewHref: "/dashboard/mantenimiento/documentacion-proceso/list",
    shadow: "hover:shadow-orange-500/30",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Servicios de Seguridad",
    description: "Configurados",
    count: counts.serviciosSeguridad.toLocaleString(),
    icon: Shield,
    href: "/dashboard/mantenimiento/servicios-seguridad",
    viewHref: "/dashboard/mantenimiento/servicios-seguridad/list",
    shadow: "hover:shadow-red-500/30",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Equipos de Seguridad",
    description: "Registrados",
    count: counts.equiposSeguridad.toLocaleString(),
    icon: ShieldCheck,
    href: "/dashboard/mantenimiento/equipos-seguridad",
    viewHref: "/dashboard/mantenimiento/equipos-seguridad/list",
    shadow: "hover:shadow-green-500/30",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Tipos de Documento",
    description: "Definidos",
    count: counts.tiposDocumento.toLocaleString(),
    icon: FileText,
    href: "/dashboard/mantenimiento/tipos-documento",
    viewHref: "/dashboard/mantenimiento/tipos-documento/list",
    shadow: "hover:shadow-violet-500/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
   {
    title: "Persona de funciones específicas",
    description: "Personal específico",
    count: counts.personasEspecificas.toLocaleString(),
    icon: User,
    href: "/dashboard/mantenimiento/persona-especifica",
    viewHref: "/dashboard/mantenimiento/persona-especifica/list",
    shadow: "hover:shadow-lime-500/30",
    iconBg: "bg-lime-100 dark:bg-lime-900/50",
    iconColor: "text-lime-600 dark:text-lime-400",
  },
];
}

export default async function MantenimientoPage() {
  // Obtener los conteos reales de la base de datos
  const counts = await getMaintenanceCounts();
  const maintenanceOptions = getMaintenanceOptions(counts);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Mantenimiento Acreditaciones</h1>
        <p className="text-muted-foreground">
          Gestione los datos maestros del sistema y cree nuevos registros.
        </p>
        {!counts.databaseAvailable && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Advertencia:</strong> No se puede conectar a la base de datos. Los conteos mostrados pueden no estar actualizados.
              Verifique la conectividad de red y que el servidor de base de datos esté disponible.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {maintenanceOptions.map((option) => (
          <Card
            key={option.title}
            className={cn(
              "group flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1.5 shadow-lg",
              option.shadow
            )}
          >
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
              <div
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-lg transition-all duration-300 group-hover:scale-110",
                  option.iconBg
                )}
              >
                <option.icon className={cn("h-7 w-7", option.iconColor)} />
              </div>
              <CardTitle className="text-lg font-semibold">{option.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-2">
              <p className={cn("text-4xl font-bold", option.iconColor)}>
                {option.count}
              </p>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Button asChild className="w-full">
                <Link href={option.href}>
                  <PlusCircle /> Crear
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href={option.viewHref ?? option.href}>
                  <Eye /> Ver
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
