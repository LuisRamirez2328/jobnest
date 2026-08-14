<script setup lang="ts">
import { computed } from 'vue'
import {
  BuildingIcon,
  CalendarClockIcon,
  MoreVerticalIcon,
  PenLineIcon,
  Trash2Icon,
  ArrowLeftRightIcon,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import StageBadge from './StageBadge.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STAGES, STAGE_META, WORK_MODE_META } from '@/services/types'
import type { Application, ApplicationStage } from '@/services/types'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'

const props = defineProps<{ application: Application }>()
const emit = defineEmits<{
  open: [app: Application]
  move: [id: string, stage: ApplicationStage]
  edit: [app: Application]
  delete: [id: string]
  dragstart: [id: string]
  dragend: []
}>()

const otherStages = computed(() =>
  STAGES.filter((s) => s !== props.application.stage),
)

const salary = computed(() => {
  const { salaryMin, salaryMax } = props.application
  if (salaryMin == null && salaryMax == null) return ''
  if (salaryMin != null && salaryMax != null)
    return `${formatCurrency(salaryMin)} – ${formatCurrency(salaryMax)}`
  return formatCurrency(salaryMin ?? salaryMax ?? 0)
})

const workMode = computed(
  () => WORK_MODE_META[props.application.workMode].short,
)

function open() {
  emit('open', props.application)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    open()
  }
}

function onDragStart(event: DragEvent) {
  event.dataTransfer?.setData('text/plain', props.application.id)
  emit('dragstart', props.application.id)
}

function onDragEnd() {
  emit('dragend')
}
</script>

<template>
  <article
    class="group relative cursor-grab rounded-lg border bg-card p-3 text-left shadow-xs transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
    tabindex="0"
    role="button"
    :aria-label="`Abrir ${application.company} — ${application.position}`"
    draggable="true"
    @click="open"
    @keydown="onKeydown"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold">{{ application.company }}</p>
        <p class="truncate text-xs text-muted-foreground">
          {{ application.position }}
        </p>
      </div>
      <DropdownMenu :data-reka-collection-item-ignore="''">
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            class="relative -mr-1 -mt-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            :aria-label="`Acciones para ${application.company}`"
            @click.stop
          >
            <MoreVerticalIcon class="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-52">
          <DropdownMenuItem
            v-for="stage in otherStages"
            :key="stage"
            class="gap-2"
            @click.stop="emit('move', application.id, stage)"
          >
            <span
              :class="['size-2 rounded-full', STAGE_META[stage].dot]"
              aria-hidden="true"
            />
            Mover a {{ STAGE_META[stage].label.toLowerCase() }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2" @click.stop="emit('edit', application)">
            <PenLineIcon class="size-4" aria-hidden="true" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            class="gap-2 text-destructive focus:text-destructive"
            @click.stop="emit('delete', application.id)"
          >
            <Trash2Icon class="size-4" aria-hidden="true" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <dl class="mt-2.5 space-y-1 text-xs text-muted-foreground">
      <div class="flex items-center gap-1.5">
        <BuildingIcon class="size-3.5" aria-hidden="true" />
        <span>{{ application.location }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ workMode }}</span>
      </div>
      <div v-if="salary" class="flex items-center gap-1.5 font-medium text-foreground/80">
        <span class="inline-flex items-center gap-1.5">
          <span aria-hidden="true">$</span>
          <span>{{ salary }}</span>
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <CalendarClockIcon class="size-3.5" aria-hidden="true" />
        <span>{{ formatRelativeDate(application.appliedAt) }}</span>
      </div>
    </dl>

    <div class="mt-3 flex items-center justify-between gap-2">
      <StageBadge :stage="application.stage" />
      <span class="flex items-center gap-1 text-[11px] text-muted-foreground" aria-hidden="true">
        <ArrowLeftRightIcon class="size-3" />
        mover
      </span>
    </div>
  </article>
</template>
