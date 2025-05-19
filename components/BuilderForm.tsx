// components/BuilderForm.tsx
import React, { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cleanAndParseJSON } from '@/core/parser/cleanAndParseJSON'
import { getUserId } from '@/utils/getUserId'

interface FileItem { path: string; content: string }
interface BuilderFormProps { onGerar: (arquivos: FileItem[]) => void }

export default function BuilderForm({ onGerar }: BuilderFormProps) {
  const [path, setPath] = useState('')
  const [content, setContent] = useState('')
  const [promptIA, setPromptIA] = useState('')
  const [gerando, setGerando] = useState(false)
  const [project, setProject] = useState('default')

  const handleGerar = () => {
    if (gerando) return
    if (!path.trim() || !content.trim()) {
      toast.error('Preencha o caminho e o conteúdo do arquivo.')
      return
    }
    onGerar([{ path: path.trim(), content: content.trim() }])
    toast.success('Arquivo gerado manualmente.')
    setPath('')
    setContent('')
  }

  const gerarComIA = async () => {
    if (gerando) return
    if (!promptIA.trim() || promptIA.length < 4) {
      toast.error('Digite um prompt válido para a IA.')
      return
    }
    setGerando(true)
    try {
      const res = await fetch('/api/fusion/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptIA.trim(), userId: getUserId(), project })
      })
      const json = await res.json()
      if (!json.result) {
        toast.error('Nenhum resultado gerado pela IA.')
        return
      }
      const arquivos = cleanAndParseJSON(json.result)
      if (arquivos.length === 0) {
        toast.warning('A IA respondeu, mas não retornou arquivos válidos.')
        return
      }
      onGerar(arquivos)
      toast.success('Arquivos gerados com sucesso pela IA!')
      setPromptIA('')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar com IA.')
    } finally {
      setGerando(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Projeto */}
      <div>
        <Label htmlFor="project">Nome do Projeto</Label>
        <Input id="project" value={project} onChange={e => setProject(e.target.value)} placeholder="ex: vuno-core" disabled={gerando} />
      </div>
      {/* Prompt com IA */}
      <div>
        <Label htmlFor="prompt">Prompt para a IA</Label>
        <Textarea id="prompt" value={promptIA} onChange={e => setPromptIA(e.target.value)} placeholder="Descreva o que deseja gerar..." className="h-40" disabled={gerando} />
        <Button onClick={gerarComIA} className="mt-2" disabled={gerando}>{gerando ? 'Gerando…' : 'Gerar com IA'}</Button>
      </div>
      <hr />
      {/* Manual */}
      <div>
        <Label htmlFor="path">Caminho do Arquivo</Label>
        <Input id="path" value={path} onChange={e => setPath(e.target.value)} placeholder="ex: pages/exemplo.jsx" disabled={gerando} />
      </div>
      <div>
        <Label htmlFor="content">Conteúdo do Arquivo</Label>
        <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Digite o código do arquivo aqui..." className="h-40" disabled={gerando} />
      </div>
      <Button onClick={handleGerar} disabled={gerando}>Gerar Arquivo Manualmente</Button>
    </div>
  )
}
