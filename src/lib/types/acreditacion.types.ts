// src/lib/types/acreditacion.types.ts
import { Acreditacion, EstadoAcreditacion, EstadoActividad, Aeropuerto } from '@prisma/client'

// === TIPOS BASE ===

export interface AcreditacionCompleta extends Acreditacion {
  aeropuerto: Aeropuerto
  documentos: DocumentoAcreditacion[]
  actividades: ActividadAcreditacion[]
}

export interface DocumentoAcreditacion {
  id: string
  acreditacionId: string
  nombre: string
  descripcion: string
  obligatorio: boolean
  subido: boolean
  rutaArchivo?: string
  fechaSubida?: Date
  validado: boolean
  fechaValidacion?: Date
  validadoPor?: string
  observaciones?: string
  createdAt: Date
  updatedAt: Date
}

export interface ActividadAcreditacion {
  id: string
  acreditacionId: string
  nombre: string
  descripcion?: string
  estado: EstadoActividad
  fechaInicio?: Date
  fechaFin?: Date
  responsable?: string
  observaciones?: string
  orden: number
  createdAt: Date
  updatedAt: Date
}

// === FORMULARIOS Y REQUESTS ===

export interface CrearAcreditacionForm {
  numero: string
  solicitante: string
  personal?: string
  aeropuertoId: string
  categoria: string
  proceso: string
  subproceso: string
  referencia: string
  fechaVencimiento: Date
  ejecutores: string[]
  validadores: string[]
  observaciones?: string
  costoUSD?: number
}

export interface ActualizarAcreditacionForm {
  id: string
  solicitante?: string
  personal?: string
  aeropuertoId?: string
  categoria?: string
  proceso?: string
  subproceso?: string
  estado?: EstadoAcreditacion
  progreso?: number
  fechaVencimiento?: Date
  ejecutores?: string[]
  validadores?: string[]
  observaciones?: string
  costoUSD?: number
  hasWarning?: boolean
}

// === FILTROS Y BÚSQUEDAS ===

export interface FiltrosAcreditacion {
  aeropuertoId?: string
  estado?: EstadoAcreditacion
  hasWarning?: boolean
  fechaIngresoDesde?: Date
  fechaIngresoHasta?: Date
  fechaVencimientoDesde?: Date
  fechaVencimientoHasta?: Date
  solicitante?: string
  personal?: string
  categoria?: string
  proceso?: string
  progreso?: {
    min?: number
    max?: number
  }
}

export interface ParametrosBusqueda {
  termino?: string
  filtros?: FiltrosAcreditacion
  ordenarPor?: 'fechaIngreso' | 'fechaVencimiento' | 'progreso' | 'estado'
  orden?: 'asc' | 'desc'
  pagina?: number
  limite?: number
}

// === ESTADÍSTICAS Y DASHBOARD ===

export interface EstadisticasAcreditacion {
  total: number
  concluidas: number
  enTiempo: number
  atrasadas: number
  discrepancias: number
  porAeropuerto: EstadisticaPorAeropuerto[]
  porEstado: EstadisticaPorEstado[]
  tiempoPromedioProcesso: number
}

export interface EstadisticaPorAeropuerto {
  aeropuertoId: string
  aeropuertoNombre: string
  cantidad: number
  porcentaje: number
}

export interface EstadisticaPorEstado {
  estado: EstadoAcreditacion
  cantidad: number
  porcentaje: number
}

export interface DashboardData {
  estadisticas: EstadisticasAcreditacion
  tramitesRecientes: AcreditacionCompleta[]
  proximasAVencer: AcreditacionCompleta[]
  conDiscrepancias: AcreditacionCompleta[]
  distribucionAeropuertos: DistribucionAeropuerto[]
}

export interface DistribucionAeropuerto {
  aeropuerto: string
  codigo: string
  cantidad: number
  porcentaje: number
}

// === REPORTES ===

export interface ReporteVencimientos {
  acreditaciones: AcreditacionCompleta[]
  resumen: {
    totalVencidas: number
    vencenEn7Dias: number
    vencenEn15Dias: number
    vencenEn30Dias: number
  }
}

export interface ReporteProductividad {
  periodo: {
    fechaInicio: Date
    fechaFin: Date
  }
  resumen: {
    totalProcesadas: number
    aprobadas: number
    rechazadas: number
    enProceso: number
    porcentajeExito: number
    tiempoPromedio: number
  }
  porAeropuerto: Array<{
    aeropuerto: string
    total: number
    aprobadas: number
    porcentajeExito: number
  }>
  porExecutor: Array<{
    ejecutor: string
    asignadas: number
    completadas: number
    eficiencia: number
  }>
}

// === ACCIONES Y WORKFLOWS ===

export interface AccionAcreditacion {
  tipo: 'aprobar' | 'rechazar' | 'marcar_discrepancia' | 'actualizar_progreso' | 'asignar' | 'comentar'
  descripcion: string
  usuario: string
  fecha: Date
  datos?: Record<string, any>
}

export interface WorkflowEstado {
  estadoActual: EstadoAcreditacion
  siguientesEstados: EstadoAcreditacion[]
  accionesPermitidas: string[]
  requiereDocumentos: boolean
  requiereValidacion: boolean
}

// === NOTIFICACIONES ===

export interface NotificacionAcreditacion {
  id: string
  acreditacionId: string
  tipo: 'nueva' | 'cambio_estado' | 'vencimiento' | 'discrepancia' | 'aprobacion' | 'rechazo'
  titulo: string
  mensaje: string
  destinatarios: string[]
  leida: boolean
  fechaCreacion: Date
  urgente: boolean
}

// === CONFIGURACIÓN Y CATÁLOGOS ===

export interface CategoriaPersonal {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  activa: boolean
}

export interface ServicioSeguridad {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  activo: boolean
}

export interface TipoDocumento {
  id: string
  nombre: string
  descripcion: string
  obligatorio: boolean
  formatosPermitidos: string[]
  tamanoMaximoMB: number
  departamentos: string[]
}

// === VALIDACIONES ===

export interface ResultadoValidacion {
  esValido: boolean
  errores: string[]
  advertencias: string[]
}

export interface ReglasValidacion {
  camposObligatorios: string[]
  formatoFecha: string
  documentosRequeridos: string[]
  estadosPermitidos: EstadoAcreditacion[]
}

// === HOOKS Y UTILIDADES ===

export interface UseAcreditacionesOptions {
  filtros?: FiltrosAcreditacion
  autoRefresh?: boolean
  intervalos?: number
}

export interface UseAcreditacionesResult {
  acreditaciones: AcreditacionCompleta[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  filtrar: (filtros: FiltrosAcreditacion) => void
  buscar: (termino: string) => void
}

// === API RESPONSES ===

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// === CONFIGURACIÓN DE TABLAS ===

export interface ColumnaTabla {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  visible?: boolean
}

export interface ConfiguracionTablaAcreditaciones {
  columnas: ColumnaTabla[]
  ordenDefecto: {
    campo: string
    direccion: 'asc' | 'desc'
  }
  paginacion: {
    tamanosPagina: number[]
    tamanoDefecto: number
  }
}

// === PERMISOS Y ROLES ===

export interface PermisosAcreditacion {
  crear: boolean
  leer: boolean
  actualizar: boolean
  eliminar: boolean
  aprobar: boolean
  rechazar: boolean
  marcarDiscrepancias: boolean
  verReportes: boolean
  exportar: boolean
}

export type RolUsuario = 'admin' | 'ejecutor' | 'validador' | 'consultor'

// === EXPORTACIÓN ===

export interface OpcionesExportacion {
  formato: 'excel' | 'pdf' | 'csv'
  incluirDocumentos: boolean
  incluirActividades: boolean
  filtros?: FiltrosAcreditacion
  columnas?: string[]
}