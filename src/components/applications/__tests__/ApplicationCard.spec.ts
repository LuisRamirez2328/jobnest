import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationCard from '@/components/applications/ApplicationCard.vue'
import type { Application } from '@/services/types'

const app: Application = {
  id: 'c1',
  company: 'Acme Cloud',
  position: 'Frontend Developer',
  location: 'Ciudad de México',
  workMode: 'remote',
  stage: 'interview',
  salaryMin: 45000,
  salaryMax: 60000,
  appliedAt: '2026-07-01',
  updatedAt: '2026-08-10',
  notes: '',
}

describe('ApplicationCard', () => {
  it('muestra la empresa, el puesto y la modalidad', () => {
    const wrapper = mount(ApplicationCard, { props: { application: app } })
    expect(wrapper.text()).toContain('Acme Cloud')
    expect(wrapper.text()).toContain('Frontend Developer')
    expect(wrapper.text()).toContain('Remoto')
  })

  it('emite open al hacer clic', async () => {
    const wrapper = mount(ApplicationCard, { props: { application: app } })
    await wrapper.find('article').trigger('click')
    expect(wrapper.emitted('open')?.[0]).toEqual([app])
  })

  it('emite open al presionar Enter', async () => {
    const wrapper = mount(ApplicationCard, { props: { application: app } })
    const article = wrapper.find('article').element
    article.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open')).toHaveLength(1)
  })

  it('está marcada como arrastrable para accesibilidad', () => {
    const wrapper = mount(ApplicationCard, { props: { application: app } })
    expect(wrapper.find('article').attributes('draggable')).toBe('true')
  })
})
