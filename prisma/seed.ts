// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { seedUsuarios } from './seeds/001_usuarios'
import { seedApps } from './seeds/002_apps'
import { seedDetallesTecnicos } from './seeds/003_detalles_tecnicos'
import { seedRelaciones } from './seeds/004_relaciones'
import { seedNotificaciones } from './seeds/005_notificaciones'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seeding...')

  try {
    await seedUsuarios()
    await seedApps()
    await seedDetallesTecnicos()
    await seedRelaciones()
    await seedNotificaciones()

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