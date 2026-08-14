<script setup lang="ts">
import { computed } from 'vue'
import { PlusIcon, InboxIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import ApplicationFilters from '@/components/applications/ApplicationFilters.vue'
import ApplicationDetail from '@/components/applications/ApplicationDetail.vue'
import ApplicationDialog from '@/components/applications/ApplicationDialog.vue'
import StageBadge from '@/components/applications/StageBadge.vue'
import { useApplications } from '@/composables/useApplications'
import { useApplicationModals } from '@/composables/useApplicationModals'
import { useFiltersStore } from '@/stores/filters'
import { WORK_MODE_META } from '@/services/types'
import { formatDate, formatCurrency } from '@/lib/utils'

const filtersStore = useFiltersStore()
const { data: applications, isLoading } = useApplications(filtersStore.filters)
const modals = useApplicationModals()

const sorted = computed(() =>
  [...(applications.value ?? [])].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  ),
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Postulaciones</h1>
        <p class="text-sm text-muted-foreground">
          Administra todas tus candidaturas con filtros y orden.
        </p>
      </div>
      <Button @click="modals.openCreate()">
        <PlusIcon class="size-4" aria-hidden="true" />
        Nueva postulación
      </Button>
    </div>

    <ApplicationFilters />

    <div v-if="isLoading" class="space-y-2">
      <Skeleton v-for="i in 5" :key="i" class="h-12 w-full" />
    </div>

    <div
      v-else-if="sorted.length === 0"
      class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30 py-16 text-center"
    >
      <InboxIcon class="size-10 text-muted-foreground/60" aria-hidden="true" />
      <div>
        <p class="font-medium">No hay postulaciones</p>
        <p class="text-sm text-muted-foreground">
          Ajusta los filtros o crea una nueva postulación para comenzar.
        </p>
      </div>
    </div>

    <div v-else class="rounded-lg border bg-card">
      <Table>
        <TableCaption class="sr-only">Lista de postulaciones</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[24%]">Empresa</TableHead>
            <TableHead>Puesto</TableHead>
            <TableHead class="hidden md:table-cell">Modalidad</TableHead>
            <TableHead class="hidden sm:table-cell">Salario</TableHead>
            <TableHead class="hidden lg:table-cell">Aplicada</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead class="w-10"><span class="sr-only">Acciones</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="app in sorted"
            :key="app.id"
            class="cursor-pointer"
            @click="modals.openDetail(app)"
          >
            <TableCell class="font-medium">{{ app.company }}</TableCell>
            <TableCell>{{ app.position }}</TableCell>
            <TableCell class="hidden text-muted-foreground md:table-cell">
              {{ WORK_MODE_META[app.workMode].label }}
            </TableCell>
            <TableCell class="hidden text-muted-foreground sm:table-cell">
              {{
                app.salaryMin != null && app.salaryMax != null
                  ? `${formatCurrency(app.salaryMin)} – ${formatCurrency(app.salaryMax)}`
                  : '—'
              }}
            </TableCell>
            <TableCell class="hidden text-muted-foreground lg:table-cell">
              {{ formatDate(app.appliedAt) }}
            </TableCell>
            <TableCell>
              <StageBadge :stage="app.stage" />
            </TableCell>
            <TableCell>
              <span class="text-muted-foreground/50">›</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <ApplicationDetail
      v-model:open="modals.detailOpen"
      :application="modals.detailApp"
      @edit="modals.openEdit"
      @delete="modals.requestDelete"
      @move="modals.move"
    />

    <ApplicationDialog
      v-model:open="modals.editOpen"
      :application="modals.editApp"
    />

    <ApplicationDialog v-model:open="modals.createOpen" :application="null" />

    <AlertDialog v-model:open="modals.deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta postulación?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará de forma permanente la postulación en
            {{ modals.deleteTarget?.company }}. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="modals.confirmDelete">Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
