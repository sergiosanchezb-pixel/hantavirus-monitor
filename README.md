# HantaMonitor Next.js

🌍 **Sala de Operaciones Global de Monitoreo de Hantavirus**

Una aplicación web moderna construida con Next.js y Tailwind CSS para monitorear brotes de hantavirus en tiempo real desde fuentes oficiales (OMS, CDC, ProMED).

## 🚀 Características

- **📊 Dashboard en Tiempo Real**: Monitoreo continuo de casos y alertas
- **🗺️ Mapa Interactivo**: Visualización global de brotes con Leaflet
- **📰 Feed de Noticias**: Agregación de fuentes oficiales filtradas por hantavirus
- **🔄 Actualización Automática**: Refresco automático cada 30 minutos
- **📱 Responsive Design**: Optimizado para todos los dispositivos
- **⚡ Rendimiento Optimizado**: Construido con Next.js 14 y TypeScript

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS con diseño personalizado
- **Mapas**: Leaflet + React-Leaflet
- **Backend**: API Routes de Next.js
- **Scraping**: Axios, Cheerio, RSS Parser
- **Fuentes**: OMS, CDC (HAN + MMWR), ProMED Mail

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd hanta-monitor-nextjs
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── health/        # Health check
│   │   └── stats/         # Endpoint de datos
│   ├── globals.css        # Estilos globales
│   └── page.tsx          # Página principal
├── components/            # Componentes React
│   ├── Header.tsx        # Cabecera con estadísticas
│   ├── Map.tsx          # Mapa interactivo
│   ├── NewsFeed.tsx      # Feed de noticias
│   ├── DataTable.tsx     # Tabla de datos
│   └── Footer.tsx       # Pie de página
├── lib/                  # Utilidades
│   ├── cache.ts         # Sistema de caché
│   ├── data.ts          # Datos estáticos
│   └── scrapers/        # Web scrapers
│       ├── index.ts     # Orquestador
│       ├── who.ts       # Scraper OMS
│       ├── cdc.ts       # Scraper CDC
│       └── promed.ts    # Scraper ProMED
└── types/               # Tipos TypeScript
    └── index.ts         # Definiciones de tipos
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Opcional: Configuración del servidor
PORT=3000
NODE_ENV=development
```

### Build para Producción

```bash
npm run build
npm start
```

## 📊 API Endpoints

### `/api/health`
Health check del servidor.

**Respuesta:**
```json
{
  "status": "ok",
  "uptime": 1234,
  "env": "production"
}
```

### `/api/stats`
Obtener datos de monitoreo.

**Parámetros:**
- `force=true` - Forzar actualización ignorando caché

**Respuesta:**
```json
{
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "stats": {
    "confirmedCases": 10,
    "deaths": 2,
    "activeAlerts": 5,
    "sourcesOk": 3
  },
  "sources": [...],
  "articles": [...],
  "fromCache": false,
  "cacheAgeMinutes": 0
}
```

## 🎨 Diseño y Estilos

El proyecto mantiene la estética visual del template original:

- **Colores**: 
  - Primario: `#00ff88` (verde neón)
  - Secundario: `#00ccff` (cian)
  - Acento: `#ff0055` (rojo)
  - Advertencia: `#ff9500` (naranja)

- **Fuentes**:
  - Títulos: `Space Grotesk`
  - Monoespaciado: `JetBrains Mono`

- **Animaciones**: Efectos de glow, pulsación y scanline

## 🔄 Flujo de Datos

1. **Scraping**: Se consultan las fuentes oficiales cada 30 minutos
2. **Filtrado**: Los artículos se filtran por palabras clave de hantavirus
3. **Cache**: Los resultados se cachean para mejorar rendimiento
4. **UI**: Los datos se muestran en tiempo real en el dashboard

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

Este proyecto es una iniciativa independiente para referencia informativa. No es una fuente oficial de datos médicos.

## ⚠️ Descargo de Responsabilidad

- **NO ES FUENTE OFICIAL** - Solo referencia informativa
- Los datos provienen de scraping de fuentes públicas
- Verificar siempre con fuentes oficiales para información médica
- Los datos pueden tener retrasos o imprecisiones

## 📞 Soporte

Para reportar issues o sugerencias:
- Crear un issue en GitHub
- Contactar al maintainers del proyecto

---

**Desarrollado con Next.js ❤️**
