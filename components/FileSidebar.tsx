// components/FileSidebar.tsx
import React from "react"

interface FileItem {
  path: string
  content: string
  status?: string
}

interface Props {
  files: FileItem[]
  onSelect: (file: FileItem) => void
}

const colorMap: Record<string, string> = {
  created: "bg-green-200 text-green-800",
  overwritten: "bg-blue-200 text-blue-800",
  improved: "bg-purple-200 text-purple-800",
  unchanged: "bg-gray-200 text-gray-800",
  deleted: "bg-red-200 text-red-800",
  invalid_path: "bg-yellow-200 text-yellow-800",
  error: "bg-red-100 text-red-600"
}

export default function FileSidebar({ files, onSelect }: Props) {
  return (
    <aside className="w-64 bg-zinc-100 dark:bg-zinc-900 p-4 border-r space-y-2 overflow-y-auto">
      <h3 className="font-semibold text-sm text-zinc-600 dark:text-zinc-300">
        Arquivos Gerados
      </h3>
      {files.length === 0 ? (
        <p className="text-xs text-zinc-400">Nenhum arquivo ainda.</p>
      ) : (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li key={i} className="flex items-center justify-between">
              <button
                className="text-left w-full text-sm text-indigo-600 hover:underline"
                onClick={() => onSelect(file)}
              >
                {file.path.endsWith(".tsx") ? "🧪" : "📄"} {file.path}
              </button>
              {file.status && (
                <span
                  title={file.status}
                  className={`ml-2 px-1 text-xs font-medium rounded ${colorMap[file.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {file.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
