// Script to seed initial airports data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialAirports = [
  {
    id: 'MDSD',
    codigo: 'MDSD',
    nombre: 'Aeropuerto Internacional Las Américas',
    telefono: '809-947-2225',
    sierra1: 'Coronel Juan Pérez',
    estado: 'ACTIVO',
    activo: true
  },
  {
    id: 'MDPC',
    codigo: 'MDPC',
    nombre: 'Aeropuerto Internacional de Punta Cana',
    telefono: '809-668-4749',
    sierra1: 'Teniente Coronel Ana Rodríguez',
    estado: 'ACTIVO',
    activo: true
  },
  {
    id: 'MDCY',
    codigo: 'MDCY',
    nombre: 'Aeropuerto Internacional Presidente Juan Bosch',
    telefono: '809-338-5901',
    sierra1: 'Mayor Carlos Sánchez',
    estado: 'ACTIVO',
    activo: true
  },
  {
    id: 'MDLR',
    codigo: 'MDLR',
    nombre: 'Aeropuerto Internacional de La Romana',
    telefono: '809-813-9000',
    sierra1: 'Capitán Luisa Gómez',
    estado: 'INACTIVO',
    activo: false
  },
  {
    id: 'MDPP',
    codigo: 'MDPP',
    nombre: 'Aeropuerto Internacional Gregorio Luperón',
    telefono: '809-291-0000',
    sierra1: 'Coronel Roberto Díaz',
    estado: 'ACTIVO',
    activo: true
  },
];

async function seedAirports() {
  console.log('🌱 Seeding airports...');

  for (const airport of initialAirports) {
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
        console.log(`⏭️  Airport already exists: ${airport.codigo} - ${airport.nombre}`);
      }
    } catch (error) {
      console.error(`❌ Error creating airport ${airport.codigo}:`, error);
    }
  }

  console.log('🎉 Airport seeding completed!');
}

async function main() {
  try {
    await seedAirports();
  } catch (error) {
    console.error('❌ Error seeding airports:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedAirports };