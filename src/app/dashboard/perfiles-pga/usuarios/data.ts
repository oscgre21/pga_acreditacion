
import { initialApps } from "../../perfiles-pga/data";

// Mock more detailed user data
export const usersData = [
  { 
    id: 1, 
    nombre: 'Administrador Cargos', 
    usuario: 'admincargos', 
    correo: 'josemanuel@cesac.mil.do', 
    telefono: '(809)-000-0000', 
    activo: true,
    rango: 'Asimilado Militar',
    departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN',
    nivelPerfil: 'Master Key',
    appsConcedidas: [initialApps[0], initialApps[1], initialApps[11]],
    ultimosAccesos: [
        { fecha: '2024-08-01', hora: '10:30 AM', app: 'Sistema Gestión Usuario' },
        { fecha: '2024-08-01', hora: '09:15 AM', app: 'Sistema Carnet Unico' },
        { fecha: '2024-07-31', hora: '04:55 PM', app: 'Modulo de Acreditacion' },
    ]
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
    nivelPerfil: 'Administrativo',
    appsConcedidas: [initialApps[0], initialApps[1], initialApps[2], initialApps[3], initialApps[4]],
     ultimosAccesos: [
        { fecha: '2024-08-01', hora: '11:00 AM', app: 'Sistema Gestión Usuario' },
        { fecha: '2024-07-31', hora: '02:00 PM', app: 'Sistema de documentacion de poligrafia' },
        { fecha: '2024-07-31', hora: '11:45 AM', app: 'Sistema de Reclutamiento' },
    ]
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
    nivelPerfil: 'Estándar',
    appsConcedidas: [initialApps[1]],
    ultimosAccesos: [
        { fecha: '2024-06-15', hora: '03:10 PM', app: 'Sistema Carnet Unico' },
    ]
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
    nivelPerfil: 'Avanzado',
    appsConcedidas: [initialApps[0], initialApps[10], initialApps[11]],
     ultimosAccesos: [
        { fecha: '2024-07-29', hora: '08:30 AM', app: 'Sistema Gestión de Acreditacion (Nube)' },
        { fecha: '2024-07-28', hora: '05:20 PM', app: 'Modulo de Acreditacion' },
        { fecha: '2024-07-28', hora: '09:00 AM', app: 'Sistema Gestión Usuario' },
    ]
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
    nivelPerfil: 'Estándar',
    appsConcedidas: [initialApps[4]],
     ultimosAccesos: [
        { fecha: '2024-07-30', hora: '02:00 PM', app: 'Sistema Automatizado de Recepción de Documentos de Cursos' },
    ]
  },
  { id: 6, nombre: 'ANA SOFIA PEREZ ASTACIO', usuario: 'a.perez', correo: 'a.perez@cesac.mil.do', telefono: '(809)-000-0000', activo: false, rango: 'Raso', departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN', nivelPerfil: 'Estándar', appsConcedidas: [], ultimosAccesos: [] },
  { id: 7, nombre: 'Angelica Portoreal', usuario: 'a.portorreal', correo: 'a.portorreal@cesac.mil.do', telefono: '(829)-771-1799', activo: true, rango: 'Asimilado Militar', departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN', nivelPerfil: 'Avanzado', appsConcedidas: [initialApps[0], initialApps[1]], ultimosAccesos: [{ fecha: '2024-07-31', hora: '10:00 AM', app: 'Sistema Carnet Unico' }] },
  { id: 8, nombre: 'BIANNY ROA FLORENTINO', usuario: 'b.roa@cesac.mil.do', correo: 'b.roa@cesac.mil.do', telefono: '(809)-352-7572', activo: true, rango: 'Cabo', departamento: 'DIRECCIÓN DE ASUNTOS INTERNOS', nivelPerfil: 'Estándar', appsConcedidas: [initialApps[2]], ultimosAccesos: [{ fecha: '2024-07-30', hora: '11:00 AM', app: 'Sistema de documentacion de poligrafia' }] },
  { id: 9, nombre: 'Carmen Miguelina Heredia', usuario: 'c.heredia', correo: 'c.heredia@cesac.mil.do', telefono: '(829)-305-7136', activo: false, rango: 'Asimilado Militar', departamento: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN', nivelPerfil: 'Estándar', appsConcedidas: [], ultimosAccesos: [] },
  { id: 10, nombre: 'Carolin Nuñez Sanchez', usuario: 'c.nunez@cesac.mil.do', correo: 'c.nunez@cesac.mil.do', telefono: '(809)-000-0000', activo: true, rango: 'Sargento', departamento: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN', nivelPerfil: 'Administrativo', appsConcedidas: [initialApps[0], initialApps[1], initialApps[5]], ultimosAccesos: [{ fecha: '2024-08-01', hora: '12:00 PM', app: 'Sistema de Gestión y Administración de Correspondencia' }, { fecha: '2024-07-31', hora: '03:00 PM', app: 'Sistema Gestión Usuario' }] },
];

export const dependencies = [
    { id: 1, nombre: 'DIRECCIÓN DE ACREDITACIÓN Y CERTIFICACIÓN' },
    { id: 2, nombre: 'DIRECCIÓN DE TECNOLOGÍA Y COMUNICACIÓN' },
    { id: 3, nombre: 'DEPARTAMENTO DE TESORERIA' },
    { id: 4, nombre: 'Escuela de Seguridad de la Aviación Civil (ESAC)' },
    { id: 5, nombre: 'SUB-DIRECCION DE COMPRAS' },
    { id: 6, nombre: 'DIRECCIÓN DE ASUNTOS INTERNOS' },
];

export const employeeOptions = [
    { id: '1', name: 'ABRAHAN PINEDA SANCHEZ' },
    { id: '2', name: 'JUAN CARLOS PEREZ' },
    { id: '3', name: 'MARIA LUISA RODRIGUEZ' },
];

export const roleOptions = [
    { id: 'validador', name: 'Responsable de Validación' },
    { id: 'tarea', name: 'Responsable de Tarea' },
    { id: 'ejecutor', name: 'Responsable ejecutar tarea' },
];
