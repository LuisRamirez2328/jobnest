import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StageBadge from '@/components/applications/StageBadge.vue'
import { STAGES } from '@/services/types'

describe('StageBadge', () => {
  it.each(STAGES)('muestra la etiqueta de la etapa %s', (stage) => {
    const wrapper = mount(StageBadge, { props: { stage } })
    expect(wrapper.text()).toContain(
      {
        applied: 'Aplicada',
        interview: 'En entrevista',
        offer: 'Oferta',
        rejected: 'Descartada',
      }[stage],
    )
  })
})
