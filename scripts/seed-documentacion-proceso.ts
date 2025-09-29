import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const documentacionProcesoData = [
  {
    nombre: "Manual de Procedimientos de Acreditación",
    descripcion: "Documento principal que describe todos los procedimientos para el proceso de acreditación aeroportuaria",
    proceso: "Acreditación",
    categoria: "Manual Principal",
    version: "2.1",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Formulario de Solicitud de Acreditación",
    descripcion: "Formulario oficial para solicitar acreditación en aeropuertos",
    proceso: "Acreditación",
    categoria: "Formulario",
    version: "1.5",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Lista de Verificación de Documentos",
    descripcion: "Checklist de documentos requeridos para el proceso de acreditación",
    proceso: "Acreditación",
    categoria: "Lista de Verificación",
    version: "1.3",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Protocolo de Verificación de Antecedentes",
    descripcion: "Procedimientos para verificar los antecedentes de solicitantes",
    proceso: "Verificación",
    categoria: "Protocolo",
    version: "2.0",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Manual de Seguridad Aeroportuaria",
    descripcion: "Guía completa de procedimientos de seguridad en aeropuertos",
    proceso: "Seguridad",
    categoria: "Manual",
    version: "3.2",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Guía de Acceso a Áreas Restringidas",
    descripcion: "Procedimientos para otorgar y controlar acceso a áreas restringidas",
    proceso: "Control de Acceso",
    categoria: "Guía",
    version: "1.8",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Formato de Evaluación de Riesgos",
    descripcion: "Plantilla para evaluar riesgos en el proceso de acreditación",
    proceso: "Evaluación",
    categoria: "Formato",
    version: "1.2",
    obligatorio: false,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Procedimiento de Renovación de Acreditaciones",
    descripcion: "Pasos para renovar acreditaciones existentes",
    proceso: "Renovación",
    categoria: "Procedimiento",
    version: "1.4",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Manual de Capacitación para Personal",
    descripcion: "Guía de capacitación para personal involucrado en acreditaciones",
    proceso: "Capacitación",
    categoria: "Manual",
    version: "2.3",
    obligatorio: false,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Protocolo de Emergencias",
    descripcion: "Procedimientos de emergencia relacionados con acreditaciones",
    proceso: "Emergencias",
    categoria: "Protocolo",
    version: "1.6",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Guía de Auditoría Interna",
    descripcion: "Procedimientos para realizar auditorías internas del proceso",
    proceso: "Auditoría",
    categoria: "Guía",
    version: "1.1",
    obligatorio: false,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Matriz de Responsabilidades",
    descripcion: "Documento que define roles y responsabilidades en el proceso",
    proceso: "Gestión",
    categoria: "Matriz",
    version: "1.0",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Procedimiento de Apelaciones",
    descripcion: "Proceso para manejar apelaciones de decisiones de acreditación",
    proceso: "Apelaciones",
    categoria: "Procedimiento",
    version: "1.3",
    obligatorio: true,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Manual de Uso del Sistema",
    descripcion: "Guía para el uso del sistema de gestión de acreditaciones",
    proceso: "Sistema",
    categoria: "Manual",
    version: "2.0",
    obligatorio: false,
    estado: "ACTIVO" as const
  },
  {
    nombre: "Política de Protección de Datos",
    descripcion: "Políticas para el manejo y protección de datos personales",
    proceso: "Protección de Datos",
    categoria: "Política",
    version: "1.7",
    obligatorio: true,
    estado: "ACTIVO" as const
  }
];

async function seedDocumentacionProceso() {
  console.log('🌱 Iniciando seed de Documentación de Proceso...');

  try {
    // Limpiar datos existentes (opcional)
    await prisma.documentacionProceso.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Insertar nueva documentación
    for (const doc of documentacionProcesoData) {
      const created = await prisma.documentacionProceso.create({
        data: doc
      });
      console.log(`✅ Creado: ${created.nombre} - ${created.proceso}`);
    }

    console.log(`🎉 Seed completado: ${documentacionProcesoData.length} documentos creados`);

    // Mostrar estadísticas
    const stats = await prisma.documentacionProceso.groupBy({
      by: ['proceso'],
      _count: {
        proceso: true
      }
    });

    console.log('\n📊 Estadísticas por proceso:');
    stats.forEach(stat => {
      console.log(`   ${stat.proceso}: ${stat._count.proceso} documentos`);
    });

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedDocumentacionProceso();
  } catch (error) {
    console.error('💥 Error en main:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedDocumentacionProceso };