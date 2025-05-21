// pages/api/fusion/evaluate-prompt.ts
import { NextApiRequest, NextApiResponse } from "next"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return res.status(400).json({ error: "Prompt ausente ou muito curto." })
  }

  const system = `
Você é um avaliador de prompts para sistemas de geração de código com IA.
Sua tarefa é:
- Analisar o prompt.
- Atribuir uma nota de 0 a 10.
- Explicar brevemente os pontos positivos e negativos.

Formato esperado:
Nota: X/10
Comentário: ...
`.trim()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    })

    const raw = completion.choices?.[0]?.message?.content || ""
    const trimmed = raw.trim()

    res.status(200).json({ result: trimmed })
  } catch (err: any) {
    console.error("❌ Erro ao avaliar prompt:", err.message || err)
    res.status(500).json({ error: "Erro interno ao avaliar prompt." })
  }
}
