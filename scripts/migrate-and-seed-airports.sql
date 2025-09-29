-- Migration script to add missing fields to aeropuertos table
-- Run this script when database is accessible

-- Step 1: Add missing columns to aeropuertos table
ALTER TABLE "aeropuertos"
ADD COLUMN IF NOT EXISTS "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
ADD COLUMN IF NOT EXISTS "sierra1" TEXT,
ADD COLUMN IF NOT EXISTS "telefono" TEXT;

-- Step 2: Update existing records to have proper estado values
UPDATE "aeropuertos"
SET "estado" = CASE
    WHEN "activo" = true THEN 'ACTIVO'
    ELSE 'INACTIVO'
END
WHERE "estado" IS NULL OR "estado" = '';

-- Step 3: Insert initial airport data (if not already exists)
INSERT INTO "aeropuertos" (id, codigo, nombre, telefono, sierra1, estado, activo, "createdAt", "updatedAt")
VALUES
    ('MDSD', 'MDSD', 'Aeropuerto Internacional Las Américas', '809-947-2225', 'Coronel Juan Pérez', 'ACTIVO', true, NOW(), NOW()),
    ('MDPC', 'MDPC', 'Aeropuerto Internacional de Punta Cana', '809-668-4749', 'Teniente Coronel Ana Rodríguez', 'ACTIVO', true, NOW(), NOW()),
    ('MDCY', 'MDCY', 'Aeropuerto Internacional Presidente Juan Bosch', '809-338-5901', 'Mayor Carlos Sánchez', 'ACTIVO', true, NOW(), NOW()),
    ('MDLR', 'MDLR', 'Aeropuerto Internacional de La Romana', '809-813-9000', 'Capitán Luisa Gómez', 'INACTIVO', false, NOW(), NOW()),
    ('MDPP', 'MDPP', 'Aeropuerto Internacional Gregorio Luperón', '809-291-0000', 'Coronel Roberto Díaz', 'ACTIVO', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    telefono = EXCLUDED.telefono,
    sierra1 = EXCLUDED.sierra1,
    estado = EXCLUDED.estado,
    "updatedAt" = NOW();

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aeropuertos_estado ON "aeropuertos"(estado);
CREATE INDEX IF NOT EXISTS idx_aeropuertos_activo ON "aeropuertos"(activo);
CREATE INDEX IF NOT EXISTS idx_aeropuertos_codigo ON "aeropuertos"(codigo);

-- Verification query
SELECT
    id,
    codigo,
    nombre,
    telefono,
    sierra1,
    estado,
    activo,
    "createdAt",
    "updatedAt"
FROM "aeropuertos"
ORDER BY codigo;