// core/useFusion.ts
import { useState, useCallback, useEffect } from 'react'
import { PrismaClient } from '@prisma/client'

export function useFusion() {
  const [data, setData] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (prompt: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/fusion/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const json = await res.json()
      if (res.ok) {
        setData(json.result)
        // re-carrega histórico após gravação
        fetchHistory()
      } else {
        throw new Error(json.result || 'Erro desconhecido')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/fusion/history')
      const list = await res.json()
      if (!Array.isArray(list)) throw new Error('Histórico inválido')
      setHistory(list)
    } catch (err: any) {
      console.error('Erro ao buscar histórico:', err)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { data, history, loading, error, execute }
}
