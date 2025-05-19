// pages/api/fusion/execute.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ result: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: 'Method Not Allowed' })
  }

  const { prompt } = req.body as { prompt?: string }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ result: 'Prompt inválido ou muito curto.' })
  }

  try {
    // 🧠 Execução da IA com OpenAI (modelo ajustável)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt.trim() }],
      temperature: 0.6,
    })

    const message = response.choices?.[0]?.message?.content ?? 'Sem resposta da IA'

    // 💾 Salva no histórico
    await prisma.promptHistory.create({
      data: {
        prompt: prompt.trim(),
        response: message,
        userId: 'anon-user' // substituível por session.user.id
      }
    })

    // ✅ Retorna resultado ao frontend
    res.status(200).json({ result: message })
  } catch (err: any) {
    console.error('OpenAI error:', err)
    res.status(500).json({ result: 'Erro ao executar IA: ' + err.message })
  }
}
