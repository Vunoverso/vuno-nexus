// core/parser/convertTextToJSON.ts
export interface FilePayload {
  path: string
  content: string
}

export function extractFileBlocks(raw: string): FilePayload[] {
  try {
    // Etapa 1 — Limpar blocos markdown se existirem
    const cleaned = raw
      .replace(/```[a-zA-Z]*\n?/g, "")
      .replace(/```/g, "")
      .trim()

    // Etapa 2 — Tentar parsear como array
    const parsed = JSON.parse(cleaned)

    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item.path && item.content)
    }

    // Etapa 3 — Se for objeto único
    if (parsed.path && parsed.content) {
      return [parsed]
    }

    return []
  } catch (err) {
    console.warn("❌ Parser inteligente falhou — tentando regex de fallback.")

    // Fallback com regex básico para blocos JSON isolados
    const regex = /{\s*["']path["']\s*:\s*["'](.*?)["'],\s*["']content["']\s*:\s*["']([\s\S]*?)["']\s*}/g
    const matches = []
    let match
    while ((match = regex.exec(raw)) !== null) {
      matches.push({
        path: match[1],
        content: match[2]
      })
    }
    return matches
  }
}
