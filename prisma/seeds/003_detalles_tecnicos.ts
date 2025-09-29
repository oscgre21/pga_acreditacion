// prisma/seeds/003_detalles_tecnicos.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedDetallesTecnicos() {
  console.log('🌱 Seeding detalles técnicos...')

  const detallesTecnicos = [
    {
      appId: 'SGU',
      stack: ['Next.js (React)', 'Node.js (Express)', 'TypeScript'],
      architecture: 'Microservicios',
      database: 'PostgreSQL 14',
      cicd: ['GitHub Actions', 'Docker', 'Kubernetes (GKE)'],
      repository: 'github.com/cesac/sgu-main',
    },
    {
      appId: 'SCU',
      stack: ['React (Vite)', 'PHP (Laravel)', 'MySQL'],
      architecture: 'Monolito Modular',
      database: 'MySQL 8.0',
      cicd: ['Jenkins', 'Docker', 'On-Premise Server'],
      repository: 'github.com/cesac/scu-legacy',
    },
    {
      appId: 'SDP',
      stack: ['Next.js', 'Python (FastAPI)', 'PostgreSQL'],
      architecture: 'Arquitectura Segura de Cero Confianza (Zero Trust)',
      database: 'PostgreSQL 15 con cifrado en reposo',
      cicd: ['GitHub Actions', 'Docker (con escaneo de vulnerabilidades)', 'Vault'],
      repository: 'github.com/cesac/sdp-secure-api',
    },
    {
      appId: 'RRHH',
      stack: ['React', 'Go (Gin)', 'gRPC'],
      architecture: 'Microservicios',
      database: 'CockroachDB',
      cicd: ['GitLab CI', 'Docker', 'Kubernetes'],
      repository: 'github.com/cesac/rrhh-service',
    },
    {
      appId: 'SIARED',
      stack: ['Vue.js', 'Node.js (Express)', 'MongoDB'],
      architecture: 'Monolito',
      database: 'MongoDB Atlas',
      cicd: ['GitHub Actions', 'Docker Compose', 'On-Premise Server'],
      repository: 'github.com/cesac/siared-platform',
    },
    {
      appId: 'SGAC',
      stack: ['Next.js', 'Java (Spring Boot)', 'RabbitMQ'],
      architecture: 'Arquitectura Orientada a Eventos',
      database: 'Oracle DB',
      cicd: ['GitHub Actions', 'Docker', 'OpenShift'],
      repository: 'github.com/cesac/sgac-correspondence',
    },
    {
      appId: 'SCC',
      stack: ['Angular', '.NET Core', 'SQL Server'],
      architecture: 'Monolito',
      database: 'Microsoft SQL Server',
      cicd: ['Azure DevOps', 'Docker', 'IIS (On-Premise)'],
      repository: 'github.com/cesac/scc-quality-system',
    },
    {
      appId: 'SCF',
      stack: ['React Native', 'Node.js (NestJS)', 'MQTT'],
      architecture: 'Microservicios (IoT)',
      database: 'TimescaleDB (PostgreSQL)',
      cicd: ['GitHub Actions', 'Docker', 'Kubernetes'],
      repository: 'github.com/cesac/scf-fleet-control',
    },
    {
      appId: 'Laboratorio',
      stack: ['Blazor', '.NET Core', 'SQL Server'],
      architecture: 'Monolito',
      database: 'Microsoft SQL Server',
      cicd: ['Azure DevOps', 'Docker', 'IIS'],
      repository: 'github.com/cesac/lab-sample-manager',
    },
    {
      appId: 'SGLS',
      stack: ['SvelteKit', 'Node.js (Fastify)', 'GraphQL'],
      architecture: 'Microservicios',
      database: 'PostgreSQL',
      cicd: ['GitHub Actions', 'Docker', 'Kubernetes'],
      repository: 'github.com/cesac/sgls-service-list',
    },
    {
      appId: 'SGA - CESAC',
      stack: ['Next.js', 'Go', 'gRPC'],
      architecture: 'Serverless (Cloud Functions)',
      database: 'Firebase Firestore',
      cicd: ['Cloud Build', 'Docker', 'Cloud Run'],
      repository: 'github.com/cesac/sga-nube-accreditation',
    },
    {
      appId: 'MA - CESAC',
      stack: ['JSP (JavaServer Pages)', 'Java Servlets', 'jQuery'],
      architecture: 'Monolito (Legacy)',
      database: 'IBM DB2',
      cicd: ['Jenkins (Manual)', 'WAR file deployment', 'IBM WebSphere'],
      repository: 'github.com/cesac/ma-legacy-module',
    },
  ]

  for (const detalle of detallesTecnicos) {
    await prisma.detalleTecnico.upsert({
      where: { appId: detalle.appId },
      update: {},
      create: detalle,
    })
  }

  console.log('✅ Detalles técnicos seeded successfully')
}