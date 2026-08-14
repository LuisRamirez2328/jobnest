import { test, expect } from '@playwright/test'

test.describe('JobNest', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('navega por las secciones principales', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await page.getByRole('link', { name: 'Pipeline' }).click()
    await expect(page.getByRole('heading', { name: 'Pipeline' })).toBeVisible()
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await expect(page.getByRole('heading', { name: 'Postulaciones' })).toBeVisible()
  })

  test('muestra el resumen del dashboard con datos sembrados', async ({ page }) => {
    await expect(page.getByTestId('stat-total')).toHaveText('14')
    await expect(page.getByTestId('stat-active')).toHaveText('9')
    await expect(page.getByTestId('stat-offers')).toHaveText('3')
    await expect(page.getByTestId('stat-response')).toHaveText('36%')
    await expect(page.getByText('Acme Cloud — Frontend Developer')).toBeVisible()
    await expect(page.getByText('Postulaciones por mes')).toBeVisible()
    await expect(page.getByText('Distribución por etapa')).toBeVisible()
  })

  test('crea una postulación y aparece en la tabla', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await page.getByRole('button', { name: 'Nueva postulación' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Nueva postulación' })).toBeVisible()

    await dialog.getByLabel('Empresa').fill('TestCorp')
    await dialog.getByLabel('Puesto').fill('QA Engineer')
    await dialog.getByRole('combobox', { name: 'Etapa' }).click()
    await page.getByRole('option', { name: 'Oferta' }).click()
    await dialog.getByRole('button', { name: 'Crear postulación' }).click()

    await expect(page.getByText('Postulación creada')).toBeVisible()
    await expect(page.getByRole('row', { name: /TestCorp/ })).toBeVisible()
  })

  test('valida los campos obligatorios del formulario', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await page.getByRole('button', { name: 'Nueva postulación' }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Crear postulación' }).click()

    await expect(dialog.getByText('El nombre de la empresa es obligatorio')).toBeVisible()
    await expect(dialog.getByText('El puesto es obligatorio')).toBeVisible()
  })

  test('edita una postulación existente', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await page.getByRole('row', { name: /Acme Cloud/ }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Editar' }).click()

    const editDialog = page.getByRole('dialog')
    await expect(editDialog.getByRole('heading', { name: 'Editar postulación' })).toBeVisible()
    const company = editDialog.getByLabel('Empresa')
    await expect(company).toHaveValue('Acme Cloud')
    await company.fill('Acme Cloud MX')
    await editDialog.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByText('Postulación actualizada')).toBeVisible()
    await expect(page.getByRole('row', { name: /Acme Cloud MX/ })).toBeVisible()
  })

  test('cambia la etapa desde el detalle', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await page.getByRole('row', { name: /Acme Cloud/ }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('combobox', { name: 'Cambiar etapa' }).click()
    await page.getByRole('option', { name: 'Descartada' }).click()

    await expect(page.getByText('Etapa actualizada')).toBeVisible()
    await expect(dialog.getByText('Descartada').first()).toBeVisible()
  })

  test('mueve una tarjeta por drag & drop en el pipeline', async ({ page }) => {
    await page.getByRole('link', { name: 'Pipeline' }).click()

    const applied = page.locator('section[data-stage="applied"]')
    const offer = page.locator('section[data-stage="offer"]')
    await expect(applied.locator('article')).toHaveCount(4)
    await expect(offer.locator('article')).toHaveCount(3)

    await applied.locator('article').first().dragTo(offer)

    await expect(applied.locator('article')).toHaveCount(3)
    await expect(offer.locator('article')).toHaveCount(4)
  })

  test('crea una postulación desde el botón + de una columna', async ({ page }) => {
    await page.getByRole('link', { name: 'Pipeline' }).click()

    const offer = page.locator('section[data-stage="offer"]')
    await offer.getByRole('button', { name: 'Nueva postulación en oferta' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByLabel('Empresa').fill('KanbanCorp')
    await dialog.getByLabel('Puesto').fill('Backend Engineer')
    await dialog.getByRole('button', { name: 'Crear postulación' }).click()

    await expect(page.getByText('Postulación creada')).toBeVisible()
    await expect(offer.locator('article')).toHaveCount(4)
  })

  test('filtra la tabla por búsqueda', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await expect(page.locator('tbody tr')).toHaveCount(14)

    await page.getByLabel('Buscar por empresa o puesto').fill('vue')

    await expect(page.locator('tbody tr')).toHaveCount(2)
    await expect(page.getByRole('row', { name: /Orbita Studio/ })).toBeVisible()
    await expect(page.getByRole('row', { name: /Nextframe/ })).toBeVisible()
  })

  test('elimina una postulación con confirmación', async ({ page }) => {
    await page.getByRole('link', { name: 'Postulaciones' }).click()
    await page.getByRole('row', { name: /PixelSoft/ }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('¿Eliminar esta postulación?')).toBeVisible()
    await page.getByRole('button', { name: 'Eliminar', exact: true }).last().click()

    await expect(page.getByText('Postulación eliminada')).toBeVisible()
    await expect(page.getByRole('row', { name: /PixelSoft/ })).toHaveCount(0)
  })

  test('muestra la página 404 para rutas desconocidas', async ({ page }) => {
    await page.goto('/ruta-inexistente')
    await expect(page.getByText('Página no encontrada')).toBeVisible()
  })
})
