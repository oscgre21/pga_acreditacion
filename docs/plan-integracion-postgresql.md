# Plan de Integración PostgreSQL con Docker - PGA CESAC

## 📋 Resumen Ejecutivo

**Objetivo:** Migrar el sistema PGA de datos mock estáticos a PostgreSQL con despliegue containerizado usando Docker.

**Duración Estimada:** 6-8 semanas
**Arquitectura:** Clean Architecture con capas separadas
**Tecnologías:** PostgreSQL + Prisma + Docker + Next.js

---

## 🏗️ Arquitectura por Capas

### Capa 1: Base de Datos (PostgreSQL)
```
[PostgreSQL Container]
    ├── Schema Definition
    ├── Migrations
    ├── Seeders (Datos Mock)
    └── Índices y Constraints
```

### Capa 2: Acceso a Datos (Data Layer)
```
[Prisma ORM]
    ├── Schema Definition (schema.prisma)
    ├── Client Generation
    ├── Query Builders
    └── Type Safety
```

### Capa 3: Lógica de Negocio (Business Layer)
```
[Services & Repositories]
    ├── Repository Pattern
    ├── Business Logic Services
    ├── Data Transfer Objects (DTOs)
    └── Domain Models
```

### Capa 4: API (Presentation Layer)
```
[Next.js API Routes]
    ├── REST Endpoints
    ├── Request Validation
    ├── Response Formatting
    └── Error Handling
```

### Capa 5: Frontend (Cliente)
```
[React Components]
    ├── Data Fetching (SWR/TanStack Query)
    ├── State Management
    ├── UI Components
    └── Context Providers
```

---

## 📊 Análisis de Entidades Identificadas

### 1. **Apps/Sistemas** (12 aplicaciones)
```typescript
interface App {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  version: string;
  lastUpdate: string;
  lastAudit: string;
  auditor: string;
  incidents: Incident[];
  clientId: string;
  code: string;
  urlDestino: string;
  redirectUrl: string;
  assignedDev: string;
  backendDev: string;
  frontendDev: string;
  users72h: number;
  totalUsers: number;
  technicalDetails: TechnicalDetails;
}
```

### 2. **Usuarios** (10+ usuarios)
```typescript
interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  telefono: string;
  activo: boolean;
  rango: string;
  departamento: string;
  nivelPerfil: string;
  appsConcedidas: App[];
  ultimosAccesos: Acceso[];
}
```

### 3. **Notificaciones**
```typescript
interface Notificacion {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  href?: string;
  usuarioId: number;
}
```

### 4. **Trámites y Discrepancias**
```typescript
interface Tramite {
  id: string;
  solicitante: string;
  personal: string;
  tipo: string;
  estado: string;
  fechaCreacion: Date;
  discrepancias: Discrepancia[];
}

interface Discrepancia {
  id: string;
  tramiteId: string;
  tema: string;
  estado: string;
  fechaReporte: Date;
  hallazgos: Hallazgo[];
  comunicaciones: Comunicacion[];
}
```

---

## 🚀 Plan de Implementación Detallado

### **Fase 1: Configuración del Entorno (Semana 1-2)**

#### 1.1 Configuración Docker
```dockerfile
# Dockerfile.dev
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 1.2 Docker Compose para Desarrollo
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pga_postgres_dev
    environment:
      POSTGRES_DB: pga_cesac_dev
      POSTGRES_USER: pga_user
      POSTGRES_PASSWORD: pga_password_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: pga_app_dev
    environment:
      DATABASE_URL: postgresql://pga_user:pga_password_dev@postgres:5432/pga_cesac_dev
      NEXTAUTH_SECRET: development_secret_key
      NEXTAUTH_URL: http://localhost:3000
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - postgres
    restart: unless-stopped

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pga_pgadmin_dev
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@cesac.mil.do
      PGADMIN_DEFAULT_PASSWORD: admin_password
    ports:
      - "5050:80"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 1.3 Configuración de Entorno
```bash
# .env.development
DATABASE_URL="postgresql://pga_user:pga_password_dev@localhost:5432/pga_cesac_dev"
NEXTAUTH_SECRET="development_secret_key_minimum_32_characters"
NEXTAUTH_URL="http://localhost:3000"

# .env.production
DATABASE_URL="postgresql://pga_user:pga_password_prod@your_private_host:5432/pga_cesac_prod"
NEXTAUTH_SECRET="your_production_secret_key_minimum_32_characters"
NEXTAUTH_URL="https://your_production_domain.com"
```

---

### **Fase 2: Diseño e Implementación del Schema (Semana 3)**

#### 2.1 Instalación de Dependencias
```bash
# Instalar Prisma y dependencias relacionadas
pnpm add prisma @prisma/client
pnpm add -D prisma

# Instalar autenticación
pnpm add next-auth @auth/prisma-adapter bcryptjs
pnpm add -D @types/bcryptjs

# Instalar validación y utilidades
pnpm add zod (ya instalado)
pnpm add swr date-fns (ya instalado)
```

#### 2.2 Schema de Base de Datos (Prisma)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// === MODELOS PRINCIPALES ===

model Usuario {
  id                    Int       @id @default(autoincrement())
  nombre                String
  usuario               String    @unique
  correo                String    @unique
  telefono              String?
  activo                Boolean   @default(true)
  rango                 String
  departamento          String
  nivelPerfil           NivelPerfil
  passwordHash          String
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relaciones
  appsConcedidas        UsuarioApp[]
  ultimosAccesos        AccesoApp[]
  notificaciones        Notificacion[]
  tramitesCreados       Tramite[]
  discrepanciasReportadas Discrepancia[]
  comunicaciones        Comunicacion[]
  auditorias            App[] @relation("AuditorApps")

  @@map("usuarios")
}

model App {
  id                    String    @id
  nombre                String
  descripcion           Text
  activa                Boolean   @default(true)
  version               String
  lastUpdate            DateTime
  lastAudit             DateTime
  auditorId             Int?
  clientId              String    @unique
  code                  String    @unique
  urlDestino            String
  redirectUrl           String
  assignedDevId         Int?
  backendDevId          Int?
  frontendDevId         Int?
  users72h              Int       @default(0)
  totalUsers            Int       @default(0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relaciones
  auditor               Usuario?  @relation("AuditorApps", fields: [auditorId], references: [id])
  assignedDev           Usuario?  @relation("AssignedDev", fields: [assignedDevId], references: [id])
  backendDev            Usuario?  @relation("BackendDev", fields: [backendDevId], references: [id])
  frontendDev           Usuario?  @relation("FrontendDev", fields: [frontendDevId], references: [id])

  usuariosApp           UsuarioApp[]
  accesos               AccesoApp[]
  incidentes            Incidente[]
  detallesTecnicos      DetalleTecnico?

  @@map("apps")
}

model DetalleTecnico {
  id                    Int       @id @default(autoincrement())
  appId                 String    @unique
  stack                 String[]  // Array de tecnologías
  architecture          String
  database              String
  cicd                  String[]  // Array de herramientas CI/CD
  repository            String
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  app                   App       @relation(fields: [appId], references: [id], onDelete: Cascade)

  @@map("detalles_tecnicos")
}

model UsuarioApp {
  id                    Int       @id @default(autoincrement())
  usuarioId             Int
  appId                 String
  fechaConcesion        DateTime  @default(now())
  activa                Boolean   @default(true)

  usuario               Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  app                   App       @relation(fields: [appId], references: [id], onDelete: Cascade)

  @@unique([usuarioId, appId])
  @@map("usuario_apps")
}

model AccesoApp {
  id                    Int       @id @default(autoincrement())
  usuarioId             Int
  appId                 String
  fecha                 DateTime  @default(now())
  hora                  String
  ipAddress             String?
  userAgent             String?

  usuario               Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  app                   App       @relation(fields: [appId], references: [id], onDelete: Cascade)

  @@map("accesos_app")
}

model Incidente {
  id                    Int       @id @default(autoincrement())
  appId                 String
  tipo                  TipoIncidente
  descripcion           String
  count                 Int       @default(1)
  resuelto              Boolean   @default(false)
  fechaReporte          DateTime  @default(now())
  fechaResolucion       DateTime?

  app                   App       @relation(fields: [appId], references: [id], onDelete: Cascade)

  @@map("incidentes")
}

model Notificacion {
  id                    Int       @id @default(autoincrement())
  usuarioId             Int
  titulo                String
  descripcion           Text
  leida                 Boolean   @default(false)
  href                  String?
  createdAt             DateTime  @default(now())

  usuario               Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("notificaciones")
}

model Tramite {
  id                    String    @id @default(cuid())
  numero                String    @unique
  solicitante           String
  personal              String?
  tipo                  String
  estado                EstadoTramite @default(PENDIENTE)
  fechaCreacion         DateTime  @default(now())
  fechaActualizacion    DateTime  @updatedAt
  usuarioCreadorId      Int?

  usuarioCreador        Usuario?  @relation(fields: [usuarioCreadorId], references: [id])
  discrepancias         Discrepancia[]

  @@map("tramites")
}

model Discrepancia {
  id                    String    @id @default(cuid())
  tramiteId             String
  tema                  String
  estado                EstadoDiscrepancia @default(ABIERTA)
  fechaReporte          DateTime  @default(now())
  usuarioReportaId      Int?

  tramite               Tramite   @relation(fields: [tramiteId], references: [id], onDelete: Cascade)
  usuarioReporta        Usuario?  @relation(fields: [usuarioReportaId], references: [id])
  hallazgos             Hallazgo[]
  comunicaciones        Comunicacion[]

  @@map("discrepancias")
}

model Hallazgo {
  id                    String    @id @default(cuid())
  discrepanciaId        String
  descripcion           Text
  fecha                 DateTime  @default(now())
  reportadoPor          String

  discrepancia          Discrepancia @relation(fields: [discrepanciaId], references: [id], onDelete: Cascade)

  @@map("hallazgos")
}

model Comunicacion {
  id                    String    @id @default(cuid())
  discrepanciaId        String
  fecha                 DateTime  @default(now())
  tipo                  TipoComunicacion
  resumen               Text
  usuarioId             Int

  discrepancia          Discrepancia @relation(fields: [discrepanciaId], references: [id], onDelete: Cascade)
  usuario               Usuario      @relation(fields: [usuarioId], references: [id])

  @@map("comunicaciones")
}

// === ENUMS ===

enum NivelPerfil {
  ESTANDAR    @map("Estándar")
  AVANZADO    @map("Avanzado")
  ADMINISTRATIVO @map("Administrativo")
  MASTER_KEY  @map("Master Key")

  @@map("nivel_perfil")
}

enum TipoIncidente {
  CRITICO     @map("Crítico")
  ADVERTENCIA @map("Advertencia")
  MENOR       @map("Menor")

  @@map("tipo_incidente")
}

enum EstadoTramite {
  PENDIENTE   @map("Pendiente")
  EN_PROCESO  @map("En Proceso")
  COMPLETADO  @map("Completado")
  CANCELADO   @map("Cancelado")

  @@map("estado_tramite")
}

enum EstadoDiscrepancia {
  ABIERTA     @map("Abierta")
  CERRADA     @map("Cerrada")
  EN_REVISION @map("En Revisión")

  @@map("estado_discrepancia")
}

enum TipoComunicacion {
  CORREO      @map("Correo Electrónico")
  LLAMADA     @map("Llamada Telefónica")
  REUNION     @map("Reunión")
  MENSAJE     @map("Mensaje Interno")

  @@map("tipo_comunicacion")
}
```

#### 2.3 Configuración de Prisma
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

### **Fase 3: Migración de Datos Mock (Semana 4)**

#### 3.1 Seeders Estructurados

```typescript
// prisma/seeds/001_usuarios.ts
import { PrismaClient, NivelPerfil } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedUsuarios() {
  console.log('🌱 Seeding usuarios...')

  const usuarios = [
    {
      id: 1,
      nombre: 'Administrador Cargos',
      usuario: 'admincargos',
      correo: 'josemanuel@cesac.mil.do',
      telefono: '(809)-000-0000',
      activo: true,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
      nivelPerfil: NivelPerfil.MASTER_KEY,
      passwordHash: await bcrypt.hash('admin123', 10),
    },
    {
      id: 2,
      nombre: 'Administrador Registro Control',
      usuario: 'adminregistrocontrol',
      correo: 'henrycodigo@hotmail.com',
      telefono: '(809)-000-0000',
      activo: true,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN',
      nivelPerfil: NivelPerfil.ADMINISTRATIVO,
      passwordHash: await bcrypt.hash('admin123', 10),
    },
    // ... más usuarios basados en usersData
  ]

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { id: usuario.id },
      update: {},
      create: usuario,
    })
  }

  console.log('✅ Usuarios seeded successfully')
}
```

```typescript
// prisma/seeds/002_apps.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedApps() {
  console.log('🌱 Seeding apps...')

  const apps = [
    {
      id: 'SGU',
      nombre: 'Sistema Gestión Usuario',
      descripcion: 'Plataforma centralizada para la administración de identidades y accesos.',
      activa: true,
      version: '2.5.1',
      lastUpdate: new Date('2024-07-28'),
      lastAudit: new Date('2024-06-15'),
      auditorId: 1, // Ana García (simulado)
      clientId: 'SGU_CLIENT_001',
      code: 'SGU_CODE_XYZ',
      urlDestino: 'https://sgu.cesac.mil.do',
      redirectUrl: 'https://sgu.cesac.mil.do/auth/callback',
      assignedDevId: 2, // Carlos Martinez (simulado)
      backendDevId: 3,  // Luisa Fernandez (simulado)
      frontendDevId: 4, // Kendy Qualey (simulado)
      users72h: 152,
      totalUsers: 590,
    },
    // ... más apps basadas en initialApps
  ]

  for (const app of apps) {
    await prisma.app.upsert({
      where: { id: app.id },
      update: {},
      create: app,
    })
  }

  console.log('✅ Apps seeded successfully')
}
```

```typescript
// prisma/seeds/003_detalles_tecnicos.ts
export async function seedDetallesTecnicos() {
  console.log('🌱 Seeding detalles técnicos...')

  const detallesTecnicos = [
    {
      appId: 'SGU',
      stack: ['Next.js (React)', 'Node.js (Express)', 'TypeScript'],
      architecture: 'Microservicios',
      database: 'PostgreSQL 14',
      cicd: ['GitHub Actions', 'Docker', 'Kubernetes (GKE)'],
      repository: 'github.com/cesac/sgu-main',
    },
    // ... más detalles técnicos
  ]

  for (const detalle of detallesTecnicos) {
    await prisma.detalleTecnico.upsert({
      where: { appId: detalle.appId },
      update: {},
      create: detalle,
    })
  }

  console.log('✅ Detalles técnicos seeded successfully')
}
```

```typescript
// prisma/seeds/004_relaciones.ts
export async function seedRelaciones() {
  console.log('🌱 Seeding relaciones usuario-app...')

  // Basado en appsConcedidas de usersData
  const usuarioApps = [
    { usuarioId: 1, appId: 'SGU' },
    { usuarioId: 1, appId: 'SCU' },
    { usuarioId: 1, appId: 'MA - CESAC' },
    { usuarioId: 2, appId: 'SGU' },
    { usuarioId: 2, appId: 'SCU' },
    { usuarioId: 2, appId: 'SDP' },
    // ... más relaciones
  ]

  for (const relacion of usuarioApps) {
    await prisma.usuarioApp.upsert({
      where: {
        usuarioId_appId: {
          usuarioId: relacion.usuarioId,
          appId: relacion.appId,
        },
      },
      update: {},
      create: relacion,
    })
  }

  console.log('✅ Relaciones usuario-app seeded successfully')
}
```

```typescript
// prisma/seeds/005_notificaciones.ts
export async function seedNotificaciones() {
  console.log('🌱 Seeding notificaciones...')

  const notificaciones = [
    {
      usuarioId: 1,
      titulo: '¡Trámite Recibido!',
      descripcion: 'Felicidades, su trámite número 12022 ha sido recibido satisfactoriamente.',
      leida: false,
      href: '/cliente/mis-tramites?id=12022',
    },
    {
      usuarioId: 1,
      titulo: 'Documento Requerido',
      descripcion: 'Se requiere un nuevo documento para el trámite #12025.',
      leida: false,
      href: '/cliente/mis-tramites?id=12025',
    },
    // ... más notificaciones
  ]

  for (const notificacion of notificaciones) {
    await prisma.notificacion.create({
      data: notificacion,
    })
  }

  console.log('✅ Notificaciones seeded successfully')
}
```

#### 3.2 Seeder Principal
```typescript
// prisma/seed.ts
import { seedUsuarios } from './seeds/001_usuarios'
import { seedApps } from './seeds/002_apps'
import { seedDetallesTecnicos } from './seeds/003_detalles_tecnicos'
import { seedRelaciones } from './seeds/004_relaciones'
import { seedNotificaciones } from './seeds/005_notificaciones'
import { seedTramites } from './seeds/006_tramites'
import { seedIncidentes } from './seeds/007_incidentes'

async function main() {
  console.log('🚀 Starting database seeding...')

  try {
    await seedUsuarios()
    await seedApps()
    await seedDetallesTecnicos()
    await seedRelaciones()
    await seedNotificaciones()
    await seedTramites()
    await seedIncidentes()

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

#### 3.3 Scripts de Package.json
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",
    "db:studio": "prisma studio",
    "db:deploy": "prisma migrate deploy"
  }
}
```

---

### **Fase 4: Capa de Acceso a Datos (Semana 5)**

#### 4.1 Repository Pattern
```typescript
// src/lib/repositories/base.repository.ts
export abstract class BaseRepository<T, CreateData, UpdateData> {
  constructor(protected model: any) {}

  async findMany(where?: any, include?: any): Promise<T[]> {
    return this.model.findMany({ where, include })
  }

  async findById(id: string | number, include?: any): Promise<T | null> {
    return this.model.findUnique({ where: { id }, include })
  }

  async create(data: CreateData): Promise<T> {
    return this.model.create({ data })
  }

  async update(id: string | number, data: UpdateData): Promise<T> {
    return this.model.update({ where: { id }, data })
  }

  async delete(id: string | number): Promise<T> {
    return this.model.delete({ where: { id } })
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where })
  }
}
```

```typescript
// src/lib/repositories/usuario.repository.ts
import { prisma } from '@/lib/prisma'
import { Usuario, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export class UsuarioRepository extends BaseRepository<
  Usuario,
  Prisma.UsuarioCreateInput,
  Prisma.UsuarioUpdateInput
> {
  constructor() {
    super(prisma.usuario)
  }

  async findByEmail(correo: string) {
    return prisma.usuario.findUnique({
      where: { correo },
      include: {
        appsConcedidas: {
          include: {
            app: true
          }
        },
        ultimosAccesos: {
          include: {
            app: true
          },
          orderBy: {
            fecha: 'desc'
          },
          take: 5
        }
      }
    })
  }

  async findByUsuario(usuario: string) {
    return prisma.usuario.findUnique({
      where: { usuario },
      include: {
        appsConcedidas: {
          where: { activa: true },
          include: {
            app: {
              where: { activa: true }
            }
          }
        }
      }
    })
  }

  async findActiveUsers() {
    return prisma.usuario.findMany({
      where: { activo: true },
      include: {
        appsConcedidas: {
          where: { activa: true },
          include: {
            app: true
          }
        }
      }
    })
  }

  async updateLastAccess(usuarioId: number, appId: string) {
    return prisma.accesoApp.create({
      data: {
        usuarioId,
        appId,
        hora: new Date().toLocaleTimeString(),
        ipAddress: '127.0.0.1', // Se capturará del request
      }
    })
  }
}
```

```typescript
// src/lib/repositories/app.repository.ts
import { prisma } from '@/lib/prisma'
import { App, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export class AppRepository extends BaseRepository<
  App,
  Prisma.AppCreateInput,
  Prisma.AppUpdateInput
> {
  constructor() {
    super(prisma.app)
  }

  async findActiveApps() {
    return prisma.app.findMany({
      where: { activa: true },
      include: {
        auditor: true,
        assignedDev: true,
        backendDev: true,
        frontendDev: true,
        detallesTecnicos: true,
        incidentes: {
          where: { resuelto: false }
        },
        _count: {
          select: {
            usuariosApp: {
              where: { activa: true }
            }
          }
        }
      }
    })
  }

  async findWithStats(appId: string) {
    return prisma.app.findUnique({
      where: { id: appId },
      include: {
        auditor: true,
        detallesTecnicos: true,
        incidentes: true,
        usuariosApp: {
          include: {
            usuario: true
          }
        },
        accesos: {
          where: {
            fecha: {
              gte: new Date(Date.now() - 72 * 60 * 60 * 1000) // últimas 72h
            }
          }
        }
      }
    })
  }
}
```

```typescript
// src/lib/repositories/notificacion.repository.ts
import { prisma } from '@/lib/prisma'
import { Notificacion, Prisma } from '@prisma/client'
import { BaseRepository } from './base.repository'

export class NotificacionRepository extends BaseRepository<
  Notificacion,
  Prisma.NotificacionCreateInput,
  Prisma.NotificacionUpdateInput
> {
  constructor() {
    super(prisma.notificacion)
  }

  async findByUsuario(usuarioId: number) {
    return prisma.notificacion.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findUnreadCount(usuarioId: number) {
    return prisma.notificacion.count({
      where: {
        usuarioId,
        leida: false
      }
    })
  }

  async markAllAsRead(usuarioId: number) {
    return prisma.notificacion.updateMany({
      where: {
        usuarioId,
        leida: false
      },
      data: { leida: true }
    })
  }
}
```

#### 4.2 Services Layer
```typescript
// src/lib/services/usuario.service.ts
import { UsuarioRepository } from '@/lib/repositories/usuario.repository'
import bcrypt from 'bcryptjs'

export class UsuarioService {
  private usuarioRepo: UsuarioRepository

  constructor() {
    this.usuarioRepo = new UsuarioRepository()
  }

  async authenticateUser(usuario: string, password: string) {
    const user = await this.usuarioRepo.findByUsuario(usuario)

    if (!user || !user.activo) {
      throw new Error('Usuario no encontrado o inactivo')
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta')
    }

    // Omitir password hash en la respuesta
    const { passwordHash, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getUserWithApps(usuarioId: number) {
    return this.usuarioRepo.findById(usuarioId, {
      appsConcedidas: {
        where: { activa: true },
        include: {
          app: {
            where: { activa: true },
            include: {
              detallesTecnicos: true,
              incidentes: {
                where: { resuelto: false }
              }
            }
          }
        }
      },
      ultimosAccesos: {
        include: {
          app: true
        },
        orderBy: {
          fecha: 'desc'
        },
        take: 10
      }
    })
  }

  async createUser(userData: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    return this.usuarioRepo.create({
      ...userData,
      passwordHash: hashedPassword
    })
  }
}
```

#### 4.3 DTOs (Data Transfer Objects)
```typescript
// src/lib/dtos/usuario.dto.ts
import { z } from 'zod'
import { NivelPerfil } from '@prisma/client'

export const CreateUserSchema = z.object({
  nombre: z.string().min(1),
  usuario: z.string().min(3),
  correo: z.string().email(),
  telefono: z.string().optional(),
  rango: z.string().min(1),
  departamento: z.string().min(1),
  nivelPerfil: z.nativeEnum(NivelPerfil),
  password: z.string().min(6),
})

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true })

export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>
```

---

### **Fase 5: API Routes (Semana 6)**

#### 5.1 Estructura de API Routes
```typescript
// src/app/api/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UsuarioService } from '@/lib/services/usuario.service'
import { CreateUserSchema } from '@/lib/dtos/usuario.dto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const usuarioService = new UsuarioService()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuarios = await usuarioService.getAllActiveUsers()
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error fetching usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.nivelPerfil !== 'MASTER_KEY') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = CreateUserSchema.parse(body)

    const nuevoUsuario = await usuarioService.createUser(validatedData)
    return NextResponse.json(nuevoUsuario, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

```typescript
// src/app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UsuarioService } from '@/lib/services/usuario.service'
import { UpdateUserSchema } from '@/lib/dtos/usuario.dto'

const usuarioService = new UsuarioService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioId = parseInt(params.id)

    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const usuario = await usuarioService.getUserWithApps(usuarioId)

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error fetching usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const usuarioId = parseInt(params.id)
    const body = await request.json()
    const validatedData = UpdateUserSchema.parse(body)

    const usuarioActualizado = await usuarioService.updateUser(usuarioId, validatedData)
    return NextResponse.json(usuarioActualizado)
  } catch (error) {
    // Error handling similar al anterior
  }
}
```

#### 5.2 API Routes para Apps
```typescript
// src/app/api/apps/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { AppService } from '@/lib/services/app.service'

const appService = new AppService()

export async function GET() {
  try {
    const apps = await appService.getActiveAppsWithStats()
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Error fetching apps:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

#### 5.3 API Routes para Notificaciones
```typescript
// src/app/api/notificaciones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NotificacionService } from '@/lib/services/notificacion.service'
import { getServerSession } from 'next-auth'

const notificacionService = new NotificacionService()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const notificaciones = await notificacionService.getByUsuario(session.user.id)
    return NextResponse.json(notificaciones)
  } catch (error) {
    console.error('Error fetching notificaciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await notificacionService.markAllAsRead(session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

---

### **Fase 6: Integración Frontend (Semana 7)**

#### 6.1 Hooks para Data Fetching
```typescript
// src/hooks/useUsuarios.ts
import useSWR from 'swr'
import { Usuario } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useUsuarios() {
  const { data, error, isLoading, mutate } = useSWR<Usuario[]>(
    '/api/usuarios',
    fetcher
  )

  return {
    usuarios: data,
    isLoading,
    error,
    refresh: mutate
  }
}

export function useUsuario(id: number) {
  const { data, error, isLoading } = useSWR<Usuario>(
    id ? `/api/usuarios/${id}` : null,
    fetcher
  )

  return {
    usuario: data,
    isLoading,
    error
  }
}
```

```typescript
// src/hooks/useNotificaciones.ts
import useSWR from 'swr'
import { Notificacion } from '@prisma/client'

export function useNotificaciones() {
  const { data, error, isLoading, mutate } = useSWR<Notificacion[]>(
    '/api/notificaciones',
    fetcher
  )

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notificaciones', {
        method: 'PATCH',
      })
      mutate() // Refresh data
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const unreadCount = data?.filter(n => !n.leida).length || 0

  return {
    notificaciones: data,
    isLoading,
    error,
    markAllAsRead,
    unreadCount,
    refresh: mutate
  }
}
```

#### 6.2 Actualización de Contexts
```typescript
// src/contexts/client-portal-context.tsx (ACTUALIZADO)
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useNotificaciones } from '@/hooks/useNotificaciones';

// Mantener tipos existentes
type CardId = "tramites-proceso" | "tramites-completados" | "documentos-pendientes" | "notificaciones" | "personal-activo" | "vencimientos-proximos";
type VisibleCardsState = Record<CardId, boolean>;

interface ClientPortalContextType {
  visibleCards: VisibleCardsState;
  toggleCardVisibility: (cardId: CardId) => void;
  notificaciones: Notificacion[];
  markAllAsRead: () => void;
  unreadCount: number;
  isLoading: boolean;
}

const ClientPortalContext = createContext<ClientPortalContextType | undefined>(undefined);

const initialVisibleCards: VisibleCardsState = {
  "tramites-proceso": true,
  "tramites-completados": true,
  "documentos-pendientes": true,
  "notificaciones": true,
  "personal-activo": true,
  "vencimientos-proximos": true,
};

export function ClientPortalProvider({ children }: { children: ReactNode }) {
  const [visibleCards, setVisibleCards] = React.useState<VisibleCardsState>(initialVisibleCards);

  // Reemplazar datos mock con hook real
  const {
    notificaciones = [],
    markAllAsRead,
    unreadCount,
    isLoading
  } = useNotificaciones();

  const toggleCardVisibility = (cardId: CardId) => {
    setVisibleCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const value = {
    visibleCards,
    toggleCardVisibility,
    notificaciones,
    markAllAsRead,
    unreadCount,
    isLoading,
  };

  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}

export function useClientPortal() {
  const context = useContext(ClientPortalContext);
  if (context === undefined) {
    throw new Error('useClientPortal must be used within a ClientPortalProvider');
  }
  return context;
}
```

#### 6.3 Componentes Actualizados
```typescript
// src/components/dashboard/users-table.tsx (NUEVO)
"use client";

import { useUsuarios } from '@/hooks/useUsuarios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function UsersTable() {
  const { usuarios, isLoading, error } = useUsuarios();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading users: {error.message}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Apps Concedidas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios?.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell className="font-medium">{usuario.nombre}</TableCell>
            <TableCell>{usuario.usuario}</TableCell>
            <TableCell>{usuario.departamento}</TableCell>
            <TableCell>
              <Badge variant="outline">{usuario.nivelPerfil}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={usuario.activo ? "default" : "secondary"}>
                {usuario.activo ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>
              {usuario.appsConcedidas?.length || 0} apps
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### **Fase 7: Autenticación (Semana 8)**

#### 7.1 Configuración NextAuth.js
```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { UsuarioService } from '@/lib/services/usuario.service'

const usuarioService = new UsuarioService()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        usuario: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.password) {
          return null
        }

        try {
          const user = await usuarioService.authenticateUser(
            credentials.usuario,
            credentials.password
          )

          return {
            id: user.id.toString(),
            name: user.nombre,
            email: user.correo,
            usuario: user.usuario,
            departamento: user.departamento,
            nivelPerfil: user.nivelPerfil,
            rango: user.rango,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.usuario = user.usuario
        token.departamento = user.departamento
        token.nivelPerfil = user.nivelPerfil
        token.rango = user.rango
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = parseInt(token.sub!)
        session.user.usuario = token.usuario as string
        session.user.departamento = token.departamento as string
        session.user.nivelPerfil = token.nivelPerfil as string
        session.user.rango = token.rango as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
}
```

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

#### 7.2 Middleware de Autenticación
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cliente/:path*',
    '/gateway/:path*',
    '/api/((?!auth).)*',
  ],
}
```

---

### **Fase 8: Dockerización (Semana 8)**

#### 8.1 Dockerfile de Producción
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN corepack enable pnpm && pnpm prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

#### 8.2 Docker Compose para Producción
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pga_postgres_prod
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./database/backup:/backup
    restart: unless-stopped
    networks:
      - pga_network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: pga_app_prod
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    ports:
      - "${APP_PORT}:3000"
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - pga_network

  nginx:
    image: nginx:alpine
    container_name: pga_nginx_prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - pga_network

volumes:
  postgres_prod_data:

networks:
  pga_network:
    driver: bridge
```

#### 8.3 Scripts de Despliegue
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting PGA deployment..."

# Load environment variables
set -a
source .env.production
set +a

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Build and deploy with Docker Compose
echo "🏗️ Building and starting containers..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations and seeding
echo "🗄️ Running database setup..."
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec app npx prisma db seed

# Check health
echo "🔍 Checking application health..."
sleep 10
if curl -f http://localhost:${APP_PORT}/api/health; then
    echo "✅ Application is running successfully!"
else
    echo "❌ Application health check failed!"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
```

---

## 📋 Checklist de Implementación

### Preparación (Semana 1)
- [ ] Configurar entorno Docker local
- [ ] Instalar dependencias (Prisma, NextAuth, etc.)
- [ ] Configurar variables de entorno
- [ ] Configurar hosting PostgreSQL privado

### Base de Datos (Semana 2-3)
- [ ] Definir schema completo en Prisma
- [ ] Crear migraciones iniciales
- [ ] Desarrollar seeders para todos los datos mock
- [ ] Verificar integridad referencial

### Capa de Datos (Semana 4-5)
- [ ] Implementar repositories
- [ ] Crear services con lógica de negocio
- [ ] Desarrollar DTOs y validaciones
- [ ] Testing unitario de repositories

### API Layer (Semana 6)
- [ ] Implementar todas las API routes
- [ ] Validación de entrada con Zod
- [ ] Manejo de errores consistente
- [ ] Testing de integración de APIs

### Frontend Integration (Semana 7)
- [ ] Reemplazar datos mock con API calls
- [ ] Implementar hooks de data fetching
- [ ] Actualizar contexts existentes
- [ ] Testing de componentes

### Autenticación (Semana 8)
- [ ] Configurar NextAuth.js
- [ ] Implementar middleware de autenticación
- [ ] Sistema de roles y permisos
- [ ] Testing de autenticación

### Deployment (Semana 8)
- [ ] Dockerizar aplicación
- [ ] Configurar Docker Compose
- [ ] Scripts de deployment automatizado
- [ ] Configurar CI/CD básico

---

## 🔧 Mejores Prácticas Implementadas

### Seguridad
- **Validación exhaustiva** con Zod en cada endpoint
- **Hashing de contraseñas** con bcrypt
- **JWT tokens** seguros con NextAuth.js
- **Autorización basada en roles** a nivel de API
- **Variables de entorno** para credenciales sensibles

### Performance
- **Connection pooling** automático con Prisma
- **Lazy loading** de relaciones
- **Índices** optimizados en PostgreSQL
- **Caching** con SWR en frontend
- **Image optimization** con Next.js

### Mantenibilidad
- **Clean Architecture** por capas
- **Repository Pattern** para abstracción de datos
- **Service Layer** para lógica de negocio
- **TypeScript** para type safety
- **Error handling** consistente

### DevOps
- **Multi-stage Docker builds** para optimización
- **Health checks** automatizados
- **Database migrations** versionadas
- **Seed data** reproducible
- **Environment-specific configs**

---

## 📊 Estimación de Recursos

### Tiempo Total: 8 semanas
- **Desarrollo**: 6 semanas
- **Testing & Deploy**: 2 semanas

### Recursos Técnicos
- **Desarrollador Senior**: 1 FTE
- **Hosting PostgreSQL**: Configurado por cliente
- **CI/CD Setup**: Básico incluido

### Infraestructura Mínima
- **CPU**: 2 vCPUs
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **Network**: 100 Mbps

---

## 🚀 Conclusión

Este plan proporciona una migración completa y estructurada de datos mock a PostgreSQL usando las mejores prácticas de desarrollo moderno. La arquitectura por capas asegura escalabilidad y mantenibilidad, mientras que Docker facilita el despliegue en cualquier entorno.

El proyecto resultante será significativamente más robusto, escalable y profesional que la implementación actual con datos estáticos.