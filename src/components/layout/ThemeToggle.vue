<script setup lang="ts">
import { MoonIcon, SunIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    class="size-9"
    :aria-label="themeStore.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="themeStore.toggle()"
  >
    <MoonIcon v-if="themeStore.theme === 'dark'" class="size-4" aria-hidden="true" />
    <SunIcon v-else class="size-4" aria-hidden="true" />
  </Button>
</template>
