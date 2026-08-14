<script setup lang="ts">
import { computed } from 'vue'
import {
  BuildingIcon,
  CalendarDaysIcon,
  CoinsIcon,
  Link2Icon,
  MailIcon,
  MapPinIcon,
  NotebookPenIcon,
  PenLineIcon,
  UserIcon,
  Trash2Icon,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { STAGES, STAGE_META, WORK_MODE_META } from '@/services/types'
import type { Application, ApplicationStage } from '@/services/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const props = defineProps<{
  open: boolean
  application: Application | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  edit: [app: Application]
  delete: [app: Application]
  move: [id: string, stage: ApplicationStage]
}>()

const salary = computed(() => {
  if (!props.application) return ''
  const { salaryMin, salaryMax } = props.application
  if (salaryMin == null && salaryMax == null) return 'No especificado'
  if (salaryMin != null && salaryMax != null)
    return `${formatCurrency(salaryMin)} – ${formatCurrency(salaryMax)}`
  return formatCurrency(salaryMin ?? salaryMax ?? 0)
})

const workMode = computed(() =>
  props.application ? WORK_MODE_META[props.application.workMode].label : '',
)

function changeStage(stage: ApplicationStage) {
  if (props.application && stage !== props.application.stage) {
    emit('move', props.application.id, stage)
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent v-if="application" class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle class="flex flex-wrap items-center gap-2 pr-6">
          <span class="truncate">{{ application.company }}</span>
        </DialogTitle>
        <DialogDescription class="text-sm">
          {{ application.position }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 text-sm">
        <div class="flex flex-wrap items-center gap-2">
          <Badge
            :style="{}"
            class="gap-1.5"
            :class="[
              application.stage === 'offer'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : application.stage === 'rejected'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'border-primary/30 bg-primary/10 text-primary',
            ]"
          >
            <span
              :class="['size-1.5 rounded-full', STAGE_META[application.stage].dot]"
              aria-hidden="true"
            />
            {{ STAGE_META[application.stage].label }}
          </Badge>

          <div class="ml-auto">
            <Select :model-value="application.stage" @update:model-value="changeStage($event as ApplicationStage)">
              <SelectTrigger class="h-8 w-auto gap-2 text-xs" aria-label="Cambiar etapa">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="s in STAGES" :key="s" :value="s">
                  {{ STAGE_META[s].label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div class="flex items-start gap-2 text-muted-foreground">
            <BuildingIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Empresa</dt>
              <dd class="font-medium text-foreground">{{ application.company }}</dd>
            </div>
          </div>
          <div class="flex items-start gap-2 text-muted-foreground">
            <MapPinIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Ubicación</dt>
              <dd class="font-medium text-foreground">
                {{ application.location || 'No especificada' }} · {{ workMode }}
              </dd>
            </div>
          </div>
          <div class="flex items-start gap-2 text-muted-foreground">
            <CoinsIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Salario</dt>
              <dd class="font-medium text-foreground">{{ salary }}</dd>
            </div>
          </div>
          <div class="flex items-start gap-2 text-muted-foreground">
            <CalendarDaysIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Aplicada</dt>
              <dd class="font-medium text-foreground">{{ formatDate(application.appliedAt) }}</dd>
            </div>
          </div>
          <div v-if="application.contactName" class="flex items-start gap-2 text-muted-foreground">
            <UserIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Contacto</dt>
              <dd class="font-medium text-foreground">{{ application.contactName }}</dd>
            </div>
          </div>
          <div v-if="application.contactEmail" class="flex items-start gap-2 text-muted-foreground">
            <MailIcon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <dt class="text-xs text-muted-foreground/70">Email</dt>
              <dd class="break-all font-medium text-foreground">
                <a
                  :href="`mailto:${application.contactEmail}`"
                  class="underline-offset-4 hover:underline"
                >
                  {{ application.contactEmail }}
                </a>
              </dd>
            </div>
          </div>
          <div
            v-if="application.url"
            class="flex items-start gap-2 text-muted-foreground sm:col-span-2"
          >
            <Link2Icon class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div class="min-w-0">
              <dt class="text-xs text-muted-foreground/70">Oferta</dt>
              <dd class="truncate font-medium text-foreground">
                <a
                  :href="application.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary underline-offset-4 hover:underline"
                >
                  {{ application.url }}
                </a>
              </dd>
            </div>
          </div>
        </dl>

        <div v-if="application.notes" class="rounded-md border bg-muted/50 p-3">
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <NotebookPenIcon class="size-3.5" aria-hidden="true" />
            Notas
          </div>
          <p class="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">
            {{ application.notes }}
          </p>
        </div>
      </div>

      <DialogFooter class="gap-2 sm:gap-2">
        <Button
          variant="destructive"
          size="sm"
          class="mr-auto"
          @click="emit('delete', application)"
        >
          <Trash2Icon class="size-4" aria-hidden="true" />
          Eliminar
        </Button>
        <Button variant="outline" size="sm" @click="emit('update:open', false)">
          Cerrar
        </Button>
        <Button size="sm" @click="emit('edit', application)">
          <PenLineIcon class="size-4" aria-hidden="true" />
          Editar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
