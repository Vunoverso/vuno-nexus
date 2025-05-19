import { writeFile, mkdir } from "fs/promises"
import path from "path"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." })
  }

  const { arquivos } = req.body

  if (!Array.isArray(arquivos)) {
    return res.status(400).json({ error: "Formato inválido." })
  }

  try {
    for (const file of arquivos) {
      const fullPath = path.join(process.cwd(), file.path)
      const dir = path.dirname(fullPath)

      await mkdir(dir, { recursive: true })
      await writeFile(fullPath, file.content, "utf-8")
    }

    return res.status(200).json({ message: "Arquivos aplicados com sucesso!" })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
