# Airport Module Migration Guide

## Overview

The airport module has been updated to work with the current database schema and is ready for migration when the database becomes accessible.

## Current Implementation

### Working with Current Database Schema
The current implementation works with the existing `aeropuertos` table that has:
- `id` (String, primary key)
- `codigo` (String, unique)
- `nombre` (String)
- `activo` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Features Available Now
- ✅ List airports with search functionality
- ✅ Create new airports (code and name only)
- ✅ Edit existing airports
- ✅ Delete airports (soft delete using `activo` flag)
- ✅ Full CRUD API endpoints
- ✅ Loading states and error handling

## Future Migration

### Additional Fields to be Added
When the database is accessible, run the migration to add:
- `telefono` (String, nullable) - Phone number
- `sierra1` (String, nullable) - Security chief name
- `estado` (String, default 'ACTIVO') - Status field for BaseEntity compliance

### Migration Steps

1. **Run Database Migration**
   ```bash
   # Apply Prisma migration
   npx prisma migrate deploy

   # Or run SQL script manually
   psql -h [host] -U [user] -d [database] -f scripts/migrate-and-seed-airports.sql
   ```

2. **Update Prisma Schema and Regenerate Client**

   First, update the Prisma schema to include the new fields:
   ```typescript
   // In prisma/schema.prisma
   model Aeropuerto {
     id                    String    @id
     codigo                String    @unique
     nombre                String
     telefono              String?
     sierra1               String?
     estado                String    @default("ACTIVO") // ACTIVO, INACTIVO
     activo                Boolean   @default(true)
     createdAt             DateTime  @default(now())
     updatedAt             DateTime  @updatedAt

     // Relaciones
     acreditaciones        Acreditacion[]

     @@map("aeropuertos")
   }
   ```

   Then regenerate the Prisma client:
   ```bash
   npx prisma generate
   ```

3. **Update Code After Migration**

   After the migration is complete, update the following files:

   **a) Update Entity Interface** (`src/lib/repositories/aeropuerto.repository.ts`):
   ```typescript
   export interface AeropuertoEntity extends BaseEntity {
     codigo: string;
     nombre: string;
     telefono: string | null;
     sierra1: string | null;
     activo: boolean;
   }
   ```

   **b) Update Repository** (extend BaseRepository again):
   ```typescript
   export class AeropuertoRepository extends BaseRepository<AeropuertoEntity> {
     protected modelName = 'aeropuerto';
     // ... rest of implementation
   }
   ```

   **c) Update Form Schema** (`src/app/dashboard/mantenimiento/aeropuertos/page.tsx`):
   ```typescript
   const airportFormSchema = z.object({
     codigo: z.string().min(1).length(4),
     nombre: z.string().min(1),
     telefono: z.string().optional().nullable(),
     sierra1: z.string().optional().nullable(),
     estado: z.enum(["ACTIVO", "INACTIVO"]),
     activo: z.boolean().default(true),
   });
   ```

   **d) Update List Page** (add telefono, sierra1 columns back)

3. **Test After Migration**
   ```bash
   # Run type checking
   pnpm typecheck

   # Test the application
   pnpm dev
   ```

## File Structure

```
src/
├── app/
│   ├── api/aeropuertos/
│   │   ├── route.ts                    # GET, POST, DELETE
│   │   └── [id]/route.ts              # GET, PUT, DELETE
│   └── dashboard/mantenimiento/aeropuertos/
│       ├── page.tsx                   # Form page (create/edit)
│       └── list/page.tsx              # List page with search
├── lib/
│   ├── repositories/
│   │   └── aeropuerto.repository.ts   # Database operations
│   └── services/
│       └── aeropuerto.service.ts      # Business logic
scripts/
├── migrate-and-seed-airports.sql     # SQL migration script
└── seed-airports.ts                  # TypeScript seeding script
prisma/
├── schema.prisma                     # Updated schema (ready for migration)
└── migrations/
    └── 20250128160000_add_aeropuerto_fields/
        └── migration.sql             # Prisma migration file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/aeropuertos` | List airports (supports search and includeInactive) |
| POST | `/api/aeropuertos` | Create new airport |
| DELETE | `/api/aeropuertos?id={id}` | Delete airport (soft delete) |
| GET | `/api/aeropuertos/{id}` | Get airport by ID |
| PUT | `/api/aeropuertos/{id}` | Update airport |

## Testing

### Current Testing (before migration)
- Test with basic fields (codigo, nombre, activo)
- Verify search functionality works
- Test CRUD operations

### Post-Migration Testing
- Test with all fields including telefono and sierra1
- Verify estado field filtering works correctly
- Test data migration integrity

## Notes

- The current implementation is fully functional with the existing database schema
- No data loss will occur during migration
- The migration is designed to be reversible if needed
- All mock data has been replaced with proper database integration