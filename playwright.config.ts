// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',           // só olhar essa pasta
  testMatch: /.*\.spec\.ts/,    // arquivos *.spec.ts
  timeout: 30_000,
  retries: 0,
})
