/**
 * Extrai múltiplos objetos JSON de um texto livre,
 * remove blocos Markdown e retorna um array de FileItem.
 */
import { FileItem } from '@/core/types'

const JSON_BLOCK_REGEX = /```json([\s\S]*?)```/g
const GENERIC_JSON_REGEX = /\{[\s\S]*?\}/g

export function cleanAndParseJSON(raw: string): FileItem[] {
  const text = raw
    // remover blocos de markdown
    .replace(/```[\s\S]*?```/g, '')
    // remover backticks restantes
    .replace(/```/g, '')

  let matches: RegExpMatchArray | null
  const jsonStrings = [] as string[]

  // 1) Capturar blocos multiline JSON
  while ((matches = JSON_BLOCK_REGEX.exec(raw))) {
    jsonStrings.push(matches[1].trim())
  }

  // 2) Se não houver blocos, extrair qualquer {...}
  if (jsonStrings.length === 0) {
    const generic = text.match(GENERIC_JSON_REGEX)
    if (generic) jsonStrings.push(...generic)
  }

  const files: FileItem[] = []
  for (const str of jsonStrings) {
    try {
      const arr = JSON.parse(str) as any[]
      // caso retorne um único objeto ou array genérico
      const items = Array.isArray(arr) ? arr : [arr]
      for (const item of items) {
        if (item.path && item.content) {
          files.push({
            path: String(item.path).trim(),
            content: String(item.content)
          })
        }
      }
    } catch {
      // ignorar JSON inválido
      continue
    }
  }

  return files
}