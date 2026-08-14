import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import ApplicationDialog from '@/components/applications/ApplicationDialog.vue'
import { mountWithProviders } from '@/__tests__/helpers'

vi.mock('@/services/api', () => ({
  api: {
    createApplication: vi.fn<() => Promise<Application>>(),
    updateApplication: vi.fn<() => Promise<Application>>(),
  },
}))

import { api } from '@/services/api'
import type { Application, ApplicationInput } from '@/services/types'

const mockedCreate = vi.mocked(api.createApplication)
const mockedUpdate = vi.mocked(api.updateApplication)

const existing: Application = {
  id: 'a1',
  company: 'Acme Cloud',
  position: 'Frontend Developer',
  location: 'CDMX',
  workMode: 'remote',
  stage: 'interview',
  appliedAt: '2026-07-01',
  updatedAt: '2026-08-01',
  notes: 'Primera nota.',
}

function created(input: ApplicationInput): Application {
  return { ...input, id: 'new-1', appliedAt: '2026-08-14', updatedAt: '2026-08-14' }
}

beforeEach(() => {
  mockedCreate.mockReset()
  mockedUpdate.mockReset()
  mockedCreate.mockResolvedValue(created({} as ApplicationInput))
  mockedUpdate.mockResolvedValue(existing)
  document.body.innerHTML = ''
})

function mountDialog(props: Record<string, unknown>) {
  const wrapper = mountWithProviders(ApplicationDialog, {
    props,
    attachTo: document.body,
  })
  return wrapper
}

function submitForm() {
  const form = document.querySelector('form') as HTMLFormElement
  expect(form).toBeTruthy()
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
}

describe('ApplicationDialog', () => {
  it('muestra errores de validación al enviar vacío', async () => {
    const wrapper = mountDialog({ open: true, application: null })
    await flushPromises()

    submitForm()
    await vi.waitFor(() => {
      expect(mockedCreate).not.toHaveBeenCalled()
      expect(document.body.textContent).toContain('El nombre de la empresa es obligatorio')
      expect(document.body.textContent).toContain('El puesto es obligatorio')
    })

    wrapper.unmount()
  })

  it('crea una postulación al completar los campos obligatorios', async () => {
    const wrapper = mountDialog({ open: true, application: null })
    await flushPromises()

    const company = document.getElementById('company') as HTMLInputElement
    const position = document.getElementById('position') as HTMLInputElement
    expect(company).toBeTruthy()
    company.value = 'Nueva Corp'
    position.value = 'Fullstack Dev'
    company.dispatchEvent(new Event('input', { bubbles: true }))
    position.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()

    submitForm()
    await vi.waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledTimes(1)
    })

    const input = mockedCreate.mock.calls[0]![0]
    expect(input.company).toBe('Nueva Corp')
    expect(input.position).toBe('Fullstack Dev')
    expect(input.stage).toBe('applied')
    expect(wrapper.emitted('saved')).toHaveLength(1)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('actualiza la postulación en modo edición', async () => {
    const wrapper = mountDialog({ open: true, application: existing })
    await flushPromises()

    const company = document.getElementById('company') as HTMLInputElement
    expect(company).toBeTruthy()
    company.value = 'Acme Renombrada'
    company.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()

    submitForm()
    await vi.waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledTimes(1)
    })

    const [id, patch] = mockedUpdate.mock.calls[0]!
    expect(id).toBe('a1')
    expect(patch.company).toBe('Acme Renombrada')
    expect(wrapper.emitted('saved')).toHaveLength(1)

    wrapper.unmount()
  })
})
