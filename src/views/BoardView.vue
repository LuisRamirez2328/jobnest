<script setup lang="ts">
import { useApplications } from '@/composables/useApplications'
import { useApplicationModals } from '@/composables/useApplicationModals'
import KanbanBoard from '@/components/applications/KanbanBoard.vue'
import ApplicationDetail from '@/components/applications/ApplicationDetail.vue'
import ApplicationDialog from '@/components/applications/ApplicationDialog.vue'
import { Skeleton } from '@/components/ui/skeleton'
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

const { data: applications, isLoading } = useApplications()

const modals = useApplicationModals()

function onDeleteById(id: string) {
  const app = applications.value?.find((a) => a.id === id)
  if (app) modals.requestDelete(app)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p class="text-sm text-muted-foreground">
          Arrastra las tarjetas entre etapas o usa el menú de cada una.
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-72 w-full" />
    </div>

    <KanbanBoard
      v-else
      :applications="applications ?? []"
      @open="modals.openDetail"
      @move="modals.move"
      @edit="modals.openEdit"
      @delete="onDeleteById"
      @create="modals.openCreate"
    />

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

    <ApplicationDialog
      v-model:open="modals.createOpen"
      :application="null"
      :initial-stage="modals.createStage"
    />

    <AlertDialog v-model:open="modals.deleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta postulación?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará de forma permanente la postulación en
            {{ modals.deleteTarget?.company }} para el puesto de
            {{ modals.deleteTarget?.position }}. Esta acción no se puede deshacer.
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
