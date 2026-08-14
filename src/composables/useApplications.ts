import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { api } from '@/services/api'
import { DEFAULT_FILTERS } from '@/services/types'
import type {
  ApplicationFilters,
  ApplicationInput,
  ApplicationStage,
} from '@/services/types'

export function useApplications(filters?: MaybeRefOrGetter<ApplicationFilters>) {
  const resolved = computed(() => toValue(filters ?? DEFAULT_FILTERS))
  return useQuery({
    queryKey: computed(() => ['applications', resolved.value]),
    queryFn: () => api.listApplications(resolved.value),
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['applications', 'stats'],
    queryFn: () => api.getStats(),
  })
}

function useInvalidateApplications() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] })
  }
}

export function useCreateApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({
    mutationFn: (input: ApplicationInput) => api.createApplication(input),
    onSuccess: invalidate,
  })
}

export function useUpdateApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ApplicationInput> }) =>
      api.updateApplication(id, patch),
    onSuccess: invalidate,
  })
}

export function useDeleteApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({
    mutationFn: (id: string) => api.deleteApplication(id),
    onSuccess: invalidate,
  })
}

export function useMoveApplication() {
  const invalidate = useInvalidateApplications()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: ApplicationStage }) =>
      api.moveApplication(id, stage),
    onSuccess: invalidate,
  })
}
