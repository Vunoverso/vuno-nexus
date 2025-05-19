import type { NextApiRequest, NextApiResponse } from "next"
import OpenAI from "openai"
import { prisma } from "@/lib/prisma" // ajuste o caminho se necessário

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { prompt, userId, project } = req.body as {
    prompt?: string
    userId?: string
    project?: string
  }

  if (!prompt || prompt.length < 3) {
    return res.status(400).json({ error: "Prompt ausente ou inválido" })
  }

  try {
    const systemPrompt = `
Você é um gerador de arquivos para um sistema de programação. Sua tarefa é transformar uma instrução em linguagem natural em um JSON contendo:

{
  "path": "caminho/do/arquivo.extensão",
  "content": "conteúdo do arquivo completo"
}

Regras:
- O content pode ser escrito em qualquer linguagem (.js, .ts, .jsx, .tsx, .json, .py, .sql, .html, .md, .prisma, etc.).
- O campo "path" deve sempre indicar a pasta correta e ter a extensão correta.
- NÃO use blocos de markdown (ex: \`\`\` ou \`\`\`json).
- NÃO inclua explicações ou comentários fora do JSON.
- Retorne apenas o objeto JSON puro.

Exemplo:
Prompt: Crie um schema Prisma com model User em prisma/schema.prisma
Resposta:
{
  "path": "prisma/schema.prisma",
  "content": "model User {\\n  id Int @id @default(autoincrement())\\n  name String\\n}"
}
`.trim()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    })

    const raw = completion.choices[0].message?.content || ""

    await prisma.promptHistory.create({
      data: {
        prompt,
        response: raw,
        userId: userId || "anon-user",
        project: project || "default"
      }
    })

    return res.status(200).json({ result: raw })
  } catch (err: any) {
    console.error("Erro IA:", err)
    return res.status(500).json({ error: "Erro interno ao gerar com IA" })
  }
}
