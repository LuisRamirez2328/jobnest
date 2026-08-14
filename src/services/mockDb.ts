import type { Application } from './types'

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

const seed: Application[] = [
  {
    id: 'a1',
    company: 'Acme Cloud',
    position: 'Frontend Developer',
    location: 'Ciudad de México',
    workMode: 'remote',
    stage: 'interview',
    salaryMin: 45000,
    salaryMax: 60000,
    appliedAt: daysAgo(48),
    updatedAt: daysAgo(2),
    notes: 'Segunda entrevista técnica con el equipo de plataforma. Usan Vue 3 + TypeScript.',
    url: 'https://acme.example.com/careers/frontend',
    contactName: 'María López',
    contactEmail: 'maria.lopez@acme.example.com',
  },
  {
    id: 'a2',
    company: 'DevCraft',
    position: 'Senior Frontend Engineer',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'interview',
    salaryMin: 65000,
    salaryMax: 80000,
    appliedAt: daysAgo(30),
    updatedAt: daysAgo(5),
    notes: 'Take-home entregado. Próxima sesión: sistema de diseño.',
  },
  {
    id: 'a3',
    company: 'PixelSoft',
    position: 'Frontend Engineer',
    location: 'Guadalajara',
    workMode: 'hybrid',
    stage: 'offer',
    salaryMin: 50000,
    salaryMax: 62000,
    appliedAt: daysAgo(60),
    updatedAt: daysAgo(1),
    notes: 'Oferta recibida: 55k + bono anual. Responder antes del viernes.',
    contactName: 'Juan Pérez',
  },
  {
    id: 'a4',
    company: 'Nube Labs',
    position: 'UI Developer',
    location: 'Monterrey',
    workMode: 'onsite',
    stage: 'applied',
    salaryMin: 40000,
    salaryMax: 48000,
    appliedAt: daysAgo(6),
    updatedAt: daysAgo(6),
    notes: 'Vacante publicada en LinkedIn.',
    url: 'https://nubelabs.example.com',
  },
  {
    id: 'a5',
    company: 'Orbita Studio',
    position: 'Vue Developer',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'interview',
    salaryMin: 52000,
    salaryMax: 68000,
    appliedAt: daysAgo(20),
    updatedAt: daysAgo(3),
    notes: 'Challenge de tienda con Pinia completado. Entrevista con el CTO.',
  },
  {
    id: 'a6',
    company: 'FinTech MX',
    position: 'Frontend Developer',
    location: 'Ciudad de México',
    workMode: 'hybrid',
    stage: 'rejected',
    salaryMin: 48000,
    salaryMax: 60000,
    appliedAt: daysAgo(75),
    updatedAt: daysAgo(10),
    notes: 'Posición en pausa por reestructura.',
  },
  {
    id: 'a7',
    company: 'Rocket Apps',
    position: 'Software Engineer — Frontend',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'offer',
    salaryMin: 60000,
    salaryMax: 75000,
    appliedAt: daysAgo(40),
    updatedAt: daysAgo(4),
    notes: 'Oferta final 68k + equity. Decisión pendiente.',
    contactEmail: 'people@rocketapps.example.com',
  },
  {
    id: 'a8',
    company: 'DataBridge',
    position: 'Frontend Engineer',
    location: 'Bogotá',
    workMode: 'remote',
    stage: 'applied',
    appliedAt: daysAgo(3),
    updatedAt: daysAgo(3),
    notes: 'Postulación vía web. Sin respuesta aún.',
    url: 'https://databridge.example.com/careers',
  },
  {
    id: 'a9',
    company: 'Softway',
    position: 'Desarrollador Frontend Senior',
    location: 'Ciudad de México',
    workMode: 'hybrid',
    stage: 'interview',
    salaryMin: 55000,
    salaryMax: 70000,
    appliedAt: daysAgo(25),
    updatedAt: daysAgo(1),
    notes: 'Cuarta etapa: revisión técnica de arquitectura.',
  },
  {
    id: 'a10',
    company: 'GreenFleet',
    position: 'Web Engineer',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'applied',
    salaryMin: 42000,
    salaryMax: 55000,
    appliedAt: daysAgo(12),
    updatedAt: daysAgo(12),
    notes: 'Aplicación enviada por la plataforma de la empresa.',
  },
  {
    id: 'a11',
    company: 'Konnecta',
    position: 'Frontend Developer',
    location: 'Puebla',
    workMode: 'onsite',
    stage: 'rejected',
    appliedAt: daysAgo(90),
    updatedAt: daysAgo(30),
    notes: 'Buscan perfil con más experiencia en animación.',
  },
  {
    id: 'a12',
    company: 'AltaVision',
    position: 'Senior UI Engineer',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'offer',
    salaryMin: 70000,
    salaryMax: 85000,
    appliedAt: daysAgo(35),
    updatedAt: daysAgo(7),
    notes: 'Oferta 75k USD/mes. Alta expectativa, evaluando.',
    contactName: 'Carmen Díaz',
  },
  {
    id: 'a13',
    company: 'Nextframe',
    position: 'Frontend Engineer (Vue)',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'interview',
    salaryMin: 58000,
    salaryMax: 72000,
    appliedAt: daysAgo(15),
    updatedAt: daysAgo(2),
    notes: 'Live coding sobre componentes y testing.',
  },
  {
    id: 'a14',
    company: 'Talisma',
    position: 'Developer Advocate',
    location: 'Remoto',
    workMode: 'remote',
    stage: 'applied',
    appliedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    notes: 'Rol mixto de frontend + contenido técnico.',
  },
]

const db = new Map<string, Application>()

function seedAll() {
  db.clear()
  for (const app of seed) db.set(app.id, { ...app })
}

seedAll()

function clone(list: Application[]): Application[] {
  return list.map((a) => ({ ...a }))
}

export const mockDb = {
  reset() {
    seedAll()
  },

  list(): Application[] {
    return clone([...db.values()])
  },

  find(id: string): Application | undefined {
    const item = db.get(id)
    return item ? { ...item } : undefined
  },

  create(input: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Application {
    const now = new Date().toISOString().slice(0, 10)
    const app: Application = { id: crypto.randomUUID(), appliedAt: now, updatedAt: now, ...input }
    db.set(app.id, app)
    return { ...app }
  },

  update(id: string, patch: Partial<Omit<Application, 'id'>>): Application | undefined {
    const current = db.get(id)
    if (!current) return undefined
    const next = {
      ...current,
      ...patch,
      id: current.id,
      appliedAt: patch.appliedAt ?? current.appliedAt,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    db.set(id, next)
    return { ...next }
  },

  remove(id: string): boolean {
    return db.delete(id)
  },
}
