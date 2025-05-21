// pages/api/fusion/apply.ts
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." })
  }

  const { project, arquivos } = req.body

  if (typeof project !== "string" || !project.trim()) {
    return res.status(400).json({ error: "Falta o nome do projeto." })
  }
  if (!Array.isArray(arquivos) || arquivos.some(f => !f.path || !f.content)) {
    return res.status(400).json({ error: "Formato de arquivos inválido." })
  }

  try {
    // grava tudo dentro de ./generated/{project}/...
    const baseDir = path.join(process.cwd(), "generated", project)
    for (const file of arquivos) {
      const fullPath = path.join(baseDir, file.path)
      const dir = path.dirname(fullPath)
      await mkdir(dir, { recursive: true })
      await writeFile(fullPath, file.content, "utf-8")
    }
    return res.status(200).json({ message: "Arquivos aplicados com sucesso!" })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}