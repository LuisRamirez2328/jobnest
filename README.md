# JobNest

Tracker de postulaciones de empleo construido con Vue 3 + TypeScript. Es una app
**standalone con datos de demostración en memoria** (sin backend): ideal como demo
de arquitectura frontend moderna.

![CI](https://github.com/LuisRamirez2328/jobnest/actions/workflows/ci.yml/badge.svg)

## Características

- **Dashboard**: KPIs de la búsqueda (total, en proceso, ofertas, tasa de respuesta),
  gráficas por mes y por etapa (ECharts, cargado de forma diferida) y actividad reciente.
- **Pipeline (kanban)**: columnas por etapa con drag & drop nativo, botón `+` por
  columna y menú por tarjeta.
- **Postulaciones**: tabla con búsqueda, filtros por etapa/modalidad, ordenamiento y
  CRUD completo (crear, ver, editar, eliminar con confirmación).
- **Formulario validado** con vee-validate + zod.
- **Tema claro/oscuro** persistido, detección de preferencia del sistema.
- **Spa con rutas lazy**, modo oscuro por clase Tailwind v4, componentes shadcn-vue
  (reka-ui + lucide).

## Stack

- Vue 3 (Composition API, `<script setup>`) + TypeScript
- Vite 8 + Vue Router + Pinia
- TanStack Vue Query (estado servidor sobre el mock en memoria)
- Tailwind CSS v4 + shadcn-vue (reka-ui, lucide)
- vee-validate + zod, vue-echarts, vue-sonner
- Vitest (unit) + Playwright (E2E), oxlint + prettier, GitHub Actions

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
npm run lint       # oxlint
npm run type-check # vue-tsc
npm run test:unit  # vitest
npm run build      # type-check + build de producción
npm run preview    # servir el build
npm run test:e2e   # Playwright (Chromium instalado: npx playwright install chromium)
```

## Estructura

```
src/
├── components/
│   ├── applications/   # tarjetas, kanban, dialog, detalle, filtros, badges
│   ├── dashboard/      # gráficas echarts con carga diferida
│   ├── layout/         # header, navegación, theme toggle
│   └── ui/             # componentes shadcn-vue
├── composables/        # useApplications (queries/mutations), useApplicationModals
├── services/           # tipos, mock en memoria, API simulada con latencia
├── stores/             # pinia: theme, filters
└── views/              # Dashboard, Board, Applications, NotFound
```

## Calidad

- 42 tests unitarios (services, stores, componentes) + 11 tests E2E (flujo completo).
- CI en GitHub Actions: lint, type-check, unit tests, build y E2E en Chromium.
- Rendimiento: rutas lazy y ECharts en chunk independiente (~9 kB inicial en Dashboard
  en vez de ~550 kB).

## Demo

El mock inyecta 14 postulaciones de ejemplo al cargar; los cambios viven solo en
memoria y se reinician al recargar la página.
