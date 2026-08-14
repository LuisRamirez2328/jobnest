import { beforeEach, describe, expect, it } from 'vitest'
import { mockDb } from '@/services/mockDb'
import { api, computeStats } from '@/services/api'
import { DEFAULT_FILTERS } from '@/services/types'
import type { ApplicationInput } from '@/services/types'

const validInput: ApplicationInput = {
  company: 'Nueva Empresa',
  position: 'Fullstack Developer',
  location: 'Remoto',
  workMode: 'remote',
  stage: 'applied',
  notes: 'Postulación de prueba.',
}

describe('api.listApplications', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('devuelve todas las postulaciones con filtros por defecto', async () => {
    const list = await api.listApplications(DEFAULT_FILTERS)
    expect(list.length).toBe(14)
  })

  it('filtra por texto de búsqueda (empresa)', async () => {
    const list = await api.listApplications({
      ...DEFAULT_FILTERS,
      search: 'acme',
    })
    expect(list.length).toBe(1)
    expect(list[0]!.company).toBe('Acme Cloud')
  })

  it('filtra por texto de búsqueda (puesto)', async () => {
    const list = await api.listApplications({
      ...DEFAULT_FILTERS,
      search: 'vue developer',
    })
    expect(list.length).toBeGreaterThanOrEqual(1)
    expect(list[0]!.position.toLowerCase().includes('vue')).toBe(true)
  })

  it('filtra por etapa', async () => {
    const list = await api.listApplications({
      ...DEFAULT_FILTERS,
      stage: 'offer',
    })
    expect(list.every((a) => a.stage === 'offer')).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it('filtra por modalidad', async () => {
    const list = await api.listApplications({
      ...DEFAULT_FILTERS,
      workMode: 'onsite',
    })
    expect(list.every((a) => a.workMode === 'onsite')).toBe(true)
  })

  it('ordena por empresa (A-Z)', async () => {
    const list = await api.listApplications({
      ...DEFAULT_FILTERS,
      sort: 'company',
    })
    const names = list.map((a) => a.company)
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names)
  })

  it('ordena por recientes por defecto', async () => {
    const list = await api.listApplications(DEFAULT_FILTERS)
    const dates = list.map((a) => a.updatedAt)
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates)
  })
})

describe('api CRUD', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('crea y consulta una postulación', async () => {
    const created = await api.createApplication(validInput)
    expect(created.id).toBeTruthy()
    const found = await api.getApplication(created.id)
    expect(found?.company).toBe('Nueva Empresa')
  })

  it('actualiza una postulación', async () => {
    const created = await api.createApplication(validInput)
    const updated = await api.updateApplication(created.id, { stage: 'interview' })
    expect(updated.stage).toBe('interview')
  })

  it('lanza error al actualizar un id inexistente', async () => {
    await expect(
      api.updateApplication('no-existe', { stage: 'offer' }),
    ).rejects.toThrow('La postulación no existe')
  })

  it('mueve una postulación de etapa', async () => {
    const created = await api.createApplication(validInput)
    const moved = await api.moveApplication(created.id, 'offer')
    expect(moved.stage).toBe('offer')
  })

  it('elimina una postulación', async () => {
    const created = await api.createApplication(validInput)
    await api.deleteApplication(created.id)
    expect(await api.getApplication(created.id)).toBeUndefined()
  })
})

describe('computeStats', () => {
  it('calcula total, activas, ofertas y tasa de respuesta', () => {
    const apps = [
      { ...validInput, id: '1', stage: 'interview' as const },
      { ...validInput, id: '2', stage: 'offer' as const },
      { ...validInput, id: '3', stage: 'rejected' as const },
    ].map((a, i) => ({
      ...a,
      appliedAt: `2026-0${i + 1}-10`,
      updatedAt: `2026-0${i + 1}-10`,
    }))

    const stats = computeStats(apps)
    expect(stats.total).toBe(3)
    expect(stats.active).toBe(1)
    expect(stats.interviews).toBe(1)
    expect(stats.offers).toBe(1)
    expect(stats.responseRate).toBe(67)
    expect(stats.byStage.interview).toBe(1)
    expect(stats.byStage.offer).toBe(1)
    expect(stats.byStage.rejected).toBe(1)
  })

  it('agrupa por mes y expone los recientes', () => {
    const apps = [
      { ...validInput, id: '1', appliedAt: '2026-01-10', updatedAt: '2026-01-10' },
      { ...validInput, id: '2', appliedAt: '2026-01-20', updatedAt: '2026-02-05' },
    ]
    const stats = computeStats(apps)
    expect(stats.byMonth).toEqual([
      { label: 'Ene', count: 2 },
    ])
    expect(stats.recent[0]!.id).toBe('2')
  })

  it('devuelve tasa de respuesta 0 sin postulaciones', () => {
    const stats = computeStats([])
    expect(stats.total).toBe(0)
    expect(stats.responseRate).toBe(0)
    expect(stats.byStage).toEqual({
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    })
  })
})
