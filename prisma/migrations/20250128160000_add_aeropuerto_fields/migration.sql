-- AlterTable
ALTER TABLE "aeropuertos" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
ADD COLUMN     "sierra1" TEXT,
ADD COLUMN     "telefono" TEXT;