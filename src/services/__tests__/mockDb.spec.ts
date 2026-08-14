import { beforeEach, describe, expect, it } from 'vitest'
import { mockDb } from '@/services/mockDb'
import type { ApplicationInput } from '@/services/types'

const validInput: ApplicationInput = {
  company: 'Nueva Empresa',
  position: 'Fullstack Developer',
  location: 'Remoto',
  workMode: 'remote',
  stage: 'applied',
  salaryMin: 50000,
  salaryMax: 70000,
  notes: 'Postulación de prueba.',
}

describe('mockDb', () => {
  beforeEach(() => {
    mockDb.reset()
  })

  it('devuelve la lista de postulaciones del seed', () => {
    const list = mockDb.list()
    expect(list.length).toBe(14)
    expect(list[0]).toHaveProperty('id')
  })

  it('no expone referencias internas (copia defensiva)', () => {
    const first = mockDb.list()[0]!
    first.company = 'Mutada'
    expect(mockDb.find(first.id)?.company).not.toBe('Mutada')
  })

  it('crea una postulación con id y fechas', () => {
    const created = mockDb.create(validInput)
    expect(created.id).toBeTruthy()
    expect(created.appliedAt).toBeTruthy()
    expect(created.updatedAt).toBeTruthy()
    expect(mockDb.find(created.id)).toEqual(created)
  })

  it('actualiza una postulación existente', () => {
    const created = mockDb.create(validInput)
    const updated = mockDb.update(created.id, { stage: 'interview' })
    expect(updated?.stage).toBe('interview')
    expect(updated?.company).toBe(validInput.company)
  })

  it('devuelve undefined al actualizar un id inexistente', () => {
    expect(mockDb.update('no-existe', { stage: 'offer' })).toBeUndefined()
  })

  it('elimina una postulación', () => {
    const created = mockDb.create(validInput)
    expect(mockDb.remove(created.id)).toBe(true)
    expect(mockDb.find(created.id)).toBeUndefined()
    expect(mockDb.remove(created.id)).toBe(false)
  })
})
