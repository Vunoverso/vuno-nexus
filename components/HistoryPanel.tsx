import React, { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { getUserId } from "@/utils/getUserId"
import { toast } from "sonner"

interface HistoryItem {
  id: string
  prompt: string
  response: string
  createdAt: string
  project?: string
}

export default function HistoryPanel() {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [project, setProject] = useState("default")
  const [avaliacoes, setAvaliacoes] = useState<Record<string, string>>({})
  const userId = getUserId() || "anon-user"

  const carregarHistorico = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/fusion/history?userId=${userId}`)
      const json = await res.json()
      if (!Array.isArray(json)) throw new Error("Formato inesperado.")
      setHistory(
        json.filter(
          (item: HistoryItem) => item.project === project || project === "default"
        )
      )
    } catch {
      toast.error("Erro ao carregar histórico.")
    } finally {
      setLoading(false)
    }
  }, [userId, project])

  useEffect(() => {
    carregarHistorico()
  }, [carregarHistorico])

  const limparHistorico = useCallback(async () => {
    try {
      const res = await fetch("/api/fusion/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const json = await res.json()
      toast.success(json.message || "Histórico limpo.")
      setHistory([])
    } catch {
      toast.error("Erro ao apagar histórico.")
    }
  }, [userId])

  const executarNovamente = useCallback(
    async (prompt: string, projeto: string) => {
      await toast.promise(
        fetch("/api/fusion/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, userId, project: projeto }),
        }).then((res) => res.json()),
        {
          loading: "Executando novamente...",
          success: "✅ Prompt reexecutado com sucesso!",
          error: "Erro ao reexecutar prompt.",
        }
      )
    },
    [userId]
  )

  const avaliarPrompt = useCallback(
    async (id: string, prompt: string) => {
      try {
        const res = await fetch("/api/fusion/evaluate-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })
        const json = await res.json()
        if (json?.result) {
          setAvaliacoes((prev) => ({ ...prev, [id]: json.result }))
          toast.success("Avaliação da IA recebida.")
        } else {
          toast.error("Não foi possível avaliar esse prompt.")
        }
      } catch {
        toast.error("Erro ao avaliar prompt.")
      }
    },
    []
  )

  const exportarJSON = useCallback((entry: HistoryItem) => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt-${entry.project || "default"}-${entry.id.slice(0, 6)}.json`
    a.click()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-2xl font-semibold">🧠 Histórico de Prompts</h2>
        <div className="flex items-center gap-2">
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 p-1 rounded text-sm bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
          >
            <option value="default">Projeto: default</option>
            <option value="vuno-core">vuno-core</option>
            <option value="aethera">aethera</option>
            <option value="admin">admin</option>
          </select>
          {history.length > 0 && (
            <Button variant="destructive" onClick={limparHistorico}>
              Limpar Histórico
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando histórico...</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum histórico encontrado.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="p-4 bg-white dark:bg-zinc-900 shadow rounded border border-zinc-200 dark:border-zinc-800"
            >
              <div className="text-xs text-gray-400 mb-2">
                {new Date(entry.createdAt).toLocaleString()} — Projeto:{" "}
                <strong>{entry.project || "default"}</strong>
              </div>

              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300">Prompt:</strong>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                  {entry.prompt}
                </pre>
              </div>

              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300">Resposta:</strong>
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                  {entry.response}
                </pre>
              </div>

              {avaliacoes[entry.id] && (
                <div className="text-sm mt-2 text-green-600 dark:text-green-400 border-t pt-2">
                  ✅ Avaliação da IA:<br />
                  <span className="whitespace-pre-wrap">
                    {avaliacoes[entry.id]}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => executarNovamente(entry.prompt, entry.project || "default")}
                >
                  🔁 Executar Novamente
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => avaliarPrompt(entry.id, entry.prompt)}
                >
                  🤖 Avaliar com IA
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => exportarJSON(entry)}
                >
                  📦 Exportar JSON
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
