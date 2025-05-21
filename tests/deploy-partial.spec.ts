// tests/deploy-partial.spec.ts
import { test, expect } from '@playwright/test'
import AdmZip from 'adm-zip'

test('fluxo manual e deploy parcial via ZIP', async ({ page }) => {
  // 1) Acesse o builder
  await page.goto('http://localhost:3000/builder')

  // 2) Preencha nome do projeto (usar algo sem espaços)
  await page.fill('input#project', 'testproj')

  // 3) Geração manual
  await page.fill('input#path', 'hello.txt')
  await page.fill('textarea#content', 'Hello world')
  await page.click('button:has-text("Gerar Arquivo Manualmente")')

  // 4) No clique em Baixar ZIP, capture a resposta de /api/deploy/temp
  const [ response ] = await Promise.all([
    page.waitForResponse(resp =>
      resp.url().endsWith('/api/deploy/temp') && resp.status() === 200
    ),
    page.click('button:has-text("Baixar ZIP")'),
  ])

  // 5) Verifique cabeçalhos
  expect(response.headers()['content-type']).toBe('application/zip')

  // 6) Leia o corpo como Buffer e abra com adm-zip
  const buffer = await response.body()
  const zip = new AdmZip(buffer)
  const entries = zip.getEntries().map(e => e.entryName)

  // Deve haver nossa pasta e arquivo dentro do ZIP
  expect(entries).toContain('testproj/hello.txt')

  // 7) Verifique conteúdo do hello.txt
  const entry = zip.getEntry('testproj/hello.txt')
  expect(entry).toBeDefined()
  expect(entry!.getData().toString('utf8')).toBe('Hello world')
})