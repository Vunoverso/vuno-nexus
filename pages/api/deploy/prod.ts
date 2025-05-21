// pages/api/deploy/prod.ts
import { readdir, readFile } from "fs/promises";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

type FileItem = { path: string; content: string };

async function collectFiles(dir: string, prefix = ""): Promise<FileItem[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  let files: FileItem[] = [];

  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    const relPath = path.join(prefix, e.name);
    if (e.isDirectory()) {
      files.push(...await collectFiles(fullPath, relPath));
    } else if (e.isFile()) {
      const buf = await readFile(fullPath);
      files.push({
        path: relPath.replace(/\\/g, "/"),
        content: buf.toString("base64")
      });
    }
  }

  return files;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const { project } = req.body;
  if (typeof project !== "string") return res.status(400).json({ error: "Falta o nome do projeto." });

  const GENERATED_ROOT = path.join(process.cwd(), "generated", project);
  try {
    // 1) Recolhe todos os arquivos em generated/{project}
    const files = await collectFiles(GENERATED_ROOT);

    // 2) Chama a API Vercel
    const vercelRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`
      },
      body: JSON.stringify({
        name: project,
        files: files.map(f => ({ file: f.path, data: f.content })),
        project: process.env.VERCEL_PROJECT_ID,
      })
    });
    const data = await vercelRes.json();
    if (!vercelRes.ok) {
      console.error("Vercel deploy error:", data);
      return res.status(vercelRes.status).json({ error: data.error || data });
    }

    // 3) Retorna URL do preview
    return res.status(200).json({ url: data.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
