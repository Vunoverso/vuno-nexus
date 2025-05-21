// pages/api/fusion/test-diagnostico.ts
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  const { userId = "anon-user", project = "default" } = req.body

  try {
    await prisma.logExecucao.create({
      data: {
        prompt: "diagnostico::builder",
        result: "log de teste executado com sucesso",
        status: "success",
        userId,
        project,
      },
    })

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error("Erro no diagnóstico:", err)
    return res.status(500).json({ ok: false, error: err?.message || "Erro desconhecido" })
  }
}
