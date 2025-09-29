// prisma/seeds/005_notificaciones.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    {
      usuarioId: 1,
      titulo: 'Actualización de Sistema',
      descripcion: 'El sistema SGU será actualizado el próximo viernes de 2:00 AM a 4:00 AM.',
      leida: true,
      href: null,
    },
    {
      usuarioId: 2,
      titulo: 'Nueva Solicitud de Acceso',
      descripcion: 'El usuario "j.martinez" ha solicitado acceso al sistema SDP.',
      leida: false,
      href: '/dashboard/perfiles-pga/usuarios',
    },
    {
      usuarioId: 2,
      titulo: 'Auditoría Programada',
      descripcion: 'Se ha programado una auditoría para el sistema RRHH el 15 de agosto.',
      leida: true,
      href: '/dashboard/perfiles-pga',
    },
    {
      usuarioId: 4,
      titulo: 'Acceso Renovado',
      descripcion: 'Su acceso al sistema SGA-CESAC ha sido renovado por 6 meses más.',
      leida: false,
      href: null,
    },
    {
      usuarioId: 4,
      titulo: 'Cambio de Contraseña',
      descripcion: 'Recuerde cambiar su contraseña cada 90 días por seguridad.',
      leida: true,
      href: '/cliente/configuracion',
    },
    {
      usuarioId: 7,
      titulo: 'Nuevo Módulo Disponible',
      descripcion: 'El módulo de reportes avanzados ya está disponible en SGU.',
      leida: false,
      href: '/dashboard/perfiles-pga',
    },
    {
      usuarioId: 10,
      titulo: 'Correspondencia Pendiente',
      descripcion: 'Tiene 3 documentos pendientes de revisar en SGAC.',
      leida: false,
      href: null,
    },
    {
      usuarioId: 10,
      titulo: 'Capacitación Programada',
      descripcion: 'Se ha programado una capacitación sobre el nuevo sistema el 20 de agosto.',
      leida: true,
      href: null,
    },
  ]

  for (const notificacion of notificaciones) {
    await prisma.notificacion.create({
      data: notificacion,
    })
  }

  console.log('✅ Notificaciones seeded successfully')
}