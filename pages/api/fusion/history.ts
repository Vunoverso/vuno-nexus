import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma" // ajuste o path se necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.method === "GET" ? req.query : req.body

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId ausente ou inválido" })
  }

  try {
    switch (req.method) {
      case "GET": {
        const list = await prisma.promptHistory.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20
        })
        return res.status(200).json(list)
      }

      case "DELETE": {
        const result = await prisma.promptHistory.deleteMany({
          where: { userId }
        })
        return res.status(200).json({
          message: "Histórico apagado com sucesso.",
          deletados: result.count
        })
      }

      default:
        return res.status(405).json({ error: `Método ${req.method} não permitido.` })
    }
  } catch (err: any) {
    console.error("Erro no histórico:", err)
    return res.status(500).json({ error: "Erro interno: " + err.message })
  }
}
