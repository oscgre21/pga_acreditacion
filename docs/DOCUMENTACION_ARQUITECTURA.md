# Documentación de Arquitectura del Sistema PGA

## Portal de Gestión Aeroportuaria (PGA)

### Información General
- **Framework**: Next.js 15.3.3 con App Router
- **Styling**: Tailwind CSS con shadcn/ui
- **AI Integration**: Google Genkit con Gemini 2.0 Flash
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting)
- **Database**: PostgreSQL con Prisma ORM
- **Forms**: React Hook Form con Zod validation

---

## 1. Arquitectura de la Aplicación

```mermaid
graph TB
    subgraph "Cliente (Frontend)"
        A["Next.js App Router<br/>src/app/layout.tsx"]
        B["React Components<br/>src/components/"]
        C["Tailwind CSS + shadcn/ui<br/>src/components/ui/"]
        D["React Hook Form + Zod<br/>Forms & Validation"]
    end

    subgraph "Autenticación"
        E["NextAuth.js<br/>src/lib/auth.ts"]
        F["Credentials Provider<br/>UsuarioService.authenticateUser()"]
        G["JWT Strategy<br/>authOptions"]
    end

    subgraph "Backend Services"
        H["Prisma ORM<br/>src/lib/prisma.ts"]
        I["Service Layer<br/>src/lib/services/"]
        J["Repository Pattern<br/>src/lib/repositories/"]
        K["AI Integration - Genkit<br/>src/ai/genkit.ts"]
    end

    subgraph "Base de Datos"
        L["(PostgreSQL)<br/>prisma/schema.prisma"]
    end

    subgraph "AI Services"
        M["Google Gemini 2.0 Flash<br/>googleai/gemini-2.0-flash"]
        N["Incident Analysis Flow<br/>src/ai/flows/incident-analysis-flow.ts"]
    end

    A --> B
    B --> C
    B --> D
    A --> E
    E --> F
    E --> G
    A --> I
    I --> J
    J --> H
    H --> L
    K --> M
    K --> N
```

---

## 2. Estructura de Navegación y Pantallas

```mermaid
graph TD
    A[Landing/Login] --> B{Authentication}
    B -->|Admin| C[Dashboard Principal]
    B -->|Client| D[Portal Cliente]
    B -->|Gateway| E[Gateway Access]

    subgraph "Dashboard Administrativo"
        C --> F[Certificación y Re-certificación]
        F --> F1[Gestión Acreditaciones]
        F --> F2[Documentación]
        F --> F3[Data Maestro]

        C --> G[Asignaciones]
        G --> G1[Listado Trámites]
        G --> G2[Actividades]
        G --> G3[Notificaciones]

        C --> H[Liberaciones]

        C --> I[Acciones]
        I --> I1[Datos Migrados]
        I --> I2[Procesos]
    end

    subgraph "Perfiles PGA"
        C --> J[Perfiles PGA Section]
        J --> J1[PGA Dashboard]
        J --> J2[Aplicaciones]
        J --> J3[Usuarios]
        J --> J4[Reportes]
        J4 --> J4a[Rendimiento y Uso]
        J4 --> J4b[Historial Auditorías]
        J4 --> J4c[Análisis Incidentes]
        J4 --> J4d[Vulnerabilidades]
        J4 --> J4e[Docker]
        J4 --> J4f[Comparativa Versiones]
    end

    subgraph "Portal Cliente"
        D --> K[Dashboard Cliente]
        D --> L[Solicitudes]
        L --> L1[Nueva Solicitud]
        L --> L2[Mis Trámites]
        L --> L3[Mi Personal]
        D --> M[Calendario]
        D --> N[Perfil Compañía]
    end

    subgraph "Mantenimiento"
        F3 --> O[Mantenimiento Sections]
        O --> O1[Servicios Seguridad]
        O --> O2[Tipos Documento]
        O --> O3[Persona Específica]
        O --> O4[Perfil Empresa]
        O --> O5[Compañías]
        O --> O6[Categorías]
        O --> O7[Aeropuertos]
        O --> O8[Dependencias]
        O --> O9[Validadores]
        O --> O10[Ejecutores]
        O --> O11[Trámites]
    end
```

---

## 3. Servicios y APIs

```mermaid
graph TB
    subgraph "Service Layer - src/lib/services/"
        A["UsuarioService<br/>usuario.service.ts"]
        B["AcreditacionService<br/>acreditacion.service.ts"]
        C["NotificacionService<br/>notificacion.service.ts"]
        D["TramiteService<br/>tramite.service.ts"]
        E["AppService<br/>app.service.ts"]
        F["CompaniaService<br/>compania.service.ts"]
        G["ValidadorService<br/>validador.service.ts"]
        H["EjecutorService<br/>ejecutor.service.ts"]
        I["DependenciaService<br/>dependencia.service.ts"]
        J["CategoriaService<br/>categoria.service.ts"]
        K["AeropuertoService<br/>aeropuerto.service.ts"]
        L["TipoDocumentoService<br/>tipo-documento.service.ts"]
        M["EquipoSeguridadService<br/>equipoSeguridad.service.ts"]
    end

    subgraph "Repository Layer - src/lib/repositories/"
        N["UsuarioRepository<br/>usuario.repository.ts"]
        O["AcreditacionRepository<br/>acreditacion.repository.ts"]
        P["NotificacionRepository<br/>notificacion.repository.ts"]
        Q["TramiteRepository<br/>tramite.repository.ts"]
        R["AppRepository<br/>app.repository.ts"]
        S["CompaniaRepository<br/>compania.repository.ts"]
        T["ValidadorRepository<br/>validador.repository.ts"]
        U["EjecutorRepository<br/>ejecutor.repository.ts"]
        V["DependenciaRepository<br/>dependencia.repository.ts"]
        W["CategoriaRepository<br/>categoria.repository.ts"]
        X["AeropuertoRepository<br/>aeropuerto.repository.ts"]
        Y["TipoDocumentoRepository<br/>tipo-documento.repository.ts"]
        Z["EquipoSeguridadRepository<br/>equipo-seguridad.repository.ts"]
        AA["BaseRepository<br/>base.repository.ts"]
    end

    subgraph "External Services"
        BB["NextAuth Authentication<br/>src/lib/auth.ts"]
        CC["Google Genkit AI<br/>src/ai/genkit.ts"]
        DD["Firebase Services<br/>Environment Config"]
        EE["PostgreSQL Database<br/>Prisma Client"]
    end

    A --> N
    B --> O
    C --> P
    D --> Q
    E --> R
    F --> S
    G --> T
    H --> U
    I --> V
    J --> W
    K --> X
    L --> Y
    M --> Z

    N --> AA
    O --> AA
    P --> AA
    Q --> AA
    R --> AA
    S --> AA
    T --> AA
    U --> AA
    V --> AA
    W --> AA
    X --> AA
    Y --> AA
    Z --> AA

    AA --> EE
    A --> BB
    CC --> DD
```

---

## 4. Modelo de Datos y Entidades

```mermaid
erDiagram
    Usuario {
        int id PK
        string nombre
        string usuario UK
        string correo UK
        string telefono
        boolean activo
        string rango
        string departamento
        enum nivelPerfil
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    App {
        string id PK
        string nombre
        text descripcion
        boolean activa
        string version
        datetime lastUpdate
        datetime lastAudit
        int auditorId FK
        string clientId UK
        string code UK
        string urlDestino
        string redirectUrl
        int assignedDevId FK
        int backendDevId FK
        int frontendDevId FK
        int users72h
        int totalUsers
        datetime createdAt
        datetime updatedAt
    }

    DetalleTecnico {
        int id PK
        string appId FK UK
        string stack
        string architecture
        string database
        string cicd
        string repository
        datetime createdAt
        datetime updatedAt
    }

    UsuarioApp {
        int id PK
        int usuarioId FK
        string appId FK
        datetime fechaConcesion
        boolean activa
    }

    AccesoApp {
        int id PK
        int usuarioId FK
        string appId FK
        datetime fecha
        string userAgent
        string ip
    }

    Incidente {
        int id PK
        string appId FK
        string titulo
        text descripcion
        enum severidad
        boolean resuelto
        datetime fechaCreacion
        datetime fechaResolucion
        text solucion
    }

    Notificacion {
        int id PK
        int usuarioId FK
        string titulo
        text mensaje
        enum tipo
        boolean leida
        datetime fechaCreacion
    }

    Acreditacion {
        string id PK
        string numero UK
        string solicitante
        string personal
        string aeropuertoId FK
        string categoria
        string proceso
        string subproceso
        enum estado
        int progreso
        string referencia
        datetime fechaIngreso
        datetime fechaVencimiento
        text observaciones
        boolean hasWarning
        decimal costoUSD
        datetime createdAt
        datetime updatedAt
    }

    Tramite {
        string id PK
        string titulo
        text descripcion
        enum estado
        int creadorId FK
        datetime fechaCreacion
        datetime fechaLimite
        int prioridad
        text observaciones
        datetime createdAt
        datetime updatedAt
    }

    Aeropuerto {
        string id PK
        string codigo UK
        string nombre
        string pais
        string ciudad
        boolean activo
        datetime createdAt
        datetime updatedAt
    }

    Compania {
        string id PK
        string nombre
        string ruc UK
        string razonSocial
        enum estado
        datetime createdAt
        datetime updatedAt
    }

    Usuario ||--o{ UsuarioApp : "tiene"
    Usuario ||--o{ AccesoApp : "realiza"
    Usuario ||--o{ Notificacion : "recibe"
    Usuario ||--o{ Tramite : "crea"
    Usuario ||--o{ App : "audita"
    Usuario ||--o{ App : "desarrolla_asignado"
    Usuario ||--o{ App : "desarrolla_backend"
    Usuario ||--o{ App : "desarrolla_frontend"

    App ||--|| DetalleTecnico : "tiene"
    App ||--o{ UsuarioApp : "concedida_a"
    App ||--o{ AccesoApp : "accedida_por"
    App ||--o{ Incidente : "tiene"

    Aeropuerto ||--o{ Acreditacion : "ubicacion"
```

---

## 5. Flujo de Datos de Acreditaciones

```mermaid
flowchart TD
    A[Nueva Acreditación] --> B[Validación de Datos]
    B --> C{¿Datos Válidos?}
    C -->|No| D[Mostrar Errores]
    C -->|Sí| E[Crear Acreditación]
    E --> F[Asignar Ejecutores]
    F --> G[Asignar Validadores]
    G --> H[Enviar Notificaciones]
    H --> I[Estado: EN_PROCESO]

    I --> J[Ejecutor Procesa]
    J --> K{¿Documentos Completos?}
    K -->|No| L[Solicitar Documentos]
    K -->|Sí| M[Validador Revisa]

    M --> N{¿Aprobado?}
    N -->|No| O[Estado: RECHAZADO]
    N -->|Sí| P[Estado: APROBADO]

    O --> Q[Notificar Rechazo]
    P --> R[Notificar Aprobación]

    L --> S[Cliente Sube Documentos]
    S --> T[Verificar Completitud]
    T --> K

    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#fff3e0
    style O fill:#ffebee
    style P fill:#e8f5e8
```

---

## 6. Integración de Inteligencia Artificial

```mermaid
graph TB
    subgraph "AI Integration Layer - src/ai/"
        A["Genkit Configuration<br/>genkit.ts"]
        B["Google Gemini 2.0 Flash<br/>googleai/gemini-2.0-flash"]
        C["AI Flows<br/>src/ai/flows/"]
    end

    subgraph "AI Flows"
        D["Incident Analysis Flow<br/>incident-analysis-flow.ts"]
        E["Report Generation Flow<br/>AI-powered reports"]
        F["Document Analysis Flow<br/>Document processing"]
    end

    subgraph "Application Layer"
        G["Dashboard Reports<br/>/dashboard/reportes/*"]
        H["Incident Management<br/>/dashboard/reportes/incidentes"]
        I["Document Processing<br/>File uploads & analysis"]
        J["Analytics Dashboard<br/>/dashboard/perfiles-pga"]
    end

    subgraph "Development Tools"
        K["Genkit Dev Server<br/>pnpm genkit:dev"]
        L["Genkit Watch<br/>pnpm genkit:watch"]
    end

    A --> B
    A --> C
    C --> D
    C --> E
    C --> F
    A --> K
    A --> L

    D --> H
    E --> G
    E --> J
    F --> I

    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style D fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#fce4ec
```

---

## 7. Componentes Principales del Sistema

```mermaid
graph LR
    subgraph "UI Components - src/components/"
        A["shadcn/ui Base Components<br/>src/components/ui/"]
        B["Custom Components<br/>app-logo.tsx, user-nav.tsx"]
        C["Dashboard Layout<br/>dashboard-layout.tsx"]
        D["Client Layout<br/>client-sidebar.tsx"]
        E["Form Components<br/>React Hook Form + Zod"]
    end

    subgraph "Context Providers - src/contexts/"
        F["Lock Context<br/>lock-context.tsx"]
        G["Client Portal Context<br/>client-portal-context.tsx"]
        H["Auth Provider<br/>providers/auth-provider.tsx"]
    end

    subgraph "Custom Hooks - src/hooks/"
        I["useToast<br/>use-toast.ts"]
        J["useUsuarios<br/>useUsuarios.ts"]
        K["useNotificaciones<br/>useNotificaciones.ts"]
        L["useApps<br/>useApps.ts"]
        M["useAcreditaciones<br/>useAcreditaciones.ts"]
    end

    subgraph "State Management"
        N["React Context<br/>Context API"]
        O["Local State<br/>useState, useEffect"]
        P["Form State<br/>React Hook Form"]
    end

    subgraph "Sidebar Components"
        Q["DashboardSidebar<br/>dashboard-sidebar.tsx"]
        R["ClientSidebar<br/>client-sidebar.tsx"]
        S["PgaSidebar<br/>pga-sidebar.tsx"]
    end

    A --> B
    B --> C
    B --> D
    B --> E
    B --> Q
    B --> R
    B --> S

    F --> N
    G --> N
    H --> N

    I --> O
    J --> O
    K --> O
    L --> O
    M --> O

    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style I fill:#fff3e0
    style N fill:#e8f5e8
```

---

## 8. Seguridad y Autenticación

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as "Frontend<br/>page.tsx"
    participant A as "NextAuth<br/>src/lib/auth.ts"
    participant S as "UsuarioService<br/>usuario.service.ts"
    participant D as "Database<br/>PostgreSQL + Prisma"

    C->>F: Ingresa credenciales
    F->>A: Solicita autenticación
    A->>S: "authenticateUser()<br/>Valida usuario"
    S->>D: "findByUsuario()<br/>Consulta usuario"
    D-->>S: Datos usuario
    S->>S: "bcrypt.compare()<br/>Verifica contraseña"
    S-->>A: Usuario validado
    A-->>F: "JWT Token<br/>session strategy"
    F-->>C: Acceso autorizado

    Note over A,S: "Credentials Provider<br/>authOptions"
    Note over S,D: "passwordHash<br/>bcrypt hash"
    Note over A,F: "JWT Strategy<br/>callbacks"
```

---

## 9. Flujo de Trabajo de Trámites

```mermaid
stateDiagram-v2
    [*] --> Borrador: Crear trámite
    Borrador --> EnProceso: Enviar para revisión
    EnProceso --> Aprobado: Aprobar
    EnProceso --> Rechazado: Rechazar
    EnProceso --> EnRevision: Solicitar cambios
    EnRevision --> EnProceso: Aplicar cambios
    Rechazado --> Borrador: Reiniciar proceso
    Aprobado --> Completado: Finalizar
    Completado --> [*]

    note right of EnProceso
        Ejecutores procesan
        Validadores revisan
    end note

    note right of Completado
        Trámite finalizado
        Notificaciones enviadas
    end note
```

---

## 10. Arquitectura de Reportes

```mermaid
graph TB
    subgraph "Fuentes de Datos"
        A[Base de Datos Principal]
        B[Logs de Aplicación]
        C[Métricas de Uso]
        D[Datos de Auditoría]
    end

    subgraph "Procesamiento"
        E[Agregación de Datos]
        F[Análisis con IA]
        G[Generación de Insights]
    end

    subgraph "Reportes"
        H[Rendimiento y Uso]
        I[Historial de Auditorías]
        J[Análisis de Incidentes]
        K[Vulnerabilidades]
        L[Comparativa de Versiones]
        M[Docker Analytics]
    end

    subgraph "Visualización"
        N[Dashboards Interactivos]
        O[Gráficos y Charts]
        P[Exportación a PDF/Excel]
    end

    A --> E
    B --> E
    C --> E
    D --> E

    E --> F
    E --> G
    F --> G

    G --> H
    G --> I
    G --> J
    G --> K
    G --> L
    G --> M

    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N

    N --> O
    N --> P
```

---

## Resumen de la Arquitectura

Este sistema PGA (Portal de Gestión Aeroportuaria) implementa una arquitectura moderna y escalable basada en:

### Tecnologías Clave
- **Frontend**: Next.js 15 con App Router, React, Tailwind CSS
- **Backend**: Prisma ORM, PostgreSQL, NextAuth.js
- **AI**: Google Genkit con Gemini 2.0 Flash
- **UI**: shadcn/ui components, React Hook Form

### Características Principales
- **Arquitectura en Capas**: Service Layer, Repository Pattern, Base Repository
- **Autenticación Segura**: JWT con NextAuth.js, hash de contraseñas con bcrypt
- **Dos Portales**: Dashboard administrativo y Portal cliente
- **Gestión Completa**: Acreditaciones, trámites, usuarios, reportes
- **IA Integrada**: Análisis de incidentes y generación de reportes
- **Diseño Responsive**: Componentes reutilizables y accesibles

### Flujos de Trabajo
- **Acreditaciones**: Desde solicitud hasta aprobación/rechazo
- **Trámites**: Estados definidos con validaciones
- **Reportes**: Análisis automatizado con IA
- **Mantenimiento**: Gestión de datos maestros

Esta documentación proporciona una visión completa de la arquitectura del sistema, sus componentes, relaciones y flujos de trabajo principales.