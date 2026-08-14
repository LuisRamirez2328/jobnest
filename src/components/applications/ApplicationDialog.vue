<script setup lang="ts">
import { ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { LoaderCircleIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { STAGES, STAGE_META, WORK_MODE_META } from '@/services/types'
import type {
  Application,
  ApplicationInput,
  ApplicationStage,
  WorkMode,
} from '@/services/types'
import {
  useCreateApplication,
  useUpdateApplication,
} from '@/composables/useApplications'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  application?: Application | null
  initialStage?: ApplicationStage
}>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: [app: Application]
}>()

const isEditing = () => props.application != null

const schema = toTypedSchema(
  z.object({
    company: z
      .string({ message: 'El nombre de la empresa es obligatorio' })
      .min(1, 'El nombre de la empresa es obligatorio'),
    position: z
      .string({ message: 'El puesto es obligatorio' })
      .min(1, 'El puesto es obligatorio'),
    workMode: z.enum(['remote', 'hybrid', 'onsite']),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    location: z.string().optional(),
    url: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().optional(),
    notes: z.string().optional(),
  }),
)

const {
  errors,
  handleSubmit,
  setValues,
  resetForm,
  validateField,
  useFieldModel,
} = useForm({
  validationSchema: schema,
  initialValues: emptyValues(),
})

const company = useFieldModel('company')
const position = useFieldModel('position')
const workMode = useFieldModel('workMode')
const salaryMin = useFieldModel('salaryMin')
const salaryMax = useFieldModel('salaryMax')
const location = useFieldModel('location')
const url = useFieldModel('url')
const contactName = useFieldModel('contactName')
const contactEmail = useFieldModel('contactEmail')
const notes = useFieldModel('notes')

const submitting = ref(false)
const stage = ref<ApplicationStage>('applied')

function emptyValues() {
  return {
    company: '',
    position: '',
    workMode: 'remote' as WorkMode,
    salaryMin: '',
    salaryMax: '',
    location: '',
    url: '',
    contactName: '',
    contactEmail: '',
    notes: '',
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    const app = props.application
    if (app) {
      setValues({
        company: app.company,
        position: app.position,
        workMode: app.workMode,
        salaryMin: app.salaryMin?.toString() ?? '',
        salaryMax: app.salaryMax?.toString() ?? '',
        location: app.location,
        url: app.url ?? '',
        contactName: app.contactName ?? '',
        contactEmail: app.contactEmail ?? '',
        notes: app.notes,
      })
      stage.value = app.stage
    } else {
      resetForm()
      stage.value = props.initialStage ?? 'applied'
    }
  },
  { immediate: true },
)

const createMutation = useCreateApplication()
const updateMutation = useUpdateApplication()

const onSubmit = handleSubmit(async (formValues) => {
  const input: Omit<ApplicationInput, 'stage'> = {
    company: formValues.company.trim(),
    position: formValues.position.trim(),
    location: formValues.location?.trim() ?? '',
    workMode: formValues.workMode,
    salaryMin: formValues.salaryMin ? Number(formValues.salaryMin) : undefined,
    salaryMax: formValues.salaryMax ? Number(formValues.salaryMax) : undefined,
    url: formValues.url?.trim() || undefined,
    contactName: formValues.contactName?.trim() || undefined,
    contactEmail: formValues.contactEmail?.trim() || undefined,
    notes: formValues.notes?.trim() ?? '',
  }

  submitting.value = true
  try {
    const saved = isEditing()
      ? await updateMutation.mutateAsync({
          id: props.application!.id,
          patch: input,
        })
      : await createMutation.mutateAsync({ ...input, stage: stage.value })
    toast.success(isEditing() ? 'Postulación actualizada' : 'Postulación creada')
    emit('saved', saved)
    emit('update:open', false)
  } catch {
    toast.error('Ocurrió un error al guardar la postulación')
  } finally {
    submitting.value = false
  }
})

function setWorkMode(value: unknown) {
  workMode.value = (value ?? 'remote') as WorkMode
}

function setStage(value: unknown) {
  stage.value = (value ?? 'applied') as ApplicationStage
}
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="
      (value) => {
        emit('update:open', value)
        if (!value) resetForm()
      }
    "
  >
    <DialogContent class="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{ isEditing() ? 'Editar postulación' : 'Nueva postulación' }}
        </DialogTitle>
        <DialogDescription>
          {{ isEditing() ? 'Actualiza los datos de la empresa o el puesto.' : 'Registra una nueva candidatura a un puesto.' }}
        </DialogDescription>
      </DialogHeader>

      <form novalidate class="space-y-4" @submit.prevent="onSubmit">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="company" class="required">Empresa</Label>
            <Input
              id="company"
              v-model="company"
              type="text"
              :aria-invalid="Boolean(errors.company)"
              :aria-describedby="errors.company ? 'company-error' : undefined"
              placeholder="Acme Inc."
              @blur="validateField('company')"
            />
            <p v-if="errors.company" id="company-error" class="text-xs text-destructive">
              {{ errors.company }}
            </p>
          </div>

          <div class="space-y-1.5">
            <Label for="position" class="required">Puesto</Label>
            <Input
              id="position"
              v-model="position"
              type="text"
              :aria-invalid="Boolean(errors.position)"
              :aria-describedby="errors.position ? 'position-error' : undefined"
              placeholder="Frontend Developer"
              @blur="validateField('position')"
            />
            <p v-if="errors.position" id="position-error" class="text-xs text-destructive">
              {{ errors.position }}
            </p>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="workMode">Modalidad</Label>
            <Select :model-value="workMode" @update:model-value="setWorkMode($event)">
              <SelectTrigger id="workMode">
                <SelectValue placeholder="Selecciona una modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="mode in ['remote', 'hybrid', 'onsite']"
                  :key="mode"
                  :value="mode"
                >
                  {{ WORK_MODE_META[mode as WorkMode].label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div v-if="!isEditing()" class="space-y-1.5">
            <Label for="stage">Etapa</Label>
            <Select :model-value="stage" @update:model-value="setStage($event)">
              <SelectTrigger id="stage">
                <SelectValue placeholder="Selecciona una etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="s in STAGES" :key="s" :value="s">
                  {{ STAGE_META[s].label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="location">Ubicación</Label>
            <Input
              id="location"
              v-model="location"
              type="text"
              placeholder="Ciudad de México (remoto)"
            />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1.5">
              <Label for="salaryMin">Salario min.</Label>
              <Input
                id="salaryMin"
                v-model="salaryMin"
                type="number"
                inputmode="numeric"
                min="0"
                placeholder="60000"
              />
            </div>
            <div class="space-y-1.5">
              <Label for="salaryMax">Salario máx.</Label>
              <Input
                id="salaryMax"
                v-model="salaryMax"
                type="number"
                inputmode="numeric"
                min="0"
                placeholder="90000"
              />
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="url">URL de la oferta</Label>
            <Input
              id="url"
              v-model="url"
              type="url"
              placeholder="https://empresa.com/oferta"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="contactName">Persona de contacto</Label>
            <Input id="contactName" v-model="contactName" type="text" placeholder="Ana Torres" />
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="contactEmail">Email de contacto</Label>
          <Input
            id="contactEmail"
            v-model="contactEmail"
            type="email"
            placeholder="ana@empresa.com"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="notes">Notas</Label>
          <Textarea
            id="notes"
            v-model="notes"
            rows="3"
            placeholder="Entrevista técnica, stack, salario ofrecido…"
          />
        </div>

        <DialogFooter class="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            :disabled="submitting"
            @click="emit('update:open', false)"
          >
            Cancelar
          </Button>
          <Button type="submit" :disabled="submitting">
            <LoaderCircleIcon v-if="submitting" class="animate-spin" aria-hidden="true" />
            {{ isEditing() ? 'Guardar cambios' : 'Crear postulación' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.required::after {
  content: ' *';
  color: var(--destructive);
}
</style>
