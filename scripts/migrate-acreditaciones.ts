#!/usr/bin/env tsx

/**
 * Script de migración de datos mock de acreditaciones a la base de datos
 *
 * Este script toma los datos mock del módulo de acreditaciones y los migra
 * a la base de datos PostgreSQL usando Prisma.
 *
 * Uso:
 *   npx tsx scripts/migrate-acreditaciones.ts
 *
 * Autor: Kendy Qualey
 * Fecha: 2025-01-28
 */

import { PrismaClient } from '@prisma/client'

// Importar datos mock existentes
const recentTransactions = [
  {
    id: "12022",
    hasWarning: true,
    solicitante: "LONGPORT AVIATION SECURITY, S.R.L",
    para: "WILKENIA EDOUARD FILMONOR",
    asignadoA: "MDPP",
    categoria: "INSPECTOR DE SEGURIDAD PRIVADA DE LA AVIACIÓN CIVIL",
    proceso: "Certificación del personal de seguridad privada de la aviación civil",
    referencia: "40236591208",
    subproceso: "Recepción formulario de datos personales",
    ejecutores: [ "AMAURIS MERCEDES CASTILLO", "KENDY ALEJANDRO QUALEY TAVERAS", "MICHEL ALT. MARIANO QUEZADA" ],
    validadores: [ "ROBINSON ACOSTA PEÑA", "WASCAR BIENVENIDO CASTRO GARCIA", "YISSEL MARCIAL DE JESUS" ],
    ingreso: "01/08/2024 10:00 AM",
    vence: "02/08/2024 10:00 AM",
    progress: 75,
  },
  {
    id: "12023",
    hasWarning: false,
    solicitante: "SWISSPORT",
    para: "JUAN PEREZ",
    asignadoA: "MDST",
    categoria: "SUPERVISOR DE SEGURIDAD",
    proceso: "Renovación de carnet",
    referencia: "123456789",
    subproceso: "Entrega de documentos",
    ejecutores: ["MARIA RODRIGUEZ", "PEDRO GOMEZ"],
    validadores: ["ANA LOPEZ"],
    ingreso: "02/08/2024 11:30 AM",
    vence: "03/08/2024 11:30 AM",
    progress: 40,
  },
  {
    id: "12024",
    hasWarning: false,
    solicitante: "AERODOM",
    para: "CARLOS SANCHEZ",
    asignadoA: "MDLR",
    categoria: "OFICIAL DE SEGURIDAD",
    proceso: "Certificación inicial",
    referencia: "987654321",
    subproceso: "Toma de fotografía",
    ejecutores: ["LUISA FERNANDEZ", "JORGE MARTINEZ"],
    validadores: ["MIGUEL CASTRO"],
    ingreso: "03/08/2024 09:00 AM",
    vence: "04/08/2024 09:00 AM",
    progress: 90,
  },
  {
    id: "12025",
    hasWarning: true,
    solicitante: "Fauget Cafe",
    para: "CLAUDIA STORE",
    asignadoA: "MDCY",
    categoria: "ACCESSORIES",
    proceso: "Proceso de Certificación",
    referencia: "ID-2530",
    subproceso: "Recepción de formulario",
    ejecutores: ["CHIDI BARBER"],
    validadores: ["CAHAYA DEWI"],
    ingreso: "2024-06-26 10:00:00",
    vence: "2024-06-26 17:00:00",
    progress: 25,
  },
  {
    id: "12026",
    hasWarning: false,
    solicitante: "Servicios Aereos",
    para: "EMPRESA XYZ",
    asignadoA: "MDPP",
    categoria: "Transporte Carga",
    proceso: "Permiso de acceso a rampa",
    referencia: "789012345",
    subproceso: "Validación de seguridad",
    ejecutores: ["ROBERTO DIAZ", "SONIA PEREZ"],
    validadores: ["CARLOS MENDEZ"],
    ingreso: "05/08/2024 14:00 PM",
    vence: "06/08/2024 14:00 PM",
    progress: 60,
  },
]

// Datos estadísticos del dashboard
const statCards = [
  {
    title: "Concluidas",
    value: "1,637",
    icon: "CheckCheck",
    color: "bg-gradient-to-br from-green-500 to-emerald-500",
    textColor: "text-black",
  },
  {
    title: "En tiempo",
    value: "163",
    icon: "Clock",
    color: "bg-blue-400/80",
    textColor: "text-blue-900",
  },
  {
    title: "Atrasadas",
    value: "352",
    icon: "ArchiveX",
    color: "bg-red-500",
    textColor: "text-red-900",
  },
  {
    title: "Discrepancias",
    value: "136",
    icon: "Settings2",
    color: "bg-orange-400/80",
    textColor: "text-orange-900",
  },
  {
    title: "Total",
    value: "2,152",
    icon: "Layers",
    color: "bg-primary/80",
    textColor: "text-primary-foreground",
  },
]

const kpis = [
  {
    label: "Total de personal",
    value: "4,062",
    icon: "Users",
    trend: { "2024": "up", "2023": "up" },
  },
  {
    label: "Personal vigente",
    value: "3,721",
    icon: "UserCheck",
    trend: { "2024": "up", "2023": "down" },
    color: "text-green-500",
  },
  {
    label: "Personal vencido",
    value: "340",
    icon: "UserX",
    trend: { "2024": "down", "2023": "down" },
    color: "text-red-500",
  },
]

const aeropuertos = [
  { id: "mdsd", label: "MDSD" },
  { id: "mdst", label: "MDST" },
  { id: "mdpc", label: "MDPC" },
  { id: "mdbh", label: "MDBH" },
  { id: "mdcy", label: "MDCY" },
  { id: "mdjb", label: "MDJB" },
  { id: "mdlr", label: "MDLR" },
  { id: "mdab", label: "MDAB" },
  { id: "mdpp", label: "MDPP" },
]

const categoriaPersonal = [
  {id: 'supervisor', label: 'SUPERVISOR AVSEC'},
  {id: 'instructor', label: 'INSTRUCTOR AVSEC'},
  {id: 'gerente', label: 'GERENTE AVSEC'},
  {id: 'manejador_k9', label: 'MANEJADOR K-9'},
  {id: 'inspector_nacional', label: 'INSPECTOR NACIONAL AVSEC'},
  {id: 'inspector_cat', label: 'INSPECTOR AVSEC 1RA CAT'},
  {id: 'inspector_privada', label: 'INSPECTOR DE SEGURIDAD PRIVADA'},
]

const prisma = new PrismaClient()

// Utilitarios para conversión de datos
function parseDate(dateString: string): Date {
  // Manejar diferentes formatos de fecha
  try {
    // Formato ISO: "2024-06-26 10:00:00"
    if (dateString.includes('-') && dateString.includes(':')) {
      return new Date(dateString)
    }

    // Formato con texto: "Hoy 26-06-25" o "Lunes 26-06-25"
    if (dateString.toLowerCase().includes('hoy') || dateString.toLowerCase().includes('lunes')) {
      const today = new Date()
      // Extraer la hora si hay, si no usar 10:00 AM por defecto
      today.setHours(10, 0, 0, 0)
      return today
    }

    // Formato estándar: "01/08/2024 10:00 AM"
    const parts = dateString.split(' ')
    if (parts.length >= 2) {
      const [datePart, timePart, period] = parts
      const [day, month, year] = datePart.split('/')

      if (timePart && timePart.includes(':')) {
        const [hour, minute] = timePart.split(':')

        let hour24 = parseInt(hour)
        if (period === 'PM' && hour24 !== 12) {
          hour24 += 12
        } else if (period === 'AM' && hour24 === 12) {
          hour24 = 0
        }

        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minute || '0'))
      }
    }

    // Fallback: intentar parsear directamente
    return new Date(dateString)
  } catch (error) {
    console.warn(`Error parseando fecha "${dateString}", usando fecha actual:`, error)
    return new Date()
  }
}

function mapEstado(progress: number): string {
  if (progress === 100) return 'COMPLETADO'
  if (progress >= 50) return 'EN_PROCESO'
  if (progress > 0) return 'PENDIENTE'
  return 'PENDIENTE'
}

function mapEstadoAcreditacion(progress: number): string {
  if (progress === 100) return 'APROBADO'
  if (progress >= 90) return 'VALIDACION_FINAL'
  if (progress >= 50) return 'EN_PROCESO'
  if (progress >= 25) return 'EN_REVISION'
  if (progress > 0) return 'PENDIENTE'
  return 'PENDIENTE'
}

function mapEstadoDiscrepancia(hasWarning: boolean): string {
  return hasWarning ? 'EN_REVISION' : 'PENDIENTE'
}

async function cleanDatabase() {
  console.log('🧹 Limpiando datos existentes...')

  try {
    // Eliminar en orden para respetar foreign keys
    await prisma.documentoAcreditacion.deleteMany()
    await prisma.actividadAcreditacion.deleteMany()
    await prisma.acreditacion.deleteMany()
    await prisma.categoriaPersonal.deleteMany()
    await prisma.servicioSeguridad.deleteMany()
    await prisma.aeropuerto.deleteMany()

    console.log('✅ Base de datos limpia')
  } catch (error) {
    console.warn('⚠️ Error al limpiar base de datos (esto es normal si las tablas no existen):', error.message)
  }
}

async function seedAeropuertos() {
  console.log('✈️ Creando aeropuertos...')

  for (const aeropuerto of aeropuertos) {
    await prisma.aeropuerto.upsert({
      where: { codigo: aeropuerto.id.toUpperCase() },
      update: {},
      create: {
        id: aeropuerto.id.toUpperCase(),
        codigo: aeropuerto.id.toUpperCase(),
        nombre: `Aeropuerto ${aeropuerto.label}`,
        activo: true
      }
    })
  }

  console.log(`✅ ${aeropuertos.length} aeropuertos creados`)
}

async function seedCategoriasPersonal() {
  console.log('👥 Creando categorías de personal...')

  for (const categoria of categoriaPersonal) {
    await prisma.categoriaPersonal.upsert({
      where: { codigo: categoria.id },
      update: {},
      create: {
        id: categoria.id,
        codigo: categoria.id,
        nombre: categoria.label,
        descripcion: `Categoría: ${categoria.label}`,
        activa: true
      }
    })
  }

  console.log(`✅ ${categoriaPersonal.length} categorías de personal creadas`)
}

async function seedAcreditaciones() {
  console.log('📋 Migrando acreditaciones...')

  for (const tramite of recentTransactions) {
    try {
      // Crear la acreditación principal
      const nuevaAcreditacion = await prisma.acreditacion.create({
        data: {
          numero: tramite.id,
          solicitante: tramite.solicitante,
          personal: tramite.para,
          aeropuertoId: tramite.asignadoA.toUpperCase(),
          categoria: tramite.categoria,
          proceso: tramite.proceso,
          subproceso: tramite.subproceso,
          referencia: tramite.referencia,
          estado: mapEstadoAcreditacion(tramite.progress) as any,
          progreso: tramite.progress,
          hasWarning: tramite.hasWarning,
          fechaIngreso: parseDate(tramite.ingreso),
          fechaVencimiento: parseDate(tramite.vence),
          ejecutores: tramite.ejecutores,
          validadores: tramite.validadores,
          observaciones: tramite.hasWarning ? `Requiere atención especial - Progreso: ${tramite.progress}%` : null
        }
      })

      // Crear actividades básicas para cada acreditación
      const actividadesBase = [
        { nombre: 'Recepción de documentos', orden: 1, estado: 'COMPLETADA' },
        { nombre: 'Revisión técnica', orden: 2, estado: tramite.progress >= 50 ? 'COMPLETADA' : 'PENDIENTE' },
        { nombre: 'Validación final', orden: 3, estado: tramite.progress >= 90 ? 'COMPLETADA' : 'PENDIENTE' },
        { nombre: 'Emisión de certificado', orden: 4, estado: tramite.progress === 100 ? 'COMPLETADA' : 'PENDIENTE' }
      ]

      for (const actividad of actividadesBase) {
        await prisma.actividadAcreditacion.create({
          data: {
            acreditacionId: nuevaAcreditacion.id,
            nombre: actividad.nombre,
            descripcion: `${actividad.nombre} para acreditación ${tramite.id}`,
            estado: actividad.estado as any,
            orden: actividad.orden,
            fechaInicio: actividad.estado === 'COMPLETADA' ? parseDate(tramite.ingreso) : null,
            fechaFin: actividad.estado === 'COMPLETADA' ? parseDate(tramite.ingreso) : null,
            responsable: tramite.ejecutores[0] || 'Sistema'
          }
        })
      }

      // Crear documentos base requeridos
      const documentosBase = [
        { nombre: 'Identificación oficial', obligatorio: true },
        { nombre: 'Certificado médico', obligatorio: true },
        { nombre: 'Antecedentes penales', obligatorio: true }
      ]

      for (const doc of documentosBase) {
        await prisma.documentoAcreditacion.create({
          data: {
            acreditacionId: nuevaAcreditacion.id,
            nombre: doc.nombre,
            descripcion: `${doc.nombre} requerido para la acreditación`,
            obligatorio: doc.obligatorio,
            subido: tramite.progress >= 25, // Simular que algunos documentos ya fueron subidos
            validado: tramite.progress >= 50,
            fechaSubida: tramite.progress >= 25 ? parseDate(tramite.ingreso) : null,
            fechaValidacion: tramite.progress >= 50 ? parseDate(tramite.ingreso) : null,
            validadoPor: tramite.progress >= 50 ? tramite.validadores[0] : null
          }
        })
      }

      console.log(`   ✓ Acreditación ${tramite.id} migrada con ${actividadesBase.length} actividades y ${documentosBase.length} documentos`)
    } catch (error) {
      console.error(`   ✗ Error migrando acreditación ${tramite.id}:`, error)
    }
  }

  console.log(`✅ ${recentTransactions.length} acreditaciones migradas`)
}

async function generateEstadisticas() {
  console.log('📊 Generando datos estadísticos...')

  try {
    // Contar acreditaciones por estado
    const estadisticas = await prisma.acreditacion.groupBy({
      by: ['estado'],
      _count: {
        id: true
      }
    })

    console.log('📈 Estadísticas generadas:')
    estadisticas.forEach(stat => {
      console.log(`   ${stat.estado}: ${stat._count.id} acreditaciones`)
    })

    // Contar acreditaciones con discrepancias
    const discrepancias = await prisma.acreditacion.count({
      where: { hasWarning: true }
    })
    console.log(`   Con discrepancias: ${discrepancias}`)

    // Contar por aeropuerto
    const porAeropuerto = await prisma.acreditacion.groupBy({
      by: ['aeropuertoId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    console.log('📍 Por aeropuerto:')
    porAeropuerto.forEach(stat => {
      console.log(`   ${stat.aeropuertoId}: ${stat._count.id} acreditaciones`)
    })

  } catch (error) {
    console.warn('⚠️ Error generando estadísticas:', error.message)
  }
}

async function verifyMigration() {
  console.log('🔍 Verificando migración...')

  try {
    const totalAcreditaciones = await prisma.acreditacion.count()
    const totalAeropuertos = await prisma.aeropuerto.count()
    const totalCategorias = await prisma.categoriaPersonal.count()
    const totalActividades = await prisma.actividadAcreditacion.count()
    const totalDocumentos = await prisma.documentoAcreditacion.count()

    console.log('📊 Resumen de migración:')
    console.log(`   Acreditaciones: ${totalAcreditaciones}`)
    console.log(`   Aeropuertos: ${totalAeropuertos}`)
    console.log(`   Categorías personal: ${totalCategorias}`)
    console.log(`   Actividades: ${totalActividades}`)
    console.log(`   Documentos: ${totalDocumentos}`)

    if (totalAcreditaciones !== recentTransactions.length) {
      console.warn(`⚠️ Advertencia: Se esperaban ${recentTransactions.length} acreditaciones, pero se encontraron ${totalAcreditaciones}`)
    } else {
      console.log('✅ Migración verificada exitosamente')
    }

    // Verificar integridad referencial
    const acreditacionesSinAeropuerto = await prisma.acreditacion.count({
      where: {
        aeropuerto: null
      }
    })

    if (acreditacionesSinAeropuerto > 0) {
      console.warn(`⚠️ ${acreditacionesSinAeropuerto} acreditaciones sin aeropuerto asignado`)
    }

  } catch (error) {
    console.error('❌ Error verificando migración:', error.message)
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando migración de datos de acreditaciones...')
    console.log('===================================================')

    // Ejecutar migración paso a paso
    await cleanDatabase()
    await seedAeropuertos()
    await seedCategoriasPersonal()
    await seedAcreditaciones()
    await generateEstadisticas()
    await verifyMigration()

    console.log('')
    console.log('🎉 ¡Migración completada exitosamente!')
    console.log('===================================================')
    console.log('')
    console.log('Próximos pasos:')
    console.log('1. Verificar datos en Prisma Studio: npx prisma studio')
    console.log('2. Ejecutar tests: pnpm test')
    console.log('3. Actualizar componentes para usar datos de BD')
    console.log('')

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  main()
}

export { main as migrateAcreditaciones }