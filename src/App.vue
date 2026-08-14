<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { useThemeStore } from '@/stores/theme'
import { Toaster } from '@/components/ui/sonner'

useThemeStore().apply()
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <Toaster position="top-center" />
</template>
