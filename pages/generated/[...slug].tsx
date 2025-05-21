// pages/generated/[...slug].tsx
import fs from "fs"
import path from "path"
import { GetServerSideProps } from "next"

interface PreviewProps {
  content: string
  fullPath: string
}

export default function PreviewPage({ content, fullPath }: PreviewProps) {
  return (
    <div className="min-h-screen p-8 bg-gray-950 text-green-400 font-mono text-sm overflow-auto">
      <h1 className="text-lg text-white mb-4">📄 Preview do Arquivo Gerado</h1>
      <p className="text-xs text-zinc-400 mb-6">
        Caminho: <code className="bg-zinc-800 px-2 py-1 rounded">{fullPath}</code>
      </p>
      <pre className="bg-zinc-900 p-4 rounded shadow overflow-x-auto">
        {content}
      </pre>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string[] || []
  const fullPath = path.join("generated", ...slug)
  const filePath = path.join(process.cwd(), fullPath)

  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    }
  }

  const content = fs.readFileSync(filePath, "utf8")

  return {
    props: {
      content,
      fullPath,
    },
  }
}
