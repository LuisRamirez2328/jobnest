import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_FILTERS } from '@/services/types'
import type { ApplicationFilters } from '@/services/types'

export const useFiltersStore = defineStore('filters', () => {
  const filters = reactive<ApplicationFilters>({ ...DEFAULT_FILTERS })

  function reset() {
    Object.assign(filters, DEFAULT_FILTERS)
  }

  return { filters, reset }
})
