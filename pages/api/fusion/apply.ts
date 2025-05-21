// pages/api/fusion/apply-files.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { promises as fs } from "fs"
import path from "path"
import diff from "diff"

interface FileItem {
  path: string
  content: string
  action?: "create" | "overwrite" | "improve" | "delete"
}

export const config = {
  api: { bodyParser: { sizeLimit: "5mb" } }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const files = req.body as FileItem[]
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." })
  }

  const baseDir = path.join(process.cwd(), "generated")
  const resultados: any[] = []

  for (const file of files) {
    const norm = path.normalize(file.path)
    if (norm.startsWith("..") || path.isAbsolute(norm)) {
      resultados.push({ path: file.path, status: "invalid_path" })
      continue
    }
    const fullPath = path.join(baseDir, norm)

    try {
      switch (file.action) {
        case "delete":
          await fs.unlink(fullPath)
          resultados.push({ path: file.path, status: "deleted" })
          break

        case "create": {
          try {
            await fs.access(fullPath)
            resultados.push({ path: file.path, status: "exists" })
          } catch {
            await fs.mkdir(path.dirname(fullPath), { recursive: true })
            await fs.writeFile(fullPath, file.content, "utf8")
            resultados.push({ path: file.path, status: "created" })
          }
          break
        }

        case "improve": {
          await fs.mkdir(path.dirname(fullPath), { recursive: true })

          let oldText = ""
          try { oldText = await fs.readFile(fullPath, "utf8") }
          catch (e: any) { if (e.code !== "ENOENT") throw e }

          const changes = diff.createTwoFilesPatch(
            file.path,
            file.path,
            oldText,
            file.content,
            "old",
            "new"
          )

          const improved = oldText + "\n\n/* === MELHORIAS === */\n" + file.content

          await fs.writeFile(fullPath, improved, "utf8")
          resultados.push({
            path: file.path,
            status: oldText ? "improved" : "created",
            diff: changes.split("\n").slice(0, 20)
          })
          break
        }

        case "overwrite":
        default: {
          await fs.mkdir(path.dirname(fullPath), { recursive: true })

          let status = "created"
          try {
            const prev = await fs.readFile(fullPath, "utf8")
            status = prev === file.content ? "unchanged" : "overwritten"
          } catch (e: any) {
            if (e.code !== "ENOENT") throw e
          }

          await fs.writeFile(fullPath, file.content, "utf8")
          resultados.push({ path: file.path, status })
          break
        }
      }
    } catch (err: any) {
      resultados.push({ path: file.path, status: "error", message: err.message })
    }
  }

  return res.status(200).json({ ok: true, resultados })
}
