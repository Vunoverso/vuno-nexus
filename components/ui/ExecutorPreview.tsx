// components/ui/ExecutorPreview.tsx
import { useState } from "react"
import { toast } from "sonner"

export interface FilePreview {
  path: string
  content: string
}

interface ExecutorPreviewProps {
  arquivos: FilePreview[]
  onApply?: () => void
}

export default function ExecutorPreview({ arquivos, onApply }: ExecutorPreviewProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleApply = () => {
    if (onApply) {
      onApply()
      toast.success("✅ Arquivos aplicados com sucesso!")
    }
  }

  return (
    <div className="w-full border rounded shadow bg-white p-4 space-y-4">
      <h2 className="text-xl font-semibold">Arquivos Gerados</h2>

      <ul className="space-y-1">
        {arquivos.map((file, idx) => (
          <li key={idx}>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setSelected(idx)}
            >
              {file.path}
            </button>
          </li>
        ))}
      </ul>

      {selected !== null && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Preview: {arquivos[selected].path}</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
            {arquivos[selected].content}
          </pre>
        </div>
      )}

      {onApply && (
        <button
          onClick={handleApply}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Aplicar Arquivos
        </button>
      )}
    </div>
  )
}
