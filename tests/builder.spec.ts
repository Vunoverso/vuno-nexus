import { test, expect } from '@playwright/test'

test('fluxo manual e copiar JSON', async ({ page }) => {
  await page.goto('http://localhost:3000/builder')
  // Geração manual
  await page.fill('input#path', 'foo.txt')
  await page.fill('textarea#content', 'bar')
  await page.click('text=Gerar Arquivo Manualmente')
  await expect(page.locator('details')).toHaveCount(1)
  // Copiar JSON
  await page.click('text=Copiar JSON')
  // opcional: colar em um campo escondido e verificar valor…
})