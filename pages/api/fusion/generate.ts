import type { NextApiRequest, NextApiResponse } from "next"
import OpenAI from "openai"
import { prisma } from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { prompt, userId = "anon-user", project = "default" } = req.body as {
    prompt?: string
    userId?: string
    project?: string
  }

  if (!prompt || prompt.trim().length < 3) {
    return res.status(400).json({ error: "Prompt ausente ou muito curto" })
  }

  try {
    const systemPrompt = `
Você é um gerador de arquivos para um sistema de programação. Sua tarefa é transformar uma instrução em linguagem natural em um ARRAY JSON contendo múltiplos arquivos:

[
  { "path": "pasta/arquivo.ext", "content": "conteúdo do arquivo" },
  { "path": "pasta/segundo.ext", "content": "conteúdo do segundo arquivo" }
]

⚠️ Regras:
- NÃO use blocos markdown (nada de \`\`\` ou \`\`\`json).
- NÃO explique nada fora dos objetos JSON.
- Os arquivos devem ser completos e compiláveis.
- Use extensões como .js, .ts, .tsx, .json, .html, .md, .prisma, .sql, etc.
`.trim()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })

    const result = completion.choices?.[0]?.message?.content || ""

    // Registro no histórico geral
    await prisma.promptHistory.create({
      data: {
        prompt,
        response: result,
        userId,
        project,
      },
    })

    // Registro adicional com proteção (fallback)
    if (typeof prisma.logExecucao?.create === "function") {
      await prisma.logExecucao.create({
        data: {
          prompt,
          result,
          status: result.trim().length > 10 ? "success" : "warning",
          userId,
          project,
        },
      })
    } else {
      console.warn("⚠️ logExecucao model não disponível no Prisma Client.")
    }

    return res.status(200).json({ result })
  } catch (err: any) {
    console.error("❌ Erro na geração com IA:", err)
    return res.status(500).json({ error: "Erro interno ao gerar arquivos com IA." })
  }
}
