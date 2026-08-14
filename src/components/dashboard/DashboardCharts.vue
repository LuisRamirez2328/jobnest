<script setup lang="ts">
import { onMounted, shallowRef, ref } from 'vue'
import type { Component } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  option: EChartsOption
  label: string
}>()

const ready = ref(false)
const VChart = shallowRef<Component | null>(null)

onMounted(async () => {
  const [
    { use },
    { CanvasRenderer },
    { BarChart, PieChart },
    { GridComponent, LegendComponent, TitleComponent, TooltipComponent },
    echartsModule,
  ] = await Promise.all([
    import('echarts/core'),
    import('echarts/renderers'),
    import('echarts/charts'),
    import('echarts/components'),
    import('vue-echarts'),
  ])
  use([
    CanvasRenderer,
    BarChart,
    PieChart,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
  ])
  VChart.value = echartsModule.default
  ready.value = true
})
</script>

<template>
  <div v-if="ready && VChart" class="h-64">
    <component :is="VChart" :option="props.option" autoresize :aria-label="props.label" />
  </div>
  <Skeleton v-else class="h-64 w-full" />
</template>
