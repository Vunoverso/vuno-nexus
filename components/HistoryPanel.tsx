import { useEffect, useState } from "react"
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

  const carregarHistorico = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/fusion/history?userId=${getUserId()}&project=${project}`)
      const json = await res.json()
      if (!Array.isArray(json)) throw new Error("Formato inesperado.")
      setHistory(json)
    } catch (err) {
      toast.error("Erro ao carregar histórico.")
    } finally {
      setLoading(false)
    }
  }

  const limparHistorico = async () => {
    try {
      const res = await fetch("/api/fusion/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: getUserId(), project })
      })

      const json = await res.json()
      toast.success(json.message || "Histórico limpo com sucesso.")
      setHistory([])
    } catch (err) {
      toast.error("Erro ao apagar histórico.")
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [project])

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-2xl font-semibold">Histórico de Prompts</h2>
        <div className="flex items-center gap-2">
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="border p-1 rounded text-sm"
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
        <p className="text-sm text-muted-foreground">Nenhum histórico encontrado.</p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="p-4 bg-white shadow rounded">
              <div className="text-xs text-gray-400 mb-2">
                {new Date(entry.createdAt).toLocaleString()}
              </div>
              <div className="mb-2">
                <strong className="text-gray-700">Prompt:</strong>
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {entry.prompt}
                </pre>
              </div>
              <div>
                <strong className="text-gray-700">Resposta:</strong>
                <pre className="whitespace-pre-wrap text-sm text-gray-900">
                  {entry.response}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
