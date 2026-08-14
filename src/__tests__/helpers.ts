import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions } from '@vue/test-utils'
import type { Component } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

export function mountWithProviders(
  component: Component,
  options: ComponentMountingOptions<Component> = {},
) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const queryClient = createTestQueryClient()
  return mount(component, {
    ...options,
    global: {
      plugins: [pinia, [VueQueryPlugin, { queryClient }]],
      ...options.global,
    },
  })
}
