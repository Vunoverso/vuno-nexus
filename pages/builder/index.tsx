import React, { useState, useEffect } from "react"
import FileSidebar from "@/components/FileSidebar"
import FilePreviewPanel from "@/components/FilePreviewPanel"
import BuilderForm from "@/components/BuilderForm"
import HistoryPanel from "@/components/HistoryPanel"
import SimulatedRenderer from "@/components/SimulatedRenderer"
import ExecutionHistoryPanel from "@/components/ExecutionHistoryPanel"
import { Button } from "@/components/ui/button"

interface FileItem {
  path: string
  content: string
  action?: "create" | "overwrite" | "improve" | "delete"
}

export default function BuilderPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | undefined>()
  const [project, setProject] = useState("default")
  const [refreshKey, setRefreshKey] = useState(0)
  const [historyKey, setHistoryKey] = useState(0)
  const [projectLanguage, setProjectLanguage] = useState("plaintext")
  const [executionLog, setExecutionLog] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/fusion/detect-language?project=${project}`)
      .then(r => r.json())
      .then(json => setProjectLanguage(json.language))
  }, [project])

  const handleAddArquivos = (novosArquivos: FileItem[]) => {
    const atualizados = [...files, ...novosArquivos]
    setFiles(atualizados)
    setSelectedFile(novosArquivos[0])
    setRefreshKey((prev) => prev + 1)
    setHistoryKey((prev) => prev + 1)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const exportarJSON = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const blob = new Blob([JSON.stringify(files, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `arquivos-${project}-${timestamp}.json`
    a.click()
  }

  const executarArquivo = async () => {
    if (!selectedFile) return
    const res = await fetch("/api/fusion/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: selectedFile.path,
        content: selectedFile.content,
        projectLanguage,
        project,
        userId: "anon-user"
      })
    })
    const json = await res.json()
    setExecutionLog(json.output || "[Sem saída]")
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
      {/* Painel lateral com arquivos */}
      <aside className="w-64 border-r bg-white dark:bg-zinc-950 p-4 hidden md:block">
        <FileSidebar files={files} onSelect={setSelectedFile} />
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Formulário principal */}
        <header className="p-4 border-b bg-white dark:bg-zinc-950 shadow-sm">
          <BuilderForm
            project={project}
            onProjectChange={setProject}
            onGerar={handleAddArquivos}
          />
        </header>

        {/* Preview + Simulação */}
        <main className="flex-1 overflow-auto p-4 bg-zinc-50 dark:bg-zinc-900 space-y-6">
          {/* Preview do arquivo selecionado */}
          <FilePreviewPanel file={selectedFile} projectLanguage={projectLanguage} />

          {/* Botão para abrir no navegador real */}
          {selectedFile && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Preview do arquivo: <strong>{selectedFile.path}</strong>
              </p>
              <div className="flex gap-2">
                <a
                  href={`/generated/${selectedFile.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">🧪 Visualizar no Navegador</Button>
                </a>
                <Button onClick={executarArquivo}>⚙️ Executar Arquivo</Button>
              </div>
            </div>
          )}

          {/* Resultado da execução */}
          {executionLog && (
            <div className="mt-4">
              <h3 className="font-bold mb-1">📄 Saída do Executor</h3>
              <pre className="bg-black text-green-400 p-4 rounded text-sm whitespace-pre-wrap">
                {executionLog}
              </pre>
            </div>
          )}

          {/* Etapa 7.4 - Preview Sandpack ao vivo */}
          {files.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">⚡ Simulação Interativa</h2>
              <SimulatedRenderer key={refreshKey} files={files} />
            </div>
          )}

          {/* Painel adicional: Histórico de Execuções (fase 8.5) */}
          <div className="mt-8">
            <ExecutionHistoryPanel project={project} />
          </div>
        </main>

        {/* Rodapé com histórico e exportação */}
        <footer className="border-t bg-white dark:bg-zinc-950 p-4 space-y-4">
          {files.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {files.length} arquivo(s) gerado(s) neste projeto.
              </p>
              <Button onClick={exportarJSON}>
                📦 Exportar Arquivos Gerados
              </Button>
            </div>
          )}
          <HistoryPanel key={historyKey} />
        </footer>
      </div>
    </div>
  )
}
