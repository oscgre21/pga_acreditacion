import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTramites() {
  try {
    console.log('🌱 Seeding trámites...');

    // Primero verificamos si ya existen trámites
    const existingTramites = await prisma.tramite.count();
    if (existingTramites > 0) {
      console.log('✅ Los trámites ya existen en la base de datos');
      return;
    }

    const tramitesData = [
      {
        id: "12022",
        numero: "TR-12022",
        solicitante: "LONGPORT AVIATION SECURITY, S.R.L",
        personal: "WILKENIA EDOUARD FILMONOR",
        tipo: "Certificación del personal de seguridad privada de la aviación civil",
        estado: "EN_PROCESO",
      },
      {
        id: "E-73482",
        numero: "TR-E-73482",
        solicitante: "Sample Company",
        personal: null,
        tipo: "Certificación de Seguridad para Carga",
        estado: "PENDIENTE",
      },
      {
        id: "E-58291",
        numero: "TR-E-58291",
        solicitante: "Sample Airline",
        personal: null,
        tipo: "Aprobación Programa de Seguridad de Aerolínea",
        estado: "EN_PROCESO",
      },
      {
        id: "P-12345",
        numero: "TR-P-12345",
        solicitante: "Security Services Inc.",
        personal: null,
        tipo: "Certificación del personal de seguridad privada de la aviación civil",
        estado: "PENDIENTE",
      },
      {
        id: "P-23456",
        numero: "TR-P-23456",
        solicitante: "CESAC Internal",
        personal: null,
        tipo: "Re-Certificación del personal AVSEC del CESAC",
        estado: "COMPLETADO",
      },
      {
        id: "P-34567",
        numero: "TR-P-34567",
        solicitante: "Security Services Inc.",
        personal: null,
        tipo: "Re-impresión de licencia por cambio de compañía",
        estado: "EN_PROCESO",
      },
      {
        id: "P-45678",
        numero: "TR-P-45678",
        solicitante: "CESAC Internal",
        personal: null,
        tipo: "Certificación del personal AVSEC del CESAC",
        estado: "PENDIENTE",
      },
      {
        id: "P-56789",
        numero: "TR-P-56789",
        solicitante: "Security Services Inc.",
        personal: null,
        tipo: "Re-impresión de licencia por perdida o robo (Seguridad Privada)",
        estado: "COMPLETADO",
      },
      {
        id: "P-67890",
        numero: "TR-P-67890",
        solicitante: "Security Services Inc.",
        personal: null,
        tipo: "Re-impresión de licencia por deterioro (Seguridad Privada)",
        estado: "EN_PROCESO",
      },
      {
        id: "P-78901",
        numero: "TR-P-78901",
        solicitante: "CESAC Internal",
        personal: null,
        tipo: "Re-impresión de licencia por perdida o robo (AVSEC)",
        estado: "PENDIENTE",
      }
    ];

    for (const tramiteData of tramitesData) {
      await prisma.tramite.create({
        data: {
          ...tramiteData,
          estado: tramiteData.estado as any, // Cast to enum type
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        }
      });
    }

    console.log(`✅ Se crearon ${tramitesData.length} trámites exitosamente`);

  } catch (error) {
    console.error('❌ Error seeding trámites:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si es llamado directamente
if (require.main === module) {
  seedTramites();
}

export { seedTramites };