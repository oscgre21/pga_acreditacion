# Documentación Docker - PGA Portal de Gestión Aeroportuaria

## 📦 Contenedores Docker para PGA

Este proyecto incluye configuración completa de Docker para desarrollo y producción del sistema PGA.

---

## 🚀 Construcción de la Imagen

### Build Básico
```bash
docker build -t pga-acreditacion .
```

### Build con Tag Específico
```bash
docker build -t pga-acreditacion:v1.0.0 .
```

---

## 🔥 Ejecución del Contenedor

### Ejecución Simple
```bash
docker run -d -p 3001:3000 --name pga-app pga-acreditacion
```

### Ejecución con Variables de Entorno
```bash
docker run -d \
  -p 3001:3000 \
  --name pga-app \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://usuario:password@host:5432/database" \
  -e NEXTAUTH_SECRET="tu-secret-aqui" \
  -e NEXTAUTH_URL="http://localhost:3001" \
  pga-acreditacion
```

---

## 🐳 Docker Compose

### Iniciar Servicios Completos
```bash
# Construir y levantar servicios
docker-compose up -d --build

# Solo levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f pga-app
```

### Servicios Incluidos

1. **pga-app**: Aplicación Next.js principal
   - Puerto: 3001:3000
   - Health check incluido
   - Auto-restart

2. **postgres**: Base de datos PostgreSQL
   - Puerto: 5432:5432
   - Datos persistentes
   - Usuario: pga_user
   - Base de datos: pga_acreditacion

---

## 🏗️ Arquitectura Multi-Stage

El Dockerfile utiliza una construcción multi-stage optimizada:

### Stage 1: Dependencies
```dockerfile
FROM node:18-alpine AS deps
# Instala solo dependencias de producción
```

### Stage 2: Builder
```dockerfile
FROM node:18-alpine AS builder
# Construye la aplicación
# Genera cliente Prisma
# Optimiza dependencias
```

### Stage 3: Runner
```dockerfile
FROM node:18-alpine AS runner
# Imagen final minimal
# Usuario no-root para seguridad
# Health checks incluidos
```

---

## 🔍 Health Checks

### Endpoint de Salud
```bash
curl http://localhost:3001/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 120.456,
  "environment": "production",
  "version": "1.0.0"
}
```

### Health Check Interno
```bash
docker exec pga-app node healthcheck.js
```

### Verificar Estado del Contenedor
```bash
docker ps
docker logs pga-app
docker inspect pga-app
```

---

## 🛠️ Comandos de Desarrollo

### Reconstruir Imagen
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Acceder al Contenedor
```bash
docker exec -it pga-app sh
```

### Ver Logs en Tiempo Real
```bash
docker-compose logs -f pga-app
```

### Reiniciar Servicios
```bash
docker-compose restart pga-app
```

---

## 📊 Monitoreo y Depuración

### Recursos del Contenedor
```bash
docker stats pga-app
```

### Procesos Internos
```bash
docker exec pga-app ps aux
```

### Información de la Imagen
```bash
docker image inspect pga-acreditacion
```

### Tamaño de la Imagen
```bash
docker images pga-acreditacion
```

---

## 🔧 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `production` |
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret para NextAuth | `tu-secret-super-seguro` |
| `NEXTAUTH_URL` | URL base de la aplicación | `http://localhost:3001` |
| `PORT` | Puerto interno | `3000` |
| `HOSTNAME` | Hostname del servidor | `0.0.0.0` |

---

## 📁 Archivos Docker Incluidos

```
├── Dockerfile              # Imagen principal multi-stage
├── .dockerignore           # Archivos excluidos del build
├── docker-compose.yml      # Orquestación de servicios
├── healthcheck.js          # Script de health check
└── docs/
    └── DOCKER_README.md    # Esta documentación
```

---

## 🚦 Optimizaciones Implementadas

### 🔸 **Multi-stage Build**
- Separación de dependencias, build y runtime
- Imagen final optimizada (~200MB menos)

### 🔸 **Layers Caching**
- Dependencies layer cached
- Build layer optimizado
- node_modules reutilizable

### 🔸 **Seguridad**
- Usuario no-root (nextjs:1001)
- Dependencias de desarrollo eliminadas
- Alpine Linux base image

### 🔸 **Health Checks**
- Endpoint HTTP `/api/health`
- Script interno de verificación
- Auto-restart en fallos

### 🔸 **Optimización de Tamaño**
- `pnpm prune --prod` para production
- `.dockerignore` comprehensive
- Static files optimizados

---

## 🔍 Solución de Problemas

### Contenedor no Inicia
```bash
# Ver logs detallados
docker logs pga-app

# Verificar health check
docker exec pga-app node healthcheck.js
```

### Puerto Ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3000"  # Usar puerto 3002
```

### Problemas de Base de Datos
```bash
# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Build Lento
```bash
# Build sin cache
docker build --no-cache -t pga-acreditacion .

# Limpiar imágenes no utilizadas
docker system prune -a
```

---

## 📈 Métricas y Performance

### Tamaño de Imagen Final
- **Base Image**: node:18-alpine (~40MB)
- **App Layer**: ~150-200MB
- **Total**: ~240-280MB

### Tiempo de Startup
- **Cold Start**: ~3-5 segundos
- **Ready State**: ~1-2 segundos adicionales
- **Health Check**: ~30 segundos primera verificación

### Recursos Recomendados
- **CPU**: 0.5-1 core
- **RAM**: 512MB-1GB
- **Storage**: 1GB+ para logs y cache

---

## 🎯 Próximos Pasos

1. **CI/CD Integration**: GitHub Actions para build automático
2. **Registry Push**: Configurar Docker Hub o registry privado
3. **Kubernetes**: Manifiestos para orquestación
4. **Monitoring**: Integración con Prometheus/Grafana
5. **Scaling**: Configuración para réplicas múltiples

---

## 📞 Soporte

Para problemas con Docker:
1. Verificar logs: `docker-compose logs -f`
2. Revisar health checks: `curl localhost:3001/api/health`
3. Validar variables de entorno
4. Contactar al equipo de desarrollo