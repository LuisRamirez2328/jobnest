import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import type { Application, ApplicationStage } from '@/services/types'
import {
  useDeleteApplication,
  useMoveApplication,
} from './useApplications'

export function useApplicationModals() {
  const detailApp = ref<Application | null>(null)
  const detailOpen = ref(false)
  const editApp = ref<Application | null>(null)
  const editOpen = ref(false)
  const deleteTarget = ref<Application | null>(null)
  const deleteOpen = ref(false)
  const createStage = ref<ApplicationStage>('applied')
  const createOpen = ref(false)

  const deleteMutation = useDeleteApplication()
  const moveMutation = useMoveApplication()

  function openDetail(app: Application) {
    detailApp.value = app
    detailOpen.value = true
  }

  function openEdit(app: Application) {
    detailOpen.value = false
    editApp.value = app
    editOpen.value = true
  }

  function openCreate(stage: ApplicationStage = 'applied') {
    createStage.value = stage
    createOpen.value = true
  }

  function requestDelete(app: Application) {
    detailOpen.value = false
    deleteTarget.value = app
    deleteOpen.value = true
  }

  function confirmDelete() {
    if (!deleteTarget.value) return
    deleteMutation.mutate(deleteTarget.value.id, {
      onSuccess: () => {
        toast.success('Postulación eliminada')
        deleteOpen.value = false
        deleteTarget.value = null
      },
      onError: () => {
        toast.error('No se pudo eliminar la postulación')
      },
    })
  }

  function move(id: string, stage: ApplicationStage) {
    moveMutation.mutate(
      { id, stage },
      {
        onSuccess: () => {
          if (detailApp.value?.id === id) {
            detailApp.value = { ...detailApp.value, stage }
          }
          toast.success('Etapa actualizada')
        },
        onError: () => {
          toast.error('No se pudo actualizar la etapa')
        },
      },
    )
  }

  return reactive({
    detailApp,
    detailOpen,
    editApp,
    editOpen,
    deleteTarget,
    deleteOpen,
    createStage,
    createOpen,
    openDetail,
    openEdit,
    openCreate,
    requestDelete,
    confirmDelete,
    move,
  })
}
