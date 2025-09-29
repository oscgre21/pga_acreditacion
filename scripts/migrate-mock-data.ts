import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Datos mock extraídos de los archivos
const companiesData = [
  {
    abreviatura: "LAPS",
    nombre: "LONGPORT AVIATION SECURITY, S.R.L",
    rnc: "130-12345-6",
    representante: "John Doe",
    telefono: "809-555-1234",
    isWhatsapp: true,
    whatsapp: null,
    correo: "contacto@laps.com",
    estado: "ACTIVO" as const,
    direccion: "Av. 27 de Febrero, Santo Domingo",
    notas: "Compañía de seguridad aeroportuaria.",
  },
  {
    abreviatura: "SWISS",
    nombre: "SWISSPORT",
    rnc: "130-65432-1",
    representante: "Jane Smith",
    telefono: "809-555-5678",
    isWhatsapp: false,
    whatsapp: "829-111-2222",
    correo: "info@swissport.com",
    estado: "ACTIVO" as const,
    direccion: "Aeropuerto Internacional Las Américas",
    notas: "Servicios de tierra.",
  },
  {
    abreviatura: "AERODOM",
    nombre: "AERODOM",
    rnc: "130-78901-2",
    representante: "Carlos Rodriguez",
    telefono: "809-555-9012",
    isWhatsapp: true,
    whatsapp: null,
    correo: "info@aerodom.com",
    estado: "INACTIVO" as const,
    direccion: "Oficinas Corporativas, Santo Domingo",
    notas: "Operador de aeropuertos.",
  },
  {
    abreviatura: "FAUGET",
    nombre: "Fauget Cafe",
    rnc: "130-23456-7",
    representante: "Claudia Store",
    telefono: "809-555-3456",
    isWhatsapp: false,
    whatsapp: "809-555-3456",
    correo: "admin@fauget.com",
    estado: "ACTIVO" as const,
    direccion: "Local 3A, Salidas Internacionales",
    notas: "Cafetería y snacks.",
  },
  {
    abreviatura: "SERVAIR",
    nombre: "Servicios Aereos",
    rnc: "130-87654-3",
    representante: "Roberto Diaz",
    telefono: "809-555-7890",
    isWhatsapp: true,
    whatsapp: null,
    correo: "operaciones@servair.do",
    estado: "ACTIVO" as const,
    direccion: "Área de Carga, AILA",
    notas: "Catering aéreo.",
  },
];

const categoriesData = [
  { nombre: "EMPRESAS DE APROVISIONAMIENTO Y SUMINISTRO", estado: "ACTIVO" as const },
  { nombre: "ARRENDATARIOS EN AEROPUERTO", estado: "ACTIVO" as const },
  { nombre: "EMPRESA MANEJADORAS DE CORREO", estado: "ACTIVO" as const },
  { nombre: "PROVEEDORES DE SERVICIOS DE CARGA AÉREA", estado: "ACTIVO" as const },
  { nombre: "PROVEEDORES DE SERVICIOS EN AEROPUERTO", estado: "INACTIVO" as const },
  { nombre: "PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD", estado: "ACTIVO" as const },
  { nombre: "PROGRAMA DE SEGURIDAD DE EXPLOTADORES DE AERONAVES", estado: "ACTIVO" as const },
  { nombre: "PROGRAMA DE SEGURIDAD DE CONSIGNATARIOS DE AERONAVES", estado: "ACTIVO" as const },
];

const dependenciasData = [
  { nombre: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN', estado: "ACTIVO" as const },
  { nombre: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN', estado: "ACTIVO" as const },
  { nombre: 'DEPARTAMENTO DE TESORERIA', estado: "ACTIVO" as const },
  { nombre: 'Escuela de Seguridad de la Aviación Civil (ESAC)', estado: "ACTIVO" as const },
  { nombre: 'DIRECCIÓN DE ASUNTOS INTERNOS', estado: "ACTIVO" as const },
];

const equiposSeguridadData = [
  { nombre: "Cámaras", descripcion: "Sistemas de videovigilancia", estado: "ACTIVO" as const },
  { nombre: "Escáner", descripcion: "Equipos de escaneo de seguridad", estado: "ACTIVO" as const },
  { nombre: "Máquina de Rayos X", descripcion: "Detectores de rayos X para equipaje", estado: "ACTIVO" as const },
  { nombre: "Detector de Metal Portátil", descripcion: "Detectores manuales de metal", estado: "ACTIVO" as const },
  { nombre: "Arco Detector de Metal", descripcion: "Puertas detectoras de metal", estado: "ACTIVO" as const },
  { nombre: "MMTD", descripcion: "Millimeter Wave Technology Detector", estado: "ACTIVO" as const },
];

const tiposDocumentoData = [
  { nombre: "Cédula de Identidad", descripcion: "Documento de identificación personal", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "RNC", descripcion: "Registro Nacional del Contribuyente", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "Certificación Cámara de Comercio", descripcion: "Certificado de la Cámara de Comercio", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "Carnet de Identificación Aeroportuario", descripcion: "Identificación para acceso aeroportuario", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "Evaluación Médica", descripcion: "Certificado médico vigente", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "Certificado de Antecedentes", descripcion: "Certificado de antecedentes penales", obligatorio: true, estado: "ACTIVO" as const },
  { nombre: "Foto 2x2", descripcion: "Fotografía tamaño carnet", obligatorio: false, estado: "ACTIVO" as const },
];

async function migrateCompanies() {
  console.log('🏢 Migrando compañías...');

  let createdCount = 0;
  for (const company of companiesData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.compania.findFirst({
        where: { rnc: company.rnc }
      });

      if (!existing) {
        await prisma.compania.create({
          data: company
        });
        createdCount++;
      } else {
        console.log(`  - Compañía ${company.nombre} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando compañía ${company.nombre}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} compañías migradas`);
}

async function migrateCategories() {
  console.log('🏷️ Migrando categorías...');

  let createdCount = 0;
  for (const category of categoriesData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.categoria.findFirst({
        where: { nombre: category.nombre }
      });

      if (!existing) {
        await prisma.categoria.create({
          data: category
        });
        createdCount++;
      } else {
        console.log(`  - Categoría ${category.nombre} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando categoría ${category.nombre}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} categorías migradas`);
}

async function migrateDependencias() {
  console.log('🏛️ Migrando dependencias...');

  let createdCount = 0;
  for (const dependencia of dependenciasData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.dependencia.findFirst({
        where: { nombre: dependencia.nombre }
      });

      if (!existing) {
        await prisma.dependencia.create({
          data: dependencia
        });
        createdCount++;
      } else {
        console.log(`  - Dependencia ${dependencia.nombre} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando dependencia ${dependencia.nombre}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} dependencias migradas`);
}

async function migrateEquiposSeguridad() {
  console.log('🔧 Migrando equipos de seguridad...');

  let createdCount = 0;
  for (const equipo of equiposSeguridadData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.equipoSeguridad.findFirst({
        where: { nombre: equipo.nombre }
      });

      if (!existing) {
        await prisma.equipoSeguridad.create({
          data: equipo
        });
        createdCount++;
      } else {
        console.log(`  - Equipo ${equipo.nombre} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando equipo ${equipo.nombre}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} equipos de seguridad migrados`);
}

async function migrateTiposDocumento() {
  console.log('📄 Migrando tipos de documento...');

  let createdCount = 0;
  for (const tipo of tiposDocumentoData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.tipoDocumento.findFirst({
        where: { nombre: tipo.nombre }
      });

      if (!existing) {
        await prisma.tipoDocumento.create({
          data: tipo
        });
        createdCount++;
      } else {
        console.log(`  - Tipo de documento ${tipo.nombre} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando tipo de documento ${tipo.nombre}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} tipos de documento migrados`);
}

async function migrateValidadores() {
  console.log('👤 Migrando validadores...');

  // Obtener una dependencia para asignar
  const dependencia = await prisma.dependencia.findFirst();

  if (!dependencia) {
    console.log('  ⚠️ No hay dependencias disponibles, saltando validadores...');
    return;
  }

  const validadoresData = [
    {
      nombre: 'Juan',
      apellido: 'Pérez',
      rango: 'Coronel',
      dependenciaId: dependencia.id,
      sede: 'Sede Principal',
      fechaAsignacion: new Date('2024-01-15'),
      asignadoPor: 'General D. Ramirez',
      estado: 'ACTIVO' as const
    },
    {
      nombre: 'María',
      apellido: 'García',
      rango: 'Mayor',
      dependenciaId: dependencia.id,
      sede: 'MDSD',
      fechaAsignacion: new Date('2024-02-01'),
      asignadoPor: 'Coronel J. Pérez',
      estado: 'ACTIVO' as const
    },
    {
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      rango: 'Capitán',
      dependenciaId: dependencia.id,
      sede: 'MDPC',
      fechaAsignacion: new Date('2024-03-10'),
      asignadoPor: 'General D. Ramirez',
      estado: 'ACTIVO' as const
    }
  ];

  let createdCount = 0;
  for (const validador of validadoresData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.validador.findFirst({
        where: {
          nombre: validador.nombre,
          apellido: validador.apellido
        }
      });

      if (!existing) {
        await prisma.validador.create({
          data: validador
        });
        createdCount++;
      } else {
        console.log(`  - Validador ${validador.nombre} ${validador.apellido} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando validador ${validador.nombre} ${validador.apellido}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} validadores migrados`);
}

async function migrateEjecutores() {
  console.log('👷 Migrando ejecutores...');

  // Obtener una dependencia para asignar
  const dependencia = await prisma.dependencia.findFirst();

  if (!dependencia) {
    console.log('  ⚠️ No hay dependencias disponibles, saltando ejecutores...');
    return;
  }

  const ejecutoresData = [
    {
      nombre: 'Ana',
      apellido: 'Martínez',
      rango: 'Teniente',
      dependenciaId: dependencia.id,
      sede: 'Sede Principal',
      fechaAsignacion: new Date('2024-01-20'),
      asignadoPor: 'Mayor M. García',
      estado: 'ACTIVO' as const
    },
    {
      nombre: 'Luis',
      apellido: 'Fernández',
      rango: 'Sargento',
      dependenciaId: dependencia.id,
      sede: 'MDSD',
      fechaAsignacion: new Date('2024-02-15'),
      asignadoPor: 'Capitán C. Rodríguez',
      estado: 'ACTIVO' as const
    }
  ];

  let createdCount = 0;
  for (const ejecutor of ejecutoresData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.ejecutor.findFirst({
        where: {
          nombre: ejecutor.nombre,
          apellido: ejecutor.apellido
        }
      });

      if (!existing) {
        await prisma.ejecutor.create({
          data: ejecutor
        });
        createdCount++;
      } else {
        console.log(`  - Ejecutor ${ejecutor.nombre} ${ejecutor.apellido} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando ejecutor ${ejecutor.nombre} ${ejecutor.apellido}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} ejecutores migrados`);
}

async function migratePersonasEspecificas() {
  console.log('👨‍💼 Migrando personas específicas...');

  // Obtener una compañía para asignar
  const compania = await prisma.compania.findFirst();

  const personasData = [
    {
      nombre: 'Roberto',
      apellido: 'Silva',
      cedula: '001-1234567-8',
      companiaId: compania?.id || null,
      funcion: 'Supervisor de Seguridad',
      telefono: '809-123-4567',
      correo: 'roberto.silva@example.com',
      estado: 'ACTIVO' as const
    },
    {
      nombre: 'Carmen',
      apellido: 'López',
      cedula: '001-2345678-9',
      companiaId: compania?.id || null,
      funcion: 'Coordinadora de Operaciones',
      telefono: '809-234-5678',
      correo: 'carmen.lopez@example.com',
      estado: 'ACTIVO' as const
    }
  ];

  let createdCount = 0;
  for (const persona of personasData) {
    try {
      // Verificar si ya existe
      const existing = await prisma.personaEspecifica.findFirst({
        where: { cedula: persona.cedula }
      });

      if (!existing) {
        await prisma.personaEspecifica.create({
          data: persona
        });
        createdCount++;
      } else {
        console.log(`  - Persona ${persona.nombre} ${persona.apellido} ya existe, saltando...`);
      }
    } catch (error) {
      console.error(`  ❌ Error migrando persona ${persona.nombre} ${persona.apellido}:`, error);
    }
  }

  console.log(`  ✅ ${createdCount} personas específicas migradas`);
}

async function verifyMigration() {
  console.log('\n📊 Verificando migración...');

  const counts = {
    companias: await prisma.compania.count(),
    categorias: await prisma.categoria.count(),
    dependencias: await prisma.dependencia.count(),
    equiposSeguridad: await prisma.equipoSeguridad.count(),
    tiposDocumento: await prisma.tipoDocumento.count(),
    validadores: await prisma.validador.count(),
    ejecutores: await prisma.ejecutor.count(),
    personasEspecificas: await prisma.personaEspecifica.count(),
  };

  console.table(counts);

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  console.log(`\n🎯 Total de registros migrados: ${total}`);
}

async function main() {
  try {
    console.log('🚀 Iniciando migración de datos mock...\n');

    await migrateCompanies();
    await migrateCategories();
    await migrateDependencias();
    await migrateEquiposSeguridad();
    await migrateTiposDocumento();
    await migrateValidadores();
    await migrateEjecutores();
    await migratePersonasEspecificas();

    await verifyMigration();

    console.log('\n🎉 Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();