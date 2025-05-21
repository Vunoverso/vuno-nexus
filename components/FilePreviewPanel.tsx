import React from "react"

interface Props {
  file?: { path: string; content: string }
}

export default function FilePreviewPanel({ file }: Props) {
  return (
    <div className="flex-1 p-4 bg-white dark:bg-zinc-950 overflow-auto">
      {file ? (
        <>
          <div className="text-sm mb-2 text-zinc-500">📄 {file.path}</div>
          <pre className="text-sm whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-900 p-4 rounded border overflow-auto">
            {file.content}
          </pre>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Selecione um arquivo para visualizar.</p>
      )}
    </div>
  )
}
