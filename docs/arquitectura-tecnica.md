# Documentación Técnica - Arquitectura del Sistema PGA

## Información General

**Proyecto:** Portal de Gestión Aeroportuaria (PGA) - CESAC
**Versión:** 1.0
**Desarrollador:** Kendy Qualey - Dirección de Tecnología y Comunicaciones del CESAC
**Fecha:** 2025

## Resumen Ejecutivo

El Portal de Gestión Aeroportuaria (PGA) es un sistema integral de gestión desarrollado para el CESAC (Cuerpo Especializado en Seguridad Aeroportuaria y de la Aviación Civil). El sistema funciona como un hub centralizado que integra múltiples aplicaciones y servicios para la administración de personal, acreditaciones, control de accesos, y gestión operativa.

## Arquitectura del Sistema

### Stack Tecnológico Principal

#### Frontend
- **Framework:** Next.js 15.3.3 con App Router
- **Lenguaje:** TypeScript 5
- **UI Library:** React 18.3.1
- **Estilos:** Tailwind CSS 3.4.1 + shadcn/ui components
- **Animaciones:** Framer Motion 11.2.10
- **Iconos:** Lucide React 0.475.0

#### Backend y Base de Datos
- **Plataforma Principal:** Firebase (proyecto: `portalpgacesac1`)
- **Base de Datos:** Firebase Firestore (NoSQL)
- **Autenticación:** Firebase Authentication
- **Functions:** Firebase Functions (Node.js)
- **Hosting:** Firebase Hosting
- **Storage:** Firebase Storage (implícito)

#### Inteligencia Artificial
- **Plataforma AI:** Google Genkit 1.13.0
- **Modelo:** Gemini 2.0 Flash
- **Casos de Uso:** Análisis automatizado de incidentes de seguridad

#### Herramientas de Desarrollo
- **Gestor de Paquetes:** pnpm
- **Build Tool:** Turbopack (Next.js dev)
- **Validación:** Zod 3.24.2
- **Forms:** React Hook Form 7.54.2

## Arquitectura de Datos

### Firebase Firestore
El sistema utiliza Firebase Firestore como base de datos principal, una base de datos NoSQL que ofrece:

- **Escalabilidad automática**
- **Sincronización en tiempo real**
- **Seguridad a nivel de documento**
- **Consultas complejas con índices**
- **Transacciones ACID**

### Estructura de Datos (Inferida)
Basado en la arquitectura del sistema, las principales colecciones incluyen:

```
firestore/
├── usuarios/
├── perfiles/
├── acreditaciones/
├── tramites/
├── notificaciones/
├── incidencias/
├── documentos/
├── empresas/
├── dependencias/
└── reportes/
```

## Arquitectura de la Aplicación

### Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/          # Portal administrativo
│   ├── cliente/            # Portal del cliente
│   ├── gateway/            # Hub de aplicaciones
│   └── manual/             # Documentación
├── components/             # Componentes React reutilizables
│   └── ui/                 # shadcn/ui components
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utilidades y funciones helper
└── ai/                     # Integración con Google Genkit
    ├── genkit.ts           # Configuración principal
    └── flows/              # Flujos de IA
```

### Patrones Arquitectónicos

#### 1. **Micro-Frontend Architecture**
El sistema actúa como un gateway que conecta múltiples aplicaciones:
- Portal administrativo interno
- Portal del cliente
- Aplicaciones externas (RFPass, KonTrol-IA, etc.)

#### 2. **Context-Based State Management**
- `ClientPortalContext`: Gestión del estado del portal del cliente
- `LockContext`: Sistema de bloqueo por inactividad

#### 3. **Server-Side Rendering (SSR) + Client-Side Hydration**
- Next.js App Router para navegación optimizada
- Renderizado híbrido según necesidades de cada página

## Funcionalidades Principales

### 1. **Portal Administrativo** (`/dashboard/`)
- Gestión de perfiles PGA
- Control de acreditaciones
- Administración de asignaciones
- Generación de reportes
- Gestión de incidencias
- Control de mantenimiento

### 2. **Portal del Cliente** (`/cliente/`)
- Dashboard personalizado
- Gestión de trámites
- Calendario personal
- Gestión de perfil
- Notificaciones
- Seguimiento de solicitudes

### 3. **Gateway de Aplicaciones** (`/gateway/`)
Hub centralizado con acceso a:
- Control de usuarios y permisos
- RFPass (Control de radios)
- KonTrol-IA (Control de propiedades)
- PolyGraph Manager
- S.U.V. (Control vehicular)
- Doc-QR (Seguridad documental)

### 4. **Sistema de IA** (`/ai/`)
- **Análisis de Incidentes:** Utiliza Gemini 2.0 Flash para analizar patrones en incidentes de seguridad
- **Generación de Reportes:** Resúmenes ejecutivos automatizados
- **Recomendaciones:** Sugerencias basadas en análisis de datos

## Integraciones y APIs

### Firebase Services
- **Authentication:** Gestión de usuarios y sesiones
- **Firestore:** Almacenamiento de datos estructurados
- **Functions:** Lógica de negocio del backend
- **Hosting:** Despliegue y distribución

### Google AI Platform
- **Genkit Framework:** Orquestación de flujos de IA
- **Gemini 2.0 Flash:** Modelo de lenguaje para análisis

### Aplicaciones Externas
- RFPass: `https://rfpass-cesac.web.app/`
- KonTrol-IA: `https://inventosoft-3d.web.app/`
- Doc-QR: `https://qreador.web.app/`
- Verif-ID: `https://studio--verif-id-am81p.us-central1.hosted.app/`

## Seguridad

### Autenticación y Autorización
- Firebase Authentication para gestión de usuarios
- Control de acceso basado en roles (RBAC)
- Sistema de bloqueo automático por inactividad (15 minutos)

### Seguridad de Datos
- Encriptación en tránsito (HTTPS)
- Reglas de seguridad de Firestore
- Validación client-side y server-side con Zod

### Documentos y Certificados
- Generación de códigos QR para validación documental
- Sistema de verificación de identidad integrado

## Configuración del Entorno

### Variables de Entorno
El proyecto utiliza configuración de Firebase mediante:
- `.firebaserc`: Configuración del proyecto (`portalpgacesac1`)
- `firebase.json`: Configuración de hosting y functions

### Build y Deployment
```bash
# Desarrollo
pnpm dev                 # Next.js con Turbopack
pnpm genkit:dev         # Servidor de desarrollo de Genkit

# Producción
pnpm build              # Build optimizado
pnpm start              # Servidor de producción

# Calidad de Código
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
```

## Rendimiento y Optimización

### Frontend
- **Turbopack:** Build tool ultra-rápido para desarrollo
- **Code Splitting:** Carga optimizada de componentes
- **Image Optimization:** Configurado para Firebase Hosting
- **Lazy Loading:** Carga diferida de componentes pesados

### Backend
- **Firebase Functions:** Escalabilidad automática
- **Firestore:** Índices optimizados para consultas
- **CDN:** Distribución global via Firebase Hosting

## Monitoring y Analytics

### Sistema de Incidencias
- Flujo automatizado de análisis de incidentes
- Generación de reportes ejecutivos
- Análisis de causa raíz con IA
- Recomendaciones a corto y largo plazo

### Telemetría
- OpenTelemetry integration para observabilidad
- Monitoreo de performance de aplicaciones integradas

## Consideraciones de Escalabilidad

### Horizontal Scaling
- Firebase Firestore escala automáticamente
- Firebase Functions con escalado dinámico
- CDN global para activos estáticos

### Modular Architecture
- Aplicaciones independientes comunicándose via APIs
- Microservicios desplegados en diferentes dominios
- Gateway centralizado para gestión de accesos

## Próximos Desarrollos

### Funcionalidades Planificadas
- Integración completa con sistemas de terceros
- Módulo de reportes avanzados con BI
- App móvil nativa para S.U.V.
- Expansión del sistema de IA para más casos de uso

### Mejoras Técnicas
- Implementación de tests automatizados
- CI/CD pipeline completo
- Monitoreo avanzado con alertas
- Optimización de performance backend

---

**Nota:** Este documento refleja la arquitectura actual del sistema basada en el análisis del código fuente. Para información específica sobre configuraciones de producción o credenciales, consultar con el equipo de desarrollo.