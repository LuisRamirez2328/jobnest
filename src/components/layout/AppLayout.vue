<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { BriefcaseBusinessIcon } from '@lucide/vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/board', label: 'Pipeline' },
  { to: '/applications', label: 'Postulaciones' },
]
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header
      class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div class="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold" aria-label="JobNest inicio">
          <span
            class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <BriefcaseBusinessIcon class="size-4" aria-hidden="true" />
          </span>
          <span class="text-sm">JobNest</span>
        </RouterLink>

        <nav class="flex items-center gap-1 text-sm" aria-label="Navegación principal">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            active-class="bg-accent font-medium text-accent-foreground"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <RouterView />
    </main>

    <footer class="border-t py-4 text-center text-xs text-muted-foreground">
      JobNest · tu rastreador de postulaciones · datos de demostración en memoria
    </footer>
  </div>
</template>
