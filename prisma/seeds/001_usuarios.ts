// prisma/seeds/001_usuarios.ts
import { PrismaClient, NivelPerfil } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedUsuarios() {
  console.log('🌱 Seeding usuarios...')

  const usuarios = [
    {
      id: 1,
      nombre: 'Administrador Cargos',
      usuario: 'admincargos',
      correo: 'josemanuel@cesac.mil.do',
      telefono: '(809)-000-0000',
      activo: true,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
      nivelPerfil: NivelPerfil.MASTER_KEY,
      passwordHash: await bcrypt.hash('admin123', 10),
    },
    {
      id: 2,
      nombre: 'Administrador Registro Control',
      usuario: 'adminregistrocontrol',
      correo: 'henrycodigo@hotmail.com',
      telefono: '(809)-000-0000',
      activo: true,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN',
      nivelPerfil: NivelPerfil.ADMINISTRATIVO,
      passwordHash: await bcrypt.hash('admin123', 10),
    },
    {
      id: 3,
      nombre: 'ALEXANDRA BURET RIVAS',
      usuario: 'a.buret@cesac.mil.do',
      correo: 'a.buret@cesac.mil.do',
      telefono: '(849)-258-9975',
      activo: false,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE ASUNTOS INTERNOS',
      nivelPerfil: NivelPerfil.ESTANDAR,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 4,
      nombre: 'Amalia Teresa Burgos',
      usuario: 'a.burgos',
      correo: 'a.burgos@cesac.mil.do',
      telefono: '(829)-903-7937',
      activo: true,
      rango: 'Sargento Mayor',
      departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
      nivelPerfil: NivelPerfil.AVANZADO,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 5,
      nombre: 'Amauris Joel Mercedes Castillo',
      usuario: 'a.mercedes',
      correo: 'a.mercedes@cesac.mil.do',
      telefono: '(809)-545-4552',
      activo: true,
      rango: 'Cabo',
      departamento: 'Escuela de Seguridad de la Aviación Civil (ESAC)',
      nivelPerfil: NivelPerfil.ESTANDAR,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 6,
      nombre: 'ANA SOFIA PEREZ ASTACIO',
      usuario: 'a.perez',
      correo: 'a.perez@cesac.mil.do',
      telefono: '(809)-000-0000',
      activo: false,
      rango: 'Raso',
      departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
      nivelPerfil: NivelPerfil.ESTANDAR,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 7,
      nombre: 'Angelica Portoreal',
      usuario: 'a.portorreal',
      correo: 'a.portorreal@cesac.mil.do',
      telefono: '(829)-771-1799',
      activo: true,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN',
      nivelPerfil: NivelPerfil.AVANZADO,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 8,
      nombre: 'BIANNY ROA FLORENTINO',
      usuario: 'b.roa@cesac.mil.do',
      correo: 'b.roa@cesac.mil.do',
      telefono: '(809)-352-7572',
      activo: true,
      rango: 'Cabo',
      departamento: 'DIRECCIÓN DE ASUNTOS INTERNOS',
      nivelPerfil: NivelPerfil.ESTANDAR,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 9,
      nombre: 'Carmen Miguelina Heredia',
      usuario: 'c.heredia',
      correo: 'c.heredia@cesac.mil.do',
      telefono: '(829)-305-7136',
      activo: false,
      rango: 'Asimilado Militar',
      departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
      nivelPerfil: NivelPerfil.ESTANDAR,
      passwordHash: await bcrypt.hash('user123', 10),
    },
    {
      id: 10,
      nombre: 'Carolin Nuñez Sanchez',
      usuario: 'c.nunez@cesac.mil.do',
      correo: 'c.nunez@cesac.mil.do',
      telefono: '(809)-000-0000',
      activo: true,
      rango: 'Sargento',
      departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN',
      nivelPerfil: NivelPerfil.ADMINISTRATIVO,
      passwordHash: await bcrypt.hash('user123', 10),
    },
  ]

  for (const usuario of usuarios) {
    await prisma.usuario.upsert({
      where: { id: usuario.id },
      update: {},
      create: usuario,
    })
  }

  console.log('✅ Usuarios seeded successfully')
}