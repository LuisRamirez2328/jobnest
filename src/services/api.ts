import { mockDb } from './mockDb'
import { STAGES } from './types'
import type {
  Application,
  ApplicationFilters,
  ApplicationInput,
  ApplicationStage,
} from './types'

const LATENCY = 250

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY))
}

export interface StageCount {
  stage: ApplicationStage
  count: number
}

export interface ApplicationStats {
  total: number
  active: number
  interviews: number
  offers: number
  responseRate: number
  byStage: Record<ApplicationStage, number>
  byMonth: { label: string; count: number }[]
  recent: Application[]
}

const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

function monthLabel(month: string): string {
  const [, mm] = month.split('-')
  return MONTH_LABELS[Number(mm) - 1] ?? month
}

export function computeStats(list: Application[]): ApplicationStats {
  const total = list.length
  const byStage = Object.fromEntries(
    STAGES.map((stage) => [stage, list.filter((a) => a.stage === stage).length]),
  ) as Record<ApplicationStage, number>
  const decided = list.filter((a) => a.stage === 'offer' || a.stage === 'rejected')
  const active = byStage.applied + byStage.interview
  const interviews = byStage.interview
  const offers = byStage.offer
  const responseRate = total > 0 ? Math.round((decided.length / total) * 100) : 0

  const byMonthMap = new Map<string, number>()
  for (const app of list) {
    const key = monthKey(app.appliedAt)
    byMonthMap.set(key, (byMonthMap.get(key) ?? 0) + 1)
  }
  const byMonth = [...byMonthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ label: monthLabel(month), count }))

  const recent = [...list]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)

  return { total, active, interviews, offers, responseRate, byStage, byMonth, recent }
}

function applyFilters(list: Application[], filters: ApplicationFilters): Application[] {
  const q = filters.search.trim().toLowerCase()
  let result = list

  if (q) {
    result = result.filter(
      (a) =>
        a.company.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.contactName ?? '').toLowerCase().includes(q),
    )
  }
  if (filters.stage) result = result.filter((a) => a.stage === filters.stage)
  if (filters.workMode) result = result.filter((a) => a.workMode === filters.workMode)

  switch (filters.sort) {
    case 'company':
      result = [...result].sort((a, b) => a.company.localeCompare(b.company))
      break
    case 'position':
      result = [...result].sort((a, b) => a.position.localeCompare(b.position))
      break
    default:
      result = [...result].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }

  return result
}

export const api = {
  async listApplications(filters: ApplicationFilters): Promise<Application[]> {
    return delay(applyFilters(mockDb.list(), filters))
  },

  async getStats(): Promise<ApplicationStats> {
    return delay(computeStats(mockDb.list()))
  },

  async getApplication(id: string): Promise<Application | undefined> {
    return delay(mockDb.find(id))
  },

  async createApplication(input: ApplicationInput): Promise<Application> {
    return delay(mockDb.create(input))
  },

  async updateApplication(id: string, patch: Partial<ApplicationInput>): Promise<Application> {
    const updated = mockDb.update(id, patch)
    if (!updated) throw new Error('La postulación no existe')
    return delay(updated)
  },

  async deleteApplication(id: string): Promise<void> {
    if (!mockDb.remove(id)) throw new Error('La postulación no existe')
    return delay(undefined)
  },

  async moveApplication(id: string, stage: ApplicationStage): Promise<Application> {
    const updated = mockDb.update(id, { stage })
    if (!updated) throw new Error('La postulación no existe')
    return delay(updated)
  },
}
