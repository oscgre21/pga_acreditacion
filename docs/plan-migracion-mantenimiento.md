# Plan de Migración e Implementación - Módulos de Mantenimiento PGA

## Resumen Ejecutivo

Este documento presenta un plan integral para migrar e implementar todos los módulos CRUD del sistema de mantenimiento PGA, siguiendo las mejores prácticas de desarrollo y asegurando la migración completa de datos existentes sin pérdida de información.

## Estado Actual del Sistema

### Módulos Identificados

| Módulo | Estado Actual | Modelo en DB | Data Mock | Prioridad |
|--------|---------------|--------------|-----------|-----------|
| 🏢 **Compañías** | Implementado | ❌ | ✅ | 🔴 Alta |
| 🏷️ **Categorías** | Implementado | ❌ | ✅ | 🔴 Alta |
| 💼 **Perfil de Empresa** | Parcial | ❌ | ❓ | 🟡 Media |
| ✈️ **Aeropuertos** | Implementado | ✅ | ✅ | 🟢 Baja |
| 🏛️ **Dependencias** | Implementado | ❌ | ✅ | 🔴 Alta |
| 👤 **Validadores** | Implementado | ❌ | ✅ | 🔴 Alta |
| 👷 **Ejecutores** | Parcial | ❌ | ❓ | 🟡 Media |
| 📋 **Trámites** | Complejo | ✅ | ✅ | 🔴 Alta |
| 🛡️ **Servicios de Seguridad** | Parcial | ✅ | ✅ | 🟢 Baja |
| 🔧 **Equipos de Seguridad** | No implementado | ❌ | ❌ | 🟡 Media |
| 📄 **Tipos de Documento** | No implementado | ❌ | ❌ | 🟡 Media |
| 👨‍💼 **Persona Específica** | Parcial | ❌ | ❓ | 🟡 Media |

### Arquitectura Actual

- **Frontend**: Next.js 15.3.3 con App Router
- **Forms**: React Hook Form + Zod validation
- **UI**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL con Prisma ORM
- **Datos**: Mock data hardcodeada en archivos

## Plan de Migración por Fases

### 🚀 FASE 1: Fundamentos y Modelos Base (Semanas 1-2)

#### 1.1 Modelos de Base de Datos
**Objetivo**: Crear todos los modelos Prisma faltantes

```prisma
// Nuevos modelos a crear
model Compania {
  id            String    @id @default(cuid())
  abreviatura   String    @unique
  nombre        String
  rnc           String    @unique
  representante String
  telefono      String
  isWhatsapp    Boolean   @default(false)
  whatsapp      String?
  correo        String    @unique
  estado        EstadoGeneral @default(ACTIVO)
  direccion     String    @db.Text
  logo          String?   // URL del logo
  notas         String?   @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relaciones
  perfilesEmpresa PerfilEmpresa[]
  personal        PersonaEspecifica[]

  @@map("companias")
}

model Categoria {
  id        String        @id @default(cuid())
  nombre    String        @unique
  estado    EstadoGeneral @default(ACTIVO)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@map("categorias")
}

model Dependencia {
  id        String        @id @default(cuid())
  nombre    String        @unique
  estado    EstadoGeneral @default(ACTIVO)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  // Relaciones
  validadores Validador[]
  ejecutores  Ejecutor[]

  @@map("dependencias")
}

model Validador {
  id               String      @id @default(cuid())
  nombre           String
  apellido         String
  rango            String
  dependenciaId    String
  sede             String
  fechaAsignacion  DateTime
  asignadoPor      String
  foto             String?     // URL de la foto
  estado           EstadoGeneral @default(ACTIVO)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  // Relaciones
  dependencia      Dependencia @relation(fields: [dependenciaId], references: [id])

  @@index([dependenciaId])
  @@map("validadores")
}

model Ejecutor {
  id               String      @id @default(cuid())
  nombre           String
  apellido         String
  rango            String
  dependenciaId    String
  sede             String
  fechaAsignacion  DateTime
  asignadoPor      String
  foto             String?     // URL de la foto
  estado           EstadoGeneral @default(ACTIVO)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  // Relaciones
  dependencia      Dependencia @relation(fields: [dependenciaId], references: [id])

  @@index([dependenciaId])
  @@map("ejecutores")
}

model PerfilEmpresa {
  id           String      @id @default(cuid())
  companiaId   String
  tipo         String      // Tipo de perfil
  descripcion  String?     @db.Text
  estado       EstadoGeneral @default(ACTIVO)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relaciones
  compania     Compania    @relation(fields: [companiaId], references: [id])

  @@index([companiaId])
  @@map("perfiles_empresa")
}

model EquipoSeguridad {
  id           String      @id @default(cuid())
  nombre       String
  descripcion  String?     @db.Text
  estado       EstadoGeneral @default(ACTIVO)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("equipos_seguridad")
}

model TipoDocumento {
  id           String      @id @default(cuid())
  nombre       String
  descripcion  String?     @db.Text
  obligatorio  Boolean     @default(true)
  estado       EstadoGeneral @default(ACTIVO)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("tipos_documento")
}

model PersonaEspecifica {
  id           String      @id @default(cuid())
  nombre       String
  apellido     String
  cedula       String      @unique
  companiaId   String?
  funcion      String
  telefono     String?
  correo       String?
  estado       EstadoGeneral @default(ACTIVO)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  // Relaciones
  compania     Compania?   @relation(fields: [companiaId], references: [id])

  @@index([companiaId])
  @@map("personas_especificas")
}

// Enum para estados generales
enum EstadoGeneral {
  ACTIVO    @map("activo")
  INACTIVO  @map("inactivo")

  @@map("estado_general")
}
```

#### 1.2 Servicios y Repositorios
**Objetivo**: Crear la capa de servicios siguiendo el patrón Repository

```typescript
// src/lib/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  protected abstract model: any;

  async findAll(): Promise<T[]> {
    return await this.model.findMany({
      where: { estado: 'ACTIVO' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return await this.model.create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<T> {
    return await this.model.update({
      where: { id },
      data: { estado: 'INACTIVO' }
    });
  }
}
```

### 🏗️ FASE 2: Implementación de Módulos Base (Semanas 3-4)

#### 2.1 Módulos de Configuración Base
- **Compañías**: CRUD completo con validaciones
- **Categorías**: CRUD básico
- **Dependencias**: CRUD básico
- **Equipos de Seguridad**: CRUD básico
- **Tipos de Documento**: CRUD básico

#### 2.2 Arquitectura de Componentes
```typescript
// Estructura estándar para cada módulo
src/app/dashboard/mantenimiento/[modulo]/
├── page.tsx                 // Formulario de creación/edición
├── list/
│   └── page.tsx            // Lista y tabla de datos
├── [id]/
│   └── page.tsx            // Vista de detalle
└── components/
    ├── [modulo]-form.tsx   // Componente de formulario
    ├── [modulo]-table.tsx  // Componente de tabla
    └── [modulo]-detail.tsx // Componente de detalle

src/lib/
├── repositories/
│   └── [modulo].repository.ts
├── services/
│   └── [modulo].service.ts
├── types/
│   └── [modulo].types.ts
└── validations/
    └── [modulo].schemas.ts
```

### 👥 FASE 3: Módulos de Personal (Semanas 5-6)

#### 3.1 Validadores y Ejecutores
- Implementación completa de CRUD
- Gestión de fotos y documentos
- Relaciones con dependencias
- Dashboard de estadísticas

#### 3.2 Personas Específicas
- CRUD de personal con funciones específicas
- Relación con compañías
- Gestión de contactos

### 🔄 FASE 4: Migración de Datos (Semana 7)

#### 4.1 Scripts de Migración
**Objetivo**: Migrar todos los datos mock existentes a la base de datos

```typescript
// scripts/migrate-mock-data.ts
import { PrismaClient } from '@prisma/client';
import { companiesData } from '../src/app/dashboard/mantenimiento/companias/page';
import { categoriesData } from '../src/app/dashboard/mantenimiento/categorias/page';

const prisma = new PrismaClient();

async function migrateCompanies() {
  console.log('Migrando compañías...');

  for (const company of companiesData) {
    await prisma.compania.create({
      data: {
        abreviatura: company.abreviatura,
        nombre: company.nombre,
        rnc: company.rnc,
        representante: company.representante,
        telefono: company.telefono,
        isWhatsapp: company.isWhatsapp,
        whatsapp: company.whatsapp || null,
        correo: company.correo,
        estado: company.estado === 'activo' ? 'ACTIVO' : 'INACTIVO',
        direccion: company.direccion,
        notas: company.notas || null,
      }
    });
  }

  console.log(`✅ ${companiesData.length} compañías migradas`);
}

async function migrateCategories() {
  console.log('Migrando categorías...');

  for (const category of categoriesData) {
    await prisma.categoria.create({
      data: {
        nombre: category.nombre,
        estado: category.estado === 'activo' ? 'ACTIVO' : 'INACTIVO',
      }
    });
  }

  console.log(`✅ ${categoriesData.length} categorías migradas`);
}

async function main() {
  try {
    await migrateCompanies();
    await migrateCategories();
    // ... más migraciones

    console.log('🎉 Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

#### 4.2 Validación de Migración
- Scripts de verificación de integridad
- Comparación de conteos de registros
- Validación de relaciones

### 🔧 FASE 5: Optimización y Refactoring (Semana 8)

#### 5.1 Eliminación de Mock Data
- Remover todos los archivos de datos mock
- Actualizar imports y referencias
- Limpiar código obsoleto

#### 5.2 Optimizaciones
- Implementar paginación en listados
- Añadir filtros y búsqueda avanzada
- Optimizar queries con índices
- Implementar cache donde sea necesario

### 🧪 FASE 6: Testing y Validación (Semana 9)

#### 6.1 Testing
```typescript
// tests/integration/mantenimiento.test.ts
import { test, expect } from '@playwright/test';

test.describe('Módulos de Mantenimiento', () => {
  test('CRUD de Compañías', async ({ page }) => {
    // Crear compañía
    await page.goto('/dashboard/mantenimiento/companias');
    await page.click('[data-testid="create-company-btn"]');
    await page.fill('[name="nombre"]', 'Test Company');
    await page.fill('[name="rnc"]', '123-456-789');
    await page.click('[type="submit"]');

    // Verificar creación
    await expect(page.locator('text=Test Company')).toBeVisible();

    // Editar compañía
    await page.click('[data-testid="edit-company-btn"]');
    await page.fill('[name="nombre"]', 'Updated Company');
    await page.click('[type="submit"]');

    // Verificar actualización
    await expect(page.locator('text=Updated Company')).toBeVisible();
  });
});
```

#### 6.2 Validación de Datos
- Verificar que todos los registros fueron migrados
- Validar integridad referencial
- Comprobar funcionalidad de cada CRUD

## Estructura de Archivos Final

```
src/
├── app/dashboard/mantenimiento/
│   ├── companias/
│   │   ├── page.tsx
│   │   ├── list/page.tsx
│   │   └── [id]/page.tsx
│   ├── categorias/
│   ├── dependencias/
│   ├── validadores/
│   ├── ejecutores/
│   ├── perfil-empresa/
│   ├── equipos-seguridad/
│   ├── tipos-documento/
│   └── persona-especifica/
├── lib/
│   ├── repositories/
│   │   ├── base.repository.ts
│   │   ├── compania.repository.ts
│   │   ├── categoria.repository.ts
│   │   ├── dependencia.repository.ts
│   │   ├── validador.repository.ts
│   │   ├── ejecutor.repository.ts
│   │   ├── perfil-empresa.repository.ts
│   │   ├── equipo-seguridad.repository.ts
│   │   ├── tipo-documento.repository.ts
│   │   └── persona-especifica.repository.ts
│   ├── services/
│   │   └── [correspondientes servicios]
│   ├── types/
│   │   └── [tipos TypeScript]
│   └── validations/
│       └── [esquemas Zod]
├── components/mantenimiento/
│   └── [componentes reutilizables]
└── scripts/
    ├── migrate-mock-data.ts
    └── verify-migration.ts
```

## Comandos de Ejecución

### Desarrollo
```bash
# Migrar esquema de base de datos
pnpm prisma db push

# Ejecutar migración de datos
pnpm tsx scripts/migrate-mock-data.ts

# Verificar migración
pnpm tsx scripts/verify-migration.ts

# Desarrollo
pnpm dev

# Linting y type checking
pnpm lint
pnpm typecheck
```

### Testing
```bash
# Tests unitarios
pnpm test

# Tests de integración
pnpm test:e2e

# Tests de migración
pnpm test:migration
```

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Pérdida de datos en migración | Baja | Alto | Backup completo + scripts de rollback |
| Conflictos de dependencias | Media | Medio | Análisis de dependencias + testing |
| Rendimiento degradado | Media | Medio | Optimización de queries + índices |
| Regresiones en funcionalidad | Media | Alto | Testing exhaustivo + QA |

## Entregables por Fase

### Fase 1
- [ ] Modelos Prisma actualizados
- [ ] Migración de esquema ejecutada
- [ ] Repositorios base implementados

### Fase 2
- [ ] 5 módulos CRUD básicos completados
- [ ] Arquitectura de componentes establecida
- [ ] Documentación de patrones

### Fase 3
- [ ] Módulos de personal completados
- [ ] Gestión de archivos implementada
- [ ] Dashboard de estadísticas

### Fase 4
- [ ] Scripts de migración de datos
- [ ] Todos los datos mock migrados
- [ ] Validaciones de integridad pasadas

### Fase 5
- [ ] Código mock removido
- [ ] Optimizaciones implementadas
- [ ] Performance benchmarks

### Fase 6
- [ ] Suite de tests completa
- [ ] Documentación actualizada
- [ ] Sistema en producción

## Métricas de Éxito

- ✅ **100% de datos migrados** sin pérdida
- ✅ **0 downtime** durante la migración
- ✅ **95%+ cobertura de tests** en módulos críticos
- ✅ **<500ms tiempo de respuesta** en listados
- ✅ **100% funcionalidad** preservada post-migración

## Cronograma Estimado

| Fase | Duración | Fecha Inicio | Fecha Fin |
|------|----------|--------------|-----------|
| Fase 1 | 2 semanas | Semana 1 | Semana 2 |
| Fase 2 | 2 semanas | Semana 3 | Semana 4 |
| Fase 3 | 2 semanas | Semana 5 | Semana 6 |
| Fase 4 | 1 semana | Semana 7 | Semana 7 |
| Fase 5 | 1 semana | Semana 8 | Semana 8 |
| Fase 6 | 1 semana | Semana 9 | Semana 9 |

**Total estimado: 9 semanas**

---

*Este plan debe ser revisado y aprobado por el equipo técnico antes de su implementación. Se recomienda ejecutar cada fase de manera incremental con validaciones continuas.*