// Script to seed basic airports data with current database schema
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const basicAirports = [
  {
    id: 'MDSD',
    codigo: 'MDSD',
    nombre: 'Aeropuerto Internacional Las Américas',
    activo: true
  },
  {
    id: 'MDPC',
    codigo: 'MDPC',
    nombre: 'Aeropuerto Internacional de Punta Cana',
    activo: true
  },
  {
    id: 'MDCY',
    codigo: 'MDCY',
    nombre: 'Aeropuerto Internacional Presidente Juan Bosch',
    activo: true
  },
  {
    id: 'MDLR',
    codigo: 'MDLR',
    nombre: 'Aeropuerto Internacional de La Romana',
    activo: false
  },
  {
    id: 'MDPP',
    codigo: 'MDPP',
    nombre: 'Aeropuerto Internacional Gregorio Luperón',
    activo: true
  },
];

async function seedBasicAirports() {
  console.log('🌱 Seeding basic airports (current schema)...');

  for (const airport of basicAirports) {
    try {
      const existing = await prisma.aeropuerto.findUnique({
        where: { id: airport.id }
      });

      if (!existing) {
        await prisma.aeropuerto.create({
          data: airport
        });
        console.log(`✅ Created airport: ${airport.codigo} - ${airport.nombre}`);
      } else {
        // Update existing airport
        await prisma.aeropuerto.update({
          where: { id: airport.id },
          data: {
            nombre: airport.nombre,
            activo: airport.activo
          }
        });
        console.log(`🔄 Updated airport: ${airport.codigo} - ${airport.nombre}`);
      }
    } catch (error) {
      console.error(`❌ Error handling airport ${airport.codigo}:`, error);
    }
  }

  console.log('🎉 Basic airport seeding completed!');
}

async function main() {
  try {
    await seedBasicAirports();
  } catch (error) {
    console.error('❌ Error seeding basic airports:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedBasicAirports };