// pages/api/fusion/exec-history.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId = "anon-user", project = undefined } = req.query

  try {
    const historico = await prisma.execucao.findMany({
      where: {
        userId: String(userId),
        ...(project ? { projeto: String(project) } : {})
      },
      orderBy: { criadoEm: "desc" },
      take: 50
    })
    res.status(200).json(historico)
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao buscar execuções", message: err.message })
  }
}
