// utils/saveFiles.ts
import fs from 'fs/promises'
import path from 'path'

export interface FilePayload {
  path: string
  content: string
}

export async function saveFiles(files: FilePayload[], rootDir: string = process.cwd()) {
  for (const file of files) {
    const filePath = path.join(rootDir, file.path)
    const dir = path.dirname(filePath)

    // Garante que os diretórios existem
    await fs.mkdir(dir, { recursive: true })

    // Salva o conteúdo do arquivo
    await fs.writeFile(filePath, file.content, 'utf-8')
    console.log(`✅ Arquivo salvo: ${file.path}`)
  }
}
