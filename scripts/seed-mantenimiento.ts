import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMantenimiento() {
  try {
    console.log('🌱 Seeding datos de mantenimiento...');

    // Aeropuertos
    const aeropuertos = [
      { id: "mdsd", codigo: "MDSD", nombre: "Aeropuerto Internacional Las Américas", activo: true },
      { id: "mdst", codigo: "MDST", nombre: "Aeropuerto Internacional Cibao", activo: true },
      { id: "mdpc", codigo: "MDPC", nombre: "Aeropuerto Internacional Punta Cana", activo: true },
      { id: "mdbh", codigo: "MDBH", nombre: "Aeropuerto Internacional Samaná", activo: true },
      { id: "mdcy", codigo: "MDCY", nombre: "Aeropuerto Internacional Casa de Campo", activo: true },
      { id: "mdjb", codigo: "MDJB", nombre: "Aeropuerto Internacional Dr. Joaquín Balaguer", activo: true },
      { id: "mdlr", codigo: "MDLR", nombre: "Aeropuerto Internacional La Romana", activo: true },
      { id: "mdab", codigo: "MDAB", nombre: "Aeropuerto Internacional Arroyo Barril", activo: true },
      { id: "mdpp", codigo: "MDPP", nombre: "Aeropuerto Internacional Gregorio Luperón", activo: true },
    ];

    for (const aeropuerto of aeropuertos) {
      await prisma.aeropuerto.upsert({
        where: { id: aeropuerto.id },
        update: aeropuerto,
        create: aeropuerto
      });
    }

    // Categorías Personal
    const categoriasPersonal = [
      { id: 'supervisor', codigo: 'SUP_AVSEC', nombre: 'SUPERVISOR AVSEC', activa: true },
      { id: 'instructor', codigo: 'INST_AVSEC', nombre: 'INSTRUCTOR AVSEC', activa: true },
      { id: 'gerente', codigo: 'GER_AVSEC', nombre: 'GERENTE AVSEC', activa: true },
      { id: 'manejador_k9', codigo: 'MAN_K9', nombre: 'MANEJADOR K-9', activa: true },
      { id: 'inspector_nacional', codigo: 'INSP_NAC', nombre: 'INSPECTOR NACIONAL AVSEC', activa: true },
      { id: 'inspector_cat', codigo: 'INSP_CAT1', nombre: 'INSPECTOR AVSEC 1RA CAT', activa: true },
      { id: 'inspector_privada', codigo: 'INSP_PRIV', nombre: 'INSPECTOR DE SEGURIDAD PRIVADA', activa: true },
    ];

    for (const categoria of categoriasPersonal) {
      await prisma.categoriaPersonal.upsert({
        where: { id: categoria.id },
        update: categoria,
        create: categoria
      });
    }

    // Servicios de Seguridad
    const serviciosSeguridad = [
      { id: 'seguridad_carga', codigo: 'SEG_CARGA', nombre: 'Seguridad de la carga', activo: true },
      { id: 'escolta_pasajeros', codigo: 'ESC_PASAJ', nombre: 'Escolta de los pasajeros', activo: true },
      { id: 'control_seguridad', codigo: 'CTRL_SEG', nombre: 'Control de seguridad en la zona de presentación', activo: true },
      { id: 'seguridad_aeronave', codigo: 'SEG_AERON', nombre: 'Seguridad de la aeronave', activo: true },
      { id: 'control_equipaje', codigo: 'CTRL_EQUIP', nombre: 'Control de seguridad de equipaje de bodega', activo: true },
      { id: 'inspeccion_carga', codigo: 'INSP_CARGA', nombre: 'Inspección de la carga en sus instalaciones', activo: true },
      { id: 'inspeccion_suministros', codigo: 'INSP_SUMIN', nombre: 'Inspección de suministros en sus instalaciones', activo: true },
    ];

    for (const servicio of serviciosSeguridad) {
      await prisma.servicioSeguridad.upsert({
        where: { id: servicio.id },
        update: servicio,
        create: servicio
      });
    }

    // Equipos de Seguridad
    const equiposSeguridad = [
      { nombre: "Cámaras", estado: "ACTIVO" },
      { nombre: "Escáner", estado: "ACTIVO" },
      { nombre: "Máquina de Rayos X", estado: "ACTIVO" },
      { nombre: "Detector de Metal Portátil", estado: "ACTIVO" },
      { nombre: "Arco Detector de Metal", estado: "ACTIVO" },
      { nombre: "MMTD", estado: "ACTIVO" },
    ];

    const equiposCreados = [];
    for (const equipo of equiposSeguridad) {
      const equipoCreado = await prisma.equipoSeguridad.create({
        data: equipo
      });
      equiposCreados.push(equipoCreado);
    }

    // Categorías
    const categorias = [
      { nombre: "EMPRESAS DE APROVISIONAMIENTO Y SUMINISTRO", estado: "ACTIVO" },
      { nombre: "ARRENDATARIOS EN AEROPUERTO", estado: "ACTIVO" },
      { nombre: "PROVEEDORES DE SERVICIOS PRIVADOS DE SEGURIDAD", estado: "ACTIVO" },
    ];

    const categoriasCreadas = [];
    for (const categoria of categorias) {
      const categoriaCreada = await prisma.categoria.create({
        data: categoria
      });
      categoriasCreadas.push(categoriaCreada);
    }

    // Tipos de Documento
    const tiposDocumento = [
      { nombre: "RNC actualizado", descripcion: "Copia del RNC actualizado", obligatorio: true, estado: "ACTIVO" },
      { nombre: "Certificación Cámara de Comercio", descripcion: "Certificación de la Cámara de Comercio", obligatorio: true, estado: "ACTIVO" },
      { nombre: "Carta de solicitud", descripcion: "Carta de solicitud de aprobación del programa", obligatorio: true, estado: "ACTIVO" },
      { nombre: "Programa de seguridad", descripcion: "Copia del programa de seguridad propuesto", obligatorio: true, estado: "ACTIVO" },
      { nombre: "Cédula de Identidad", descripcion: "Copia de Cédula de Identidad", obligatorio: true, estado: "ACTIVO" },
      { nombre: "Carnet de identificación", descripcion: "Copia del Carnet de identificación y acceso", obligatorio: true, estado: "ACTIVO" },
    ];

    const tiposCreados = [];
    for (const tipo of tiposDocumento) {
      const tipoCreado = await prisma.tipoDocumento.create({
        data: tipo
      });
      tiposCreados.push(tipoCreado);
    }

    console.log(`✅ Se crearon:`);
    console.log(`- ${aeropuertos.length} aeropuertos`);
    console.log(`- ${categoriasPersonal.length} categorías de personal`);
    console.log(`- ${serviciosSeguridad.length} servicios de seguridad`);
    console.log(`- ${equiposCreados.length} equipos de seguridad`);
    console.log(`- ${categoriasCreadas.length} categorías`);
    console.log(`- ${tiposCreados.length} tipos de documento`);

  } catch (error) {
    console.error('❌ Error seeding mantenimiento:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si es llamado directamente
if (require.main === module) {
  seedMantenimiento();
}

export { seedMantenimiento };