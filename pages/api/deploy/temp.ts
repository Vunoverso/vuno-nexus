import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

type FileItem = { path: string; content: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { project, arquivos }: { project: string, arquivos: FileItem[] } = req.body

  if (!project || !Array.isArray(arquivos)) {
    return res.status(400).json({ error: 'Missing project or arquivos' })
  }

  // Define onde vamos gravar
  const baseDir = path.join(process.cwd(), 'generated', project)
  // Limpa pasta antiga, se existir
  if (fs.existsSync(baseDir)) {
    fs.rmSync(baseDir, { recursive: true, force: true })
  }
  fs.mkdirSync(baseDir, { recursive: true })

  // Grava cada arquivo
  arquivos.forEach((file) => {
    const filePath = path.join(baseDir, file.path)
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, file.content, 'utf8')
  })

  // Gera ZIP em memória
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${project}.zip`
  )

  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.on('error', (err) => res.status(500).send({ error: err.message }))
  archive.pipe(res)

  // Adiciona todo o diretório no ZIP
  archive.directory(baseDir, project)
  await archive.finalize()
}
