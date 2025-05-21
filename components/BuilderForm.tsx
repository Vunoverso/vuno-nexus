import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cleanAndParseJSON } from "@/core/parser/cleanAndParseJSON"
import { getUserId } from "@/utils/getUserId"

interface FileItem {
  path: string
  content: string
  action?: "create" | "overwrite" | "improve" | "delete"
}

interface BuilderFormProps {
  project: string
  onProjectChange: (p: string) => void
  onGerar: (arquivos: FileItem[]) => void
}

export default function BuilderForm({
  project,
  onProjectChange,
  onGerar,
}: BuilderFormProps) {
  const [path, setPath] = useState("")
  const [content, setContent] = useState("")
  const [promptIA, setPromptIA] = useState("")
  const [gerando, setGerando] = useState(false)
  const [action, setAction] = useState<FileItem["action"]>("overwrite")

  const userId = getUserId() || "anon-user"

  // ✅ Criação manual
  const handleGerar = () => {
    if (gerando) return
    if (!path.trim() || !content.trim()) {
      toast.error("Preencha o caminho e o conteúdo do arquivo.")
      return
    }
    const novoArquivo = { path: path.trim(), content: content.trim(), action }
    onGerar([novoArquivo])
    toast.success("Arquivo gerado manualmente.")
    setPath("")
    setContent("")
  }

  // ✅ Geração com IA
  const gerarComIA = async () => {
    if (gerando) return
    if (!promptIA.trim() || promptIA.length < 4) {
      toast.error("Digite um prompt válido para a IA.")
      return
    }

    setGerando(true)
    try {
      const res = await fetch("/api/fusion/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptIA.trim(),
          userId,
          project,
        }),
      })

      const json = await res.json()
      if (!json.result) {
        toast.error("Nenhum resultado gerado pela IA.")
        return
      }

      const arquivos = cleanAndParseJSON(json.result)
      if (arquivos.length === 0) {
        toast.warning("A IA respondeu, mas não retornou arquivos válidos.")
        return
      }

      const arquivosComAcao = arquivos.map((a) => ({ ...a, action: "improve" }))

      onGerar(arquivosComAcao)
      toast.success("Arquivos gerados com sucesso pela IA!")
      setPromptIA("")
    } catch (err) {
      console.error("❌ Erro na geração com IA:", err)
      toast.error("Erro ao gerar com IA.")
    } finally {
      setGerando(false)
    }
  }

  // ✅ Diagnóstico de Prisma
  const executarDiagnostico = async () => {
    try {
      const res = await fetch("/api/fusion/test-diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, project }),
      })

      const json = await res.json()
      if (json.ok) {
        toast.success("✅ Diagnóstico OK: log salvo com sucesso!")
      } else {
        toast.error("⚠️ Diagnóstico falhou: " + (json.error || "Erro desconhecido"))
      }
    } catch (err) {
      console.error("❌ Erro no diagnóstico:", err)
      toast.error("Erro ao executar diagnóstico.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Projeto selecionado */}
      <div>
        <Label htmlFor="project">Nome do Projeto</Label>
        <Input
          id="project"
          value={project}
          onChange={(e) => onProjectChange(e.target.value)}
          placeholder="ex: vuno-core"
          disabled={gerando}
        />
      </div>

      {/* Geração com IA */}
      <div>
        <Label htmlFor="prompt">Prompt para a IA</Label>
        <Textarea
          id="prompt"
          value={promptIA}
          onChange={(e) => setPromptIA(e.target.value)}
          placeholder="Descreva o que deseja gerar..."
          className="h-40"
          disabled={gerando}
        />
        <Button
          onClick={gerarComIA}
          className="mt-2"
          disabled={gerando}
        >
          {gerando ? "Gerando…" : "Gerar com IA"}
        </Button>
      </div>

      <hr />

      {/* Geração manual */}
      <div>
        <Label htmlFor="path">Caminho do Arquivo</Label>
        <Input
          id="path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="ex: pages/exemplo.tsx"
          disabled={gerando}
        />
      </div>

      <div>
        <Label htmlFor="content">Conteúdo do Arquivo</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite o código do arquivo aqui..."
          className="h-40"
          disabled={gerando}
        />
      </div>

      <div>
        <Label htmlFor="action">Ação</Label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value as any)}
          disabled={gerando}
          className="w-full border p-2 rounded"
        >
          <option value="overwrite">overwrite</option>
          <option value="create">create</option>
          <option value="improve">improve</option>
          <option value="delete">delete</option>
        </select>
      </div>

      <Button onClick={handleGerar} disabled={gerando}>
        Gerar Arquivo Manualmente
      </Button>

      <hr className="my-4" />

      {/* Diagnóstico Prisma */}
      <div className="space-y-2">
        <Label>Diagnóstico Rápido</Label>
        <p className="text-sm text-muted-foreground">
          Testa se o Prisma está salvando corretamente os logs de execução.
        </p>
        <Button variant="secondary" onClick={executarDiagnostico}>
          Executar Diagnóstico
        </Button>
      </div>
    </div>
  )
}
