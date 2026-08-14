export const STAGES = ['applied', 'interview', 'offer', 'rejected'] as const

export type ApplicationStage = (typeof STAGES)[number]

export type WorkMode = 'remote' | 'hybrid' | 'onsite'

export interface Application {
  id: string
  company: string
  position: string
  location: string
  workMode: WorkMode
  stage: ApplicationStage
  salaryMin?: number
  salaryMax?: number
  appliedAt: string
  updatedAt: string
  notes: string
  url?: string
  contactName?: string
  contactEmail?: string
}

export type ApplicationInput = Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>

export interface ApplicationFilters {
  search: string
  stage: ApplicationStage | ''
  workMode: WorkMode | ''
  sort: 'recent' | 'company' | 'position'
}

export const DEFAULT_FILTERS: ApplicationFilters = {
  search: '',
  stage: '',
  workMode: '',
  sort: 'recent',
}

export const STAGE_META: Record<
  ApplicationStage,
  { label: string; short: string; dot: string }
> = {
  applied: { label: 'Aplicada', short: 'Aplicada', dot: 'bg-sky-500' },
  interview: { label: 'En entrevista', short: 'Entrevista', dot: 'bg-amber-500' },
  offer: { label: 'Oferta', short: 'Oferta', dot: 'bg-emerald-500' },
  rejected: { label: 'Descartada', short: 'Descartada', dot: 'bg-rose-500' },
}

export const WORK_MODE_META: Record<WorkMode, { label: string; short: string }> = {
  remote: { label: 'Remoto', short: 'Remoto' },
  hybrid: { label: 'Híbrido', short: 'Híbrido' },
  onsite: { label: 'Presencial', short: 'Presencial' },
}
