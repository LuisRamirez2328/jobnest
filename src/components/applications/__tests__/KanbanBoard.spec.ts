import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanBoard from '@/components/applications/KanbanBoard.vue'
import type { Application } from '@/services/types'

const apps: Application[] = [
  {
    id: '1',
    company: 'Acme',
    position: 'Frontend',
    location: 'CDMX',
    workMode: 'remote',
    stage: 'applied',
    appliedAt: '2026-07-01',
    updatedAt: '2026-07-01',
    notes: '',
  },
  {
    id: '2',
    company: 'Orbita',
    position: 'Vue Dev',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'interview',
    appliedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    notes: '',
  },
  {
    id: '3',
    company: 'Pixel',
    position: 'Engineer',
    location: 'GDL',
    workMode: 'hybrid',
    stage: 'applied',
    appliedAt: '2026-07-03',
    updatedAt: '2026-07-03',
    notes: '',
  },
]

describe('KanbanBoard', () => {
  it('agrupa las postulaciones por etapa con su contador', () => {
    const wrapper = mount(KanbanBoard, { props: { applications: apps } })
    const sections = wrapper.findAll('section[data-stage]')
    expect(sections).toHaveLength(4)

    const applied = wrapper.find('section[data-stage="applied"]')
    expect(applied.text()).toContain('Aplicada')
    expect(applied.text()).toContain('2')

    const interview = wrapper.find('section[data-stage="interview"]')
    expect(interview.text()).toContain('En entrevista')
    expect(interview.text()).toContain('1')
  })

  it('emite create con la etapa al pulsar el botón +', async () => {
    const wrapper = mount(KanbanBoard, { props: { applications: apps } })
    const offer = wrapper.find('section[data-stage="offer"]')
    await offer.find('button').trigger('click')
    expect(wrapper.emitted('create')?.[0]).toEqual(['offer'])
  })

  it('emite move al soltar una tarjeta arrastrada', async () => {
    const wrapper = mount(KanbanBoard, { props: { applications: apps } })

    // Simula el drag interno: inicia en una tarjeta y suelta en "offer".
    const appliedCard = wrapper.find('section[data-stage="applied"] article')
    const dragEvent = new Event('dragstart', { bubbles: true })
    ;(dragEvent as unknown as { dataTransfer: unknown }).dataTransfer = {
      setData: () => {},
    }
    appliedCard.element.dispatchEvent(dragEvent)

    const offer = wrapper.find('section[data-stage="offer"]')
    await offer.trigger('drop')
    expect(wrapper.emitted('move')?.[0]).toEqual(['1', 'offer'])
  })
})
