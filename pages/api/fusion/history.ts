import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Obtém userId de query (GET) ou body (POST/DELETE)
  const userId =
    req.method === "GET"
      ? typeof req.query.userId === "string"
        ? req.query.userId
        : "anon-user"
      : typeof req.body?.userId === "string"
      ? req.body.userId
      : "anon-user"

  try {
    switch (req.method) {
      case "GET": {
        const list = await prisma.promptHistory.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
        return res.status(200).json(list)
      }

      case "DELETE": {
        const result = await prisma.promptHistory.deleteMany({
          where: { userId },
        })
        return res.status(200).json({
          message: "Histórico apagado com sucesso.",
          deletados: result.count,
        })
      }

      default:
        return res
          .status(405)
          .json({ error: `Método ${req.method} não permitido.` })
    }
  } catch (err: any) {
    console.error("❌ Erro ao acessar histórico:", err)
    return res
      .status(500)
      .json({ error: "Erro interno ao acessar histórico: " + err?.message })
  }
}
