<script setup lang="ts">
import { computed } from 'vue'
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  HandshakeIcon,
  Loader2Icon,
  PercentIcon,
  TimerIcon,
} from '@lucide/vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import { useStats } from '@/composables/useApplications'
import { STAGE_META } from '@/services/types'
import { useThemeStore } from '@/stores/theme'
import { formatRelativeDate } from '@/lib/utils'
import type { EChartsOption } from 'echarts'

const statsQuery = useStats()
const themeStore = useThemeStore()

const STAGE_COLORS: Record<string, string> = {
  applied: '#0ea5e9',
  interview: '#f59e0b',
  offer: '#10b981',
  rejected: '#f43f5e',
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function chartPalette() {
  const dark = themeStore.theme === 'dark'
  return {
    text: dark ? '#a1a1aa' : '#71717a',
    border: dark ? '#27272a' : '#e4e4e7',
    primary: cssVar('--primary') || '#18181b',
    card: cssVar('--card') || (dark ? '#09090b' : '#ffffff'),
  }
}

const stats = computed(() => statsQuery.data.value)

const cards = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { id: 'total', label: 'Total postulaciones', value: s.total, icon: BriefcaseIcon },
    {
      id: 'active',
      label: 'En proceso',
      value: s.active,
      icon: TimerIcon,
      hint: `${s.byStage.applied + s.byStage.interview + s.byStage.offer} en aplicada/entrevista/oferta`,
    },
    { id: 'offers', label: 'Ofertas recibidas', value: s.byStage.offer, icon: HandshakeIcon },
    {
      id: 'response',
      label: 'Tasa de respuesta',
      value: `${s.responseRate}%`,
      icon: PercentIcon,
      hint: `${s.byStage.offer + s.byStage.rejected} con desenlace`,
    },
  ]
})

const barOption = computed(() => {
  const palette = chartPalette()
  const option = {
    backgroundColor: 'transparent',
    textStyle: { color: palette.text },
    grid: { left: 8, right: 8, top: 24, bottom: 8, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: stats.value?.byMonth.map((m) => m.label) ?? [],
      axisLine: { lineStyle: { color: palette.border } },
      axisTick: { show: false },
      axisLabel: { color: palette.text },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: palette.border, opacity: 0.6 } },
      axisLabel: { color: palette.text },
    },
    series: [
      {
        name: 'Postulaciones',
        type: 'bar',
        data: stats.value?.byMonth.map((m) => m.count) ?? [],
        itemStyle: { color: palette.primary, borderRadius: [6, 6, 0, 0] },
        barMaxWidth: 32,
      },
    ],
  } satisfies EChartsOption
  return option
})

const pieOption = computed(() => {
  const palette = chartPalette()
  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: palette.text },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: 'Etapa',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: palette.card, borderWidth: 2 },
        label: { show: false },
        data:
          stats.value?.byStage
            ? Object.entries(stats.value.byStage).map(([stage, count]) => ({
                name: STAGE_META[stage as keyof typeof STAGE_META].label,
                value: count,
                itemStyle: { color: STAGE_COLORS[stage] },
              }))
            : [],
      },
    ],
  } satisfies EChartsOption
  return option
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-sm text-muted-foreground">
        Resumen de tu búsqueda de empleo y actividad reciente.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Resumen de postulaciones">
      <Card v-for="card in cards" :key="card.label">
        <CardHeader class="flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>{{ card.label }}</CardDescription>
          <component :is="card.icon" class="size-4 text-muted-foreground" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <p class="text-2xl font-bold tabular-nums" :data-testid="`stat-${card.id}`">
            {{ card.value }}
          </p>
          <p v-if="card.hint" class="mt-0.5 text-xs text-muted-foreground">{{ card.hint }}</p>
        </CardContent>
      </Card>
      <Card v-if="!stats" class="grid-cols-2 lg:grid-cols-4">
        <CardHeader class="space-y-0 pb-2">
          <Skeleton class="h-4 w-24" />
        </CardHeader>
        <CardContent class="space-y-2">
          <Skeleton class="h-8 w-16" />
          <Skeleton class="h-3 w-28" />
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 lg:grid-cols-5">
      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Postulaciones por mes</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCharts
            v-if="stats"
            :option="barOption"
            label="Gráfica de postulaciones por mes"
          />
          <Skeleton v-else class="h-64 w-full" />
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribución por etapa</CardTitle>
          <CardDescription>Dónde está cada postulación</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCharts
            v-if="stats"
            :option="pieOption"
            label="Gráfica de distribución por etapa"
          />
          <Skeleton v-else class="h-64 w-full" />
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
        <CardDescription>Postulaciones actualizadas más recientemente</CardDescription>
      </CardHeader>
      <CardContent>
        <ul v-if="stats && stats.recent.length" class="divide-y">
          <li
            v-for="app in stats.recent"
            :key="app.id"
            class="flex items-center gap-3 py-2.5 text-sm"
          >
            <span
              :class="[
                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                app.stage === 'offer'
                  ? 'bg-emerald-500'
                  : app.stage === 'rejected'
                    ? 'bg-rose-500'
                    : app.stage === 'interview'
                      ? 'bg-amber-500'
                      : 'bg-sky-500',
              ]"
              aria-hidden="true"
            >
              {{ app.company.charAt(0) }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium">{{ app.company }} — {{ app.position }}</p>
              <p class="truncate text-xs text-muted-foreground">
                {{ STAGE_META[app.stage].label }}
              </p>
            </div>
            <time class="shrink-0 text-xs text-muted-foreground">
              {{ formatRelativeDate(app.updatedAt) }}
            </time>
          </li>
        </ul>
        <div v-else-if="stats" class="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <CheckCircle2Icon class="size-4" aria-hidden="true" />
          Aún no hay postulaciones registradas.
        </div>
        <div v-else class="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2Icon class="size-4 animate-spin" aria-hidden="true" />
          Cargando actividad…
        </div>
      </CardContent>
    </Card>
  </div>
</template>
