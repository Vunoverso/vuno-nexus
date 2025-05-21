// pages/api/fusion/execute.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { executarArquivo } from "@/core/executor"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { path: filePath, content, projectLanguage, userId = "anon-user", project = "default" } = req.body

  try {
    const exec = await executarArquivo(filePath, content, projectLanguage)

    const output = exec.output || exec.stdout || exec.stderr || exec.error || "[Sem saída]"

    // 💾 Salvar histórico da execução
    await prisma.execucao.create({
      data: {
        userId,
        projeto: project,
        linguagem: projectLanguage || "desconhecido",
        path: filePath,
        entrada: content,
        saida: output,
        status: exec.error ? "error" : "success",
      },
    })

    return res.status(200).json({
      ok: true,
      ...exec,
      output
    })
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message })
  }
}
