<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@lucide/vue'
import { STAGES, STAGE_META } from '@/services/types'
import type { Application, ApplicationStage } from '@/services/types'
import ApplicationCard from './ApplicationCard.vue'

defineProps<{ applications: Application[] }>()

const emit = defineEmits<{
  open: [app: Application]
  move: [id: string, stage: ApplicationStage]
  edit: [app: Application]
  delete: [id: string]
  create: [stage: ApplicationStage]
}>()

const draggedId = ref<string | null>(null)
const dragOverStage = ref<ApplicationStage | null>(null)

function byStage(apps: Application[], stage: ApplicationStage) {
  return apps.filter((app) => app.stage === stage)
}

function onDrop(stage: ApplicationStage) {
  if (draggedId.value) emit('move', draggedId.value, stage)
  draggedId.value = null
  dragOverStage.value = null
}

function onCardMove(id: string, stage: ApplicationStage) {
  emit('move', id, stage)
}

function onDragLeave(stage: ApplicationStage) {
  if (dragOverStage.value === stage) dragOverStage.value = null
}

function onCardDragStart(id: string) {
  draggedId.value = id
}

function onCardDragEnd() {
  draggedId.value = null
  dragOverStage.value = null
}
</script>

<template>
  <div
    class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
    aria-label="Tablero de postulaciones por etapa"
  >
    <section
      v-for="stage in STAGES"
      :key="stage"
      class="flex min-h-[60dvh] flex-col rounded-lg border bg-muted/30"
      :class="dragOverStage === stage ? 'ring-2 ring-primary/60' : ''"
      :data-stage="stage"
      @dragover.prevent="dragOverStage = stage"
      @dragleave="onDragLeave(stage)"
      @drop.prevent="onDrop(stage)"
    >
      <header class="flex items-center gap-2 border-b px-3 py-2.5">
        <span
          :class="['size-2 rounded-full', STAGE_META[stage].dot]"
          aria-hidden="true"
        />
        <h2 class="text-sm font-semibold">{{ STAGE_META[stage].label }}</h2>
        <span
          class="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
          :aria-label="`${byStage(applications, stage).length} postulaciones`"
        >
          {{ byStage(applications, stage).length }}
        </span>
        <button
          class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :aria-label="`Nueva postulación en ${STAGE_META[stage].label.toLowerCase()}`"
          @click="emit('create', stage)"
        >
          <PlusIcon class="size-4" aria-hidden="true" />
        </button>
      </header>

      <div class="flex flex-1 flex-col gap-3 p-3">
        <ApplicationCard
          v-for="app in byStage(applications, stage)"
          :key="app.id"
          :application="app"
          @open="emit('open', $event)"
          @move="onCardMove"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @dragstart="onCardDragStart"
          @dragend="onCardDragEnd"
        />

        <p v-if="byStage(applications, stage).length === 0" class="py-6 text-center text-xs text-muted-foreground">
          Arrastra una tarjeta aquí o crea una nueva postulación.
        </p>
      </div>
    </section>
  </div>
</template>
