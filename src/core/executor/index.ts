import { usarContainerExecutor } from "./dockerExecutor"
import { usarEsbuildExecutor }   from "./esbuild"
import { usarEvalExecutor }      from "./eval"

export async function executarArquivo(
  filePath: string,
  content: string,
  projectLanguage?: string
) {
  const ext = filePath.split(".").pop()!.toLowerCase()

  if ((ext === "ts" || ext === "tsx") && projectLanguage === "typescript") {
    return usarEsbuildExecutor(filePath, content)
  }

  if (ext === "js" && projectLanguage === "javascript") {
    return usarEvalExecutor(filePath, content)
  }

  return usarContainerExecutor(filePath, content)
}
