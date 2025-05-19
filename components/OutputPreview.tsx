// components/OutputPreview.tsx
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type FileItem = { path: string; content: string }
interface OutputPreviewProps { arquivos: FileItem[] }

export default function OutputPreview({ arquivos }: OutputPreviewProps) {
  const [selected, setSelected] = useState<number>(0)
  const [applying, setApplying] = useState(false)

  useEffect(() => { setSelected(arquivos.length ? 0 : -1) }, [arquivos])

  const aplicarArquivos = async () => {
    if (applying || arquivos.length === 0) return
    if (!confirm('Deseja aplicar todos os arquivos gerados?')) return
    setApplying(true)
    try {
      const res = await fetch('/api/fusion/apply', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ arquivos }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error||'Erro desconhecido')
      toast.success('✅ Arquivos aplicados com sucesso!')
    } catch (err:any) {
      console.error(err)
      toast.error('❌ Erro ao aplicar arquivos: '+err.message)
    } finally {
      setApplying(false)
    }
  }

  const copiarJSON = () => {
    if (!arquivos.length) return
    navigator.clipboard.writeText(JSON.stringify(arquivos,null,2))
    toast.success('📋 JSON copiado para a área de transferência!')
  }

  if (!arquivos.length) return <p className='text-gray-500'>Nenhum arquivo gerado.</p>

  return (
    <div className='bg-white border rounded shadow p-4 space-y-4'>
      <h2 className='text-xl font-semibold'>Preview de Arquivos Gerados</h2>
      {arquivos.map((file,idx)=>(
        <details key={idx} className='border rounded'>
          <summary className='cursor-pointer bg-gray-100 p-2 font-medium hover:bg-gray-200'>{file.path}</summary>
          <pre className='p-4 overflow-auto bg-gray-50 text-sm whitespace-pre-wrap'>{file.content}</pre>
        </details>
      ))}
      <div className='flex gap-2 mt-4'>
        <Button variant='outline' onClick={copiarJSON} disabled={applying}>Copiar JSON</Button>
        <Button onClick={aplicarArquivos} disabled={applying}>{applying?'Aplicando…':'Aplicar Arquivos'}</Button>
      </div>
    </div>
  )
}
