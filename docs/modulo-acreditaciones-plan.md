# Plan de Implementación - Módulo de Acreditaciones

## Información General

**Proyecto:** Portal de Gestión Aeroportuaria (PGA) - CESAC
**Módulo:** Sistema de Gestión de Acreditaciones
**Fecha:** 2025-01-28
**Versión del Plan:** 1.0

## Resumen Ejecutivo

Este documento detalla el plan para mejorar e implementar completamente el módulo de acreditaciones del PGA, incluyendo la migración de datos mock a la base de datos y la implementación de funcionalidades avanzadas siguiendo las mejores prácticas de desarrollo.

## Estado Actual del Módulo

### Funcionalidades Existentes
- ✅ Dashboard principal con estadísticas en tiempo real
- ✅ KPIs de personal de seguridad (total, vigente, vencido)
- ✅ Gráficos de distribución por aeropuerto
- ✅ Tabla de trámites recientes con progreso
- ✅ Sistema de hallazgos y novedades
- ✅ Centro de reportes rápidos (PDF)
- ✅ Datos mock completos y estructurados

### Arquitectura Técnica Actual
- **Frontend:** React con Next.js 15.3.3 + TypeScript
- **UI:** shadcn/ui components + Tailwind CSS
- **Animaciones:** Framer Motion
- **Base de Datos:**
  - Prisma (PostgreSQL) - Modelo principal
  - Firebase Firestore - Datos en tiempo real
- **Datos Mock:** Archivos TypeScript locales

## Plan de Implementación

### Fase 1: Refactorización y Optimización (Semanas 1-2)

#### 1.1 Migración de Datos Mock a Base de Datos

**Objetivo:** Migrar todos los datos mock a Prisma/Firestore para persistencia real.

**Tareas:**
1. **Extensión del Schema de Prisma**
   ```sql
   -- Nuevos modelos requeridos
   model Acreditacion {
     id                    String    @id @default(cuid())
     numero                String    @unique
     solicitante           String
     personal              String?
     aeropuertoId          String
     categoria             String
     proceso               String
     subproceso            String
     referencia            String
     estado                EstadoAcreditacion @default(PENDIENTE)
     progreso              Int       @default(0)
     hasWarning            Boolean   @default(false)
     fechaIngreso          DateTime
     fechaVencimiento      DateTime
     ejecutores            String[]
     validadores           String[]
     createdAt             DateTime  @default(now())
     updatedAt             DateTime  @updatedAt

     aeropuerto            Aeropuerto @relation(fields: [aeropuertoId], references: [id])
     documentos            DocumentoAcreditacion[]
     actividades           ActividadAcreditacion[]
   }

   model Aeropuerto {
     id                    String    @id
     codigo                String    @unique
     nombre                String
     activo                Boolean   @default(true)
     acreditaciones        Acreditacion[]
   }

   model CategoriaPersonal {
     id                    String    @id
     codigo                String    @unique
     nombre                String
     descripcion           String?
     activa                Boolean   @default(true)
   }

   model ServicioSeguridad {
     id                    String    @id
     codigo                String    @unique
     nombre                String
     descripcion           String?
     activo                Boolean   @default(true)
   }
   ```

2. **Creación de Seeders**
   - Migrar datos de `data.ts` a scripts de seeding
   - Validar integridad referencial
   - Establecer relaciones entre entidades

3. **Servicios de Datos**
   ```typescript
   // src/lib/services/acreditacion.service.ts
   export class AcreditacionService {
     async getAllAcreditaciones(filtros?: FiltrosAcreditacion): Promise<Acreditacion[]>
     async getAcreditacionById(id: string): Promise<Acreditacion | null>
     async createAcreditacion(data: CreateAcreditacionData): Promise<Acreditacion>
     async updateAcreditacion(id: string, data: UpdateAcreditacionData): Promise<Acreditacion>
     async getEstadisticas(): Promise<EstadisticasAcreditacion>
   }
   ```

#### 1.2 Implementación de Repository Pattern

```typescript
// src/lib/repositories/acreditacion.repository.ts
export class AcreditacionRepository extends BaseRepository<
  Acreditacion,
  CreateAcreditacionData,
  UpdateAcreditacionData
> {
  constructor() {
    super(prisma.acreditacion)
  }

  async findByAeropuerto(aeropuertoId: string): Promise<Acreditacion[]>
  async findVencidas(): Promise<Acreditacion[]>
  async findEnTiempo(): Promise<Acreditacion[]>
  async getEstadisticasPorEstado(): Promise<EstadisticasEstado>
}
```

### Fase 2: Funcionalidades Avanzadas (Semanas 3-4)

#### 2.1 Sistema de Notificaciones Inteligentes

**Características:**
- Alertas automáticas por vencimientos próximos
- Notificaciones de discrepancias
- Escalamiento automático de casos críticos

```typescript
// src/lib/services/notificacion.service.ts
export class NotificacionService {
  async crearNotificacionVencimiento(acreditacionId: string): Promise<void>
  async notificarDiscrepancia(discrepanciaId: string): Promise<void>
  async escalarCasoCritico(acreditacionId: string): Promise<void>
}
```

#### 2.2 Workflow de Aprobaciones

**Implementación:**
- Estados de flujo definidos (Pendiente → En Revisión → Aprobado/Rechazado)
- Asignación automática de validadores
- Historial de cambios y comentarios

```typescript
// Estados del workflow
enum EstadoAcreditacion {
  PENDIENTE = "PENDIENTE",
  EN_REVISION = "EN_REVISION",
  DOCUMENTOS_INCOMPLETOS = "DOCUMENTOS_INCOMPLETOS",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
  VENCIDO = "VENCIDO"
}
```

#### 2.3 Dashboard Analytics Avanzado

**Métricas Implementadas:**
- Tiempo promedio de procesamiento
- Tasa de aprobación por aeropuerto
- Análisis de cuellos de botella
- Predicción de vencimientos

### Fase 3: Integración y Optimización (Semanas 5-6)

#### 3.1 Integración con Firebase Firestore

**Casos de Uso:**
- Sincronización en tiempo real de estados
- Chat/mensajería entre ejecutores y validadores
- Notificaciones push

```typescript
// src/lib/firebase/acreditacion.service.ts
export class FirebaseAcreditacionService {
  async syncToFirestore(acreditacion: Acreditacion): Promise<void>
  async subscribeToChanges(acreditacionId: string, callback: Function): Promise<void>
  async createRealTimeChat(acreditacionId: string): Promise<string>
}
```

#### 3.2 Sistema de Documentos

**Funcionalidades:**
- Upload de documentos con validación
- Generación automática de códigos QR
- Versionado de documentos
- Integración con firma digital

#### 3.3 API REST Completa

```typescript
// src/app/api/acreditaciones/route.ts
export async function GET(request: NextRequest) {
  // Listar acreditaciones con filtros
}

export async function POST(request: NextRequest) {
  // Crear nueva acreditación
}

// src/app/api/acreditaciones/[id]/route.ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Obtener acreditación específica
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Actualizar acreditación
}
```

## Estructura de Datos Mock a Migrar

### Datos Principales Identificados

1. **Trámites de Acreditación**
   - 2,152 registros en datos mock
   - Estados: Concluidas (1,637), En tiempo (163), Atrasadas (352), Discrepancias (136)

2. **Personal y Categorías**
   - Total personal: 4,062
   - Personal vigente: 3,721
   - Personal vencido: 340

3. **Distribución por Aeropuertos**
   - MDSD (25%), MDST (15%), MDLR (10%), MDPC (10%), MDCY (10%), MDPP (10%), MDBH (8%), MDJB (7%), MDAB (5%)

4. **Tipos de Trámites**
   - Certificación inicial
   - Re-certificación
   - Renovación de carnet
   - Re-impresión por pérdida/deterioro

### Script de Migración

```typescript
// scripts/migrate-acreditaciones-data.ts
import { prisma } from '@/lib/prisma'
import { recentTransactions, aeropuertos, categoriaPersonal } from '@/app/dashboard/acreditaciones/data'

export async function migrateAcreditacionesData() {
  console.log('🚀 Iniciando migración de datos de acreditaciones...')

  // 1. Migrar aeropuertos
  for (const aeropuerto of aeropuertos) {
    await prisma.aeropuerto.upsert({
      where: { codigo: aeropuerto.id },
      update: {},
      create: {
        id: aeropuerto.id,
        codigo: aeropuerto.id,
        nombre: aeropuerto.label,
        activo: true
      }
    })
  }

  // 2. Migrar categorías de personal
  for (const categoria of categoriaPersonal) {
    await prisma.categoriaPersonal.upsert({
      where: { codigo: categoria.id },
      update: {},
      create: {
        id: categoria.id,
        codigo: categoria.id,
        nombre: categoria.label,
        activa: true
      }
    })
  }

  // 3. Migrar trámites
  for (const tramite of recentTransactions) {
    await prisma.acreditacion.create({
      data: {
        numero: tramite.id,
        solicitante: tramite.solicitante,
        personal: tramite.para,
        aeropuertoId: tramite.asignadoA.toLowerCase(),
        categoria: tramite.categoria,
        proceso: tramite.proceso,
        subproceso: tramite.subproceso,
        referencia: tramite.referencia,
        estado: mapEstado(tramite.progress),
        progreso: tramite.progress,
        hasWarning: tramite.hasWarning,
        fechaIngreso: parseDate(tramite.ingreso),
        fechaVencimiento: parseDate(tramite.vence),
        ejecutores: tramite.ejecutores,
        validadores: tramite.validadores
      }
    })
  }

  console.log('✅ Migración completada exitosamente')
}
```

## Mejores Prácticas de Desarrollo

### 1. Arquitectura de Código

**Estructura de Carpetas:**
```
src/
├── app/dashboard/acreditaciones/
│   ├── page.tsx                 # Dashboard principal
│   ├── components/              # Componentes específicos
│   │   ├── AcreditacionCard.tsx
│   │   ├── EstadisticasWidget.tsx
│   │   └── TramiteTable.tsx
│   ├── [id]/                    # Página de detalle
│   │   ├── page.tsx
│   │   └── components/
│   └── crear/                   # Formulario de creación
│       └── page.tsx
├── lib/
│   ├── services/                # Lógica de negocio
│   │   ├── acreditacion.service.ts
│   │   └── notificacion.service.ts
│   ├── repositories/            # Acceso a datos
│   │   └── acreditacion.repository.ts
│   ├── types/                   # Definiciones TypeScript
│   │   └── acreditacion.types.ts
│   └── utils/                   # Utilidades
│       └── acreditacion.utils.ts
```

### 2. Validación de Datos

```typescript
// src/lib/schemas/acreditacion.schema.ts
import { z } from 'zod'

export const CreateAcreditacionSchema = z.object({
  solicitante: z.string().min(1, 'Solicitante es requerido'),
  personal: z.string().optional(),
  aeropuertoId: z.string().min(1, 'Aeropuerto es requerido'),
  categoria: z.string().min(1, 'Categoría es requerida'),
  proceso: z.string().min(1, 'Proceso es requerido'),
  fechaVencimiento: z.date().refine(
    date => date > new Date(),
    'Fecha de vencimiento debe ser futura'
  )
})

export type CreateAcreditacionData = z.infer<typeof CreateAcreditacionSchema>
```

### 3. Manejo de Estados

```typescript
// src/hooks/useAcreditaciones.ts
export function useAcreditaciones(filtros?: FiltrosAcreditacion) {
  const [acreditaciones, setAcreditaciones] = useState<Acreditacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await acreditacionService.getAllAcreditaciones(filtros)
      setAcreditaciones(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    acreditaciones,
    loading,
    error,
    refresh: refreshData
  }
}
```

### 4. Testing Strategy

```typescript
// tests/services/acreditacion.service.test.ts
describe('AcreditacionService', () => {
  let service: AcreditacionService

  beforeEach(() => {
    service = new AcreditacionService()
  })

  describe('getAllAcreditaciones', () => {
    it('should return all acreditaciones', async () => {
      const result = await service.getAllAcreditaciones()
      expect(result).toBeInstanceOf(Array)
    })

    it('should filter by aeropuerto', async () => {
      const filtros = { aeropuertoId: 'MDSD' }
      const result = await service.getAllAcreditaciones(filtros)
      result.forEach(acreditacion => {
        expect(acreditacion.aeropuertoId).toBe('MDSD')
      })
    })
  })
})
```

### 5. Performance y Optimización

**Estrategias:**
- **Lazy Loading:** Cargar datos bajo demanda
- **Pagination:** Implementar paginación server-side
- **Caching:** Redis para consultas frecuentes
- **Indexing:** Índices optimizados en Prisma

```typescript
// Ejemplo de optimización con índices
model Acreditacion {
  // ... campos

  @@index([estado, fechaVencimiento])
  @@index([aeropuertoId, estado])
  @@index([fechaIngreso])
}
```

## Cronograma de Implementación

| Semana | Actividades | Entregables |
|--------|-------------|-------------|
| 1 | Extensión schema Prisma, creación de seeders | Modelos de datos listos |
| 2 | Implementación de repositories y services | API de datos funcional |
| 3 | Dashboard mejorado, sistema de notificaciones | UI actualizada |
| 4 | Workflow de aprobaciones, analytics avanzado | Funcionalidades avanzadas |
| 5 | Integración Firebase, sistema de documentos | Sincronización en tiempo real |
| 6 | API REST, testing, optimización | Sistema completo y probado |

## Métricas de Éxito

### Técnicas
- ✅ 100% de datos migrados sin pérdida
- ✅ Tiempo de respuesta < 200ms para consultas básicas
- ✅ Cobertura de tests > 80%
- ✅ 0 errores críticos en producción

### Funcionales
- ✅ Reducción del 50% en tiempo de procesamiento de trámites
- ✅ 95% de satisfacción de usuarios finales
- ✅ Automatización del 80% de notificaciones manuales
- ✅ Disponibilidad del sistema > 99.5%

## Consideraciones de Seguridad

### Validaciones
- Autenticación requerida para todas las operaciones
- Autorización basada en roles (RBAC)
- Validación de entrada en cliente y servidor
- Sanitización de datos antes de almacenamiento

### Auditoría
- Log de todas las operaciones CRUD
- Tracking de cambios en estados críticos
- Backup automático diario
- Retention policy de 7 años para datos de auditoría

## Comandos de Desarrollo

### Setup Inicial
```bash
# Instalar dependencias
pnpm install

# Configurar base de datos
npx prisma generate
npx prisma db push

# Ejecutar seeders
npx tsx scripts/migrate-acreditaciones-data.ts

# Iniciar desarrollo
pnpm dev
```

### Calidad de Código
```bash
# Linting
pnpm lint

# Type checking
pnpm typecheck

# Testing
pnpm test
pnpm test:coverage

# Build
pnpm build
```

## Documentación Adicional

- [Guía de API](./api-acreditaciones.md)
- [Manual de Usuario](./manual-usuario-acreditaciones.md)
- [Troubleshooting](./troubleshooting-acreditaciones.md)
- [Deployment Guide](./deployment-acreditaciones.md)

---

**Responsables:**
- **Tech Lead:** Kendy Qualey
- **Backend:** Luisa Fernandez
- **Frontend:** Kendy Qualey
- **QA:** Por asignar

**Próxima Revisión:** 2025-02-15