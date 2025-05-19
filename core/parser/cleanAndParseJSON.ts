// core/parser/cleanAndParseJSON.ts
// Parser tolerante para extrair múltiplos objetos JSON de texto livre
export function cleanAndParseJSON(text: string): Array<{ path: string; content: string }> {
  // Remove apenas as linhas de delimitadores de bloco Markdown (``` ou ```json)
  const cleaned = text.replace(/^```.*$/gm, '').trim()
  const files: Array<{ path: string; content: string }> = []

  // Função que faz parsing 'stack-based' para capturar JSONs independentes
  function extractJSONChunks(input: string): string[] {
    const chunks: string[] = []
    let depth = 0
    let startIndex = -1
    for (let i = 0; i < input.length; i++) {
      const ch = input[i]
      if (ch === '{') {
        if (depth === 0) startIndex = i
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          chunks.push(input.slice(startIndex, i + 1))
          startIndex = -1
        }
      }
    }
    return chunks
  }

  // Extrai e parseia cada chunk
  const rawChunks = extractJSONChunks(cleaned)
  for (const chunk of rawChunks) {
    try {
      const obj = JSON.parse(chunk)
      if (obj && typeof obj === 'object' && 'path' in obj && 'content' in obj) {
        files.push({ path: String((obj as any).path), content: String((obj as any).content) })
      }
    } catch {
      // Ignora JSONs inválidos
    }
  }

  return files
}
