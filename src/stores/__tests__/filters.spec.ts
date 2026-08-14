import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import { DEFAULT_FILTERS } from '@/services/types'

describe('useFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicializa con los filtros por defecto', () => {
    const store = useFiltersStore()
    expect(store.filters).toEqual(DEFAULT_FILTERS)
  })

  it('actualiza los filtros', () => {
    const store = useFiltersStore()
    store.filters.search = 'acme'
    store.filters.stage = 'offer'
    expect(store.filters.search).toBe('acme')
    expect(store.filters.stage).toBe('offer')
  })

  it('restablece los filtros a los valores por defecto', () => {
    const store = useFiltersStore()
    store.filters.search = 'acme'
    store.filters.stage = 'offer'
    store.filters.workMode = 'remote'
    store.filters.sort = 'company'
    store.reset()
    expect(store.filters).toEqual(DEFAULT_FILTERS)
  })
})
