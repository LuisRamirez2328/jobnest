import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

type FakeMatchMedia = (query: string) => {
  matches: boolean
  media: string
  addEventListener: () => void
  removeEventListener: () => void
}

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'matchMedia',
      vi
        .fn<FakeMatchMedia>()
        .mockImplementation((query: string) => ({
          matches: false,
          media: query,
          addEventListener: vi.fn<() => void>(),
          removeEventListener: vi.fn<() => void>(),
        })),
    )
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('aplica el tema claro por defecto', () => {
    const store = useThemeStore()
    expect(store.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('lee el tema guardado en localStorage', () => {
    localStorage.setItem('jobnest-theme', 'dark')
    const store = useThemeStore()
    store.apply()
    expect(store.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('persiste y aplica el cambio de tema', () => {
    const store = useThemeStore()
    store.toggle()
    expect(store.theme).toBe('dark')
    expect(localStorage.getItem('jobnest-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    store.toggle()
    expect(store.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('usa la preferencia del sistema cuando no hay tema guardado', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn<FakeMatchMedia>().mockImplementation((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: vi.fn<() => void>(),
        removeEventListener: vi.fn<() => void>(),
      })),
    )
    const store = useThemeStore()
    expect(store.theme).toBe('dark')
  })
})
