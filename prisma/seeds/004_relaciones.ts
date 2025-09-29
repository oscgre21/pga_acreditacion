// prisma/seeds/004_relaciones.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedRelaciones() {
  console.log('🌱 Seeding relaciones usuario-app...')

  // Basado en appsConcedidas de usersData
  const usuarioApps = [
    // Administrador Cargos - tiene acceso a SGU, SCU, MA-CESAC
    { usuarioId: 1, appId: 'SGU' },
    { usuarioId: 1, appId: 'SCU' },
    { usuarioId: 1, appId: 'MA - CESAC' },

    // Administrador Registro Control - tiene acceso a múltiples sistemas
    { usuarioId: 2, appId: 'SGU' },
    { usuarioId: 2, appId: 'SCU' },
    { usuarioId: 2, appId: 'SDP' },
    { usuarioId: 2, appId: 'RRHH' },
    { usuarioId: 2, appId: 'SIARED' },

    // Alexandra Buret - solo SCU
    { usuarioId: 3, appId: 'SCU' },

    // Amalia Teresa Burgos - SGU, SGA-CESAC, MA-CESAC
    { usuarioId: 4, appId: 'SGU' },
    { usuarioId: 4, appId: 'SGA - CESAC' },
    { usuarioId: 4, appId: 'MA - CESAC' },

    // Amauris Joel Mercedes - SIARED
    { usuarioId: 5, appId: 'SIARED' },

    // Angelica Portoreal - SGU, SCU
    { usuarioId: 7, appId: 'SGU' },
    { usuarioId: 7, appId: 'SCU' },

    // Bianny Roa - SDP
    { usuarioId: 8, appId: 'SDP' },

    // Carolin Nuñez - SGU, SCU, SGAC
    { usuarioId: 10, appId: 'SGU' },
    { usuarioId: 10, appId: 'SCU' },
    { usuarioId: 10, appId: 'SGAC' },
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