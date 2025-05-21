// components/OutputPreview.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type FileItem = {
  path: string
  content: string
}

interface OutputPreviewProps {
  project: string
  arquivos: FileItem[]
}

export default function OutputPreview({ project, arquivos }: OutputPreviewProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const aplicarArquivos = async () => {
    // Confirmação bonita antes de aplicar
    const ok = window.confirm(
      `Você tem certeza que deseja aplicar ${arquivos.length} arquivo(s) no projeto “${project}”?`
    )
    if (!ok) {
      toast("🛑 Ação cancelada")
      return
    }

    // Feedback de carregamento
    const toastId = toast.loading("🔄 Aplicando arquivos...")

    try {
      const res = await fetch("/api/fusion/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, arquivos }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro desconhecido")
      }
      toast.success("✅ Arquivos aplicados com sucesso!", { id: toastId })
    } catch (err: any) {
      toast.error("❌ Erro ao aplicar arquivos: " + err.message, { id: toastId })
    }
  }

  const baixarZip = async () => {
    const toastId = toast.loading("🗜️ Gerando ZIP...")
    try {
      const res = await fetch("/api/deploy/temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, arquivos }),
      })
      if (!res.ok) throw new Error(await res.text())

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("📦 Download iniciado!", { id: toastId })
    } catch (e: any) {
      toast.error("❌ Erro ao baixar ZIP: " + e.message, { id: toastId })
    }
  }

  return (
    <div className="bg-white border rounded shadow p-4 space-y-4">
      <h2 className="text-xl font-semibold">Preview de Arquivos Gerados</h2>

      {/* Lista de arquivos clicáveis */}
      <ul className="space-y-1">
        {arquivos.map((file, idx) => (
          <li key={idx}>
            <button
              className="text-blue-600 text-sm hover:underline"
              onClick={() => setSelected(idx)}
            >
              {file.path}
            </button>
          </li>
        ))}
      </ul>

      {/* Conteúdo do arquivo selecionado */}
      {selected !== null && arquivos[selected] && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">
            Arquivo: {arquivos[selected].path}
          </h3>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
            {arquivos[selected].content}
          </pre>
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(arquivos, null, 2)
            )
            toast.success("📋 JSON copiado!")
          }}
        >
          Copiar JSON
        </Button>

        <Button
          onClick={aplicarArquivos}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Aplicar Arquivos
        </Button>

        <Button
          onClick={baixarZip}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Baixar ZIP
        </Button>
      </div>
    </div>
  )
}