import React, { useState, useEffect, useMemo } from 'react'
import { useFusion } from '@/core/useFusion'
import { extractFileBlocks } from '@/core/parser/convertTextToJSON'
import ExecutorPreview from '@/components/ui/ExecutorPreview'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HistoryPanel from '@/components/HistoryPanel'
import { toast, Toaster } from 'sonner'

export default function IAConsole() {
  const [prompt, setPrompt] = useState('')
  const [rawMode, setRawMode] = useState(false)
  const [arquivosDetectados, setArquivosDetectados] = useState([])
  const { data, loading, error, execute } = useFusion()

  const highlights = useMemo(() => {
    if (!data) return []
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^\d+\.\s+/.test(line))
      .map(line => line.replace(/^\d+\.\s+/, ''))
  }, [data])

  const executarIA = async () => {
    await execute(prompt)
  }

  const aplicarArquivos = async () => {
    if (arquivosDetectados.length === 0) return
    await fetch('/api/fusion/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arquivos: arquivosDetectados })
    })
    toast.success('Arquivos aplicados com sucesso!')
  }

  // Detecta arquivos automaticamente após resposta
  useEffect(() => {
    if (data) {
      const extraidos = extractFileBlocks(data)
      setArquivosDetectados(extraidos)
    } else {
      setArquivosDetectados([])
    }
  }, [data])

  return (
    <>
      <Toaster position="top-right" theme="light" />
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center gap-8">
        {/* Painel de Prompt + Execução */}
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Console de IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="h-32"
              placeholder="Digite seu prompt de IA aqui..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <Button onClick={executarIA} disabled={loading}>
                {loading ? 'Executando...' : 'Executar'}
              </Button>
              <Button variant="outline" onClick={() => setRawMode(prev => !prev)}>
                {rawMode ? 'Ver Formatado' : 'Ver Raw JSON'}
              </Button>
            </div>

            {error && <p className="text-red-600">Erro: {error}</p>}

            {data && (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rawMode ? (
                    <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                      {JSON.stringify({ result: data }, null, 2)}
                    </pre>
                  ) : (
                    <>
                      <pre className="whitespace-pre-wrap">{data}</pre>
                      {highlights.length > 0 && (
                        <div className="pt-2">
                          <div className="mb-2 font-semibold">Destaques:</div>
                          <div className="flex flex-wrap gap-2">
                            {highlights.map((text, idx) => (
                              <Badge key={idx}>{text}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Preview dos Arquivos Detectados */}
            {arquivosDetectados.length > 0 && (
              <ExecutorPreview arquivos={arquivosDetectados} onApply={aplicarArquivos} />
            )}
          </CardContent>
        </Card>

        <HistoryPanel />
      </div>
    </>
  )
}
