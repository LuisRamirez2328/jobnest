<script setup lang="ts">
import { SearchIcon, SlidersHorizontalIcon, XIcon } from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STAGES, STAGE_META, WORK_MODE_META } from '@/services/types'
import type {
  ApplicationFilters,
  ApplicationStage,
  WorkMode,
} from '@/services/types'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()

function setStage(value: unknown) {
  filtersStore.filters.stage = value === 'all' ? '' : (value as ApplicationStage)
}

function setWorkMode(value: unknown) {
  filtersStore.filters.workMode = value === 'any' ? '' : (value as WorkMode)
}

function setSort(value: unknown) {
  filtersStore.filters.sort = (value ?? 'recent') as ApplicationFilters['sort']
}
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center"
    role="search"
    aria-label="Filtros de postulaciones"
  >
    <div class="relative flex-1">
      <SearchIcon
        class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        v-model="filtersStore.filters.search"
        type="search"
        class="pl-8"
        placeholder="Buscar empresa o puesto…"
        aria-label="Buscar por empresa o puesto"
      />
      <button
        v-if="filtersStore.filters.search"
        class="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        aria-label="Limpiar búsqueda"
        @click="filtersStore.filters.search = ''"
      >
        <XIcon class="size-3.5" aria-hidden="true" />
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <SlidersHorizontalIcon class="size-4 text-muted-foreground" aria-hidden="true" />
      <Select
        :model-value="filtersStore.filters.stage"
        @update:model-value="setStage($event)"
      >
        <SelectTrigger class="h-9 w-40" aria-label="Filtrar por etapa">
          <SelectValue placeholder="Todas las etapas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las etapas</SelectItem>
          <SelectItem v-for="s in STAGES" :key="s" :value="s">
            {{ STAGE_META[s].label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="filtersStore.filters.workMode"
        @update:model-value="setWorkMode($event)"
      >
        <SelectTrigger class="h-9 w-36" aria-label="Filtrar por modalidad">
          <SelectValue placeholder="Cualquier modalidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Cualquier modalidad</SelectItem>
          <SelectItem
            v-for="mode in ['remote', 'hybrid', 'onsite']"
            :key="mode"
            :value="mode"
          >
            {{ WORK_MODE_META[mode as WorkMode].label }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        :model-value="filtersStore.filters.sort"
        @update:model-value="setSort($event)"
      >
        <SelectTrigger class="h-9 w-40" aria-label="Ordenar por">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Más recientes</SelectItem>
          <SelectItem value="company">Empresa (A-Z)</SelectItem>
          <SelectItem value="position">Puesto (A-Z)</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="sm"
        class="text-muted-foreground"
        @click="filtersStore.reset()"
      >
        Limpiar
      </Button>
    </div>
  </div>
</template>
