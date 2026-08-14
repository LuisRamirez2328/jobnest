<script setup lang="ts">
import { STAGE_META } from '@/services/types'
import type { ApplicationStage } from '@/services/types'
import { Badge } from '@/components/ui/badge'

defineProps<{ stage: ApplicationStage }>()
</script>

<template>
  <Badge
    variant="secondary"
    class="inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-0.5 text-[11px] font-medium"
  >
    <span
      :class="['size-1.5 rounded-full', STAGE_META[stage].dot]"
      aria-hidden="true"
    />
    {{ STAGE_META[stage].label }}
  </Badge>
</template>
