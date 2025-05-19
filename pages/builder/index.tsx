// pages/builder/index.tsx
import React, { useState } from "react"
import BuilderForm from "@/components/BuilderForm"
import OutputPreview from "@/components/OutputPreview"

export default function BuilderPage() {
  const [arquivos, setArquivos] = useState([])

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Builder Inteligente</h1>
        <p className="text-muted-foreground">Gere arquivos do seu sistema com IA ou manualmente.</p>

        <BuilderForm onGerar={setArquivos} />

        {arquivos.length > 0 && <OutputPreview arquivos={arquivos} />}
      </div>
    </main>
  )
}
