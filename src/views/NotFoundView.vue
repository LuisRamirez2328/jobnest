<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CompassIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
    <span
      class="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
    >
      <CompassIcon class="size-6" aria-hidden="true" />
    </span>
    <div>
      <p class="text-4xl font-bold tracking-tight">404</p>
      <h1 class="mt-1 text-lg font-semibold">Página no encontrada</h1>
      <p class="mt-1 max-w-sm text-sm text-muted-foreground">
        La ruta que buscas no existe o fue movida. Vuelve al inicio para seguir
        gestionando tus postulaciones.
      </p>
    </div>
    <RouterLink to="/">
      <Button>Ir al dashboard</Button>
    </RouterLink>
  </div>
</template>
