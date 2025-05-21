// components/ExecutionHistoryPanel.tsx
import React, { useEffect, useState } from "react"
import { getUserId } from "@/utils/getUserId"
import { Badge } from "@/components/ui/badge"

interface ExecucaoItem {
  id: string
  userId: string
  projeto: string
  linguagem: string
  path: string
  entrada: string
  saida: string
  status: string
  criadoEm: string
}

export default function ExecutionHistoryPanel({ project }: { project?: string }) {
  const [list, setList] = useState<ExecucaoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = getUserId() || "anon-user"
    const url = `/api/fusion/exec-history?userId=${uid}${project ? `&project=${project}` : ""}`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setList(data)
      })
      .finally(() => setLoading(false))
  }, [project])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📜 Histórico de Execuções</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando execuções…</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma execução registrada.</p>
      ) : (
        <ul className="space-y-2">
          {list.map(item => (
            <li key={item.id} className="p-3 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
              <div className="flex justify-between items-center">
                <div className="text-xs text-zinc-400">
                  {new Date(item.criadoEm).toLocaleString()} — <strong>{item.linguagem}</strong> — {item.projeto} / {item.path}
                </div>
                <Badge variant={item.status === "success" ? "default" : "destructive"}>{item.status}</Badge>
              </div>
              <pre className="mt-2 text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
                {item.saida}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
