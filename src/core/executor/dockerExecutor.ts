import { mkdtempSync, writeFileSync, rmSync } from "fs"
import { join } from "path"
import os from "os"
import { exec } from "child_process"

export interface ExecResult {
  stdout: string
  stderr: string
  error?: string
}

interface ImageConfig {
  image: string
  runCmd: (fileName: string) => string
}

const imageMap: Record<string, ImageConfig> = {
  ts:  { image:"node:18",           runCmd: fn => `node ${fn}` },
  js:  { image:"node:18",           runCmd: fn => `node ${fn}` },
  py:  { image:"python:3.11-slim",  runCmd: fn => `python3 ${fn}` },
  php: { image:"php:8-cli",         runCmd: fn => `php ${fn}` },
  sh:  { image:"alpine:latest",     runCmd: fn => `sh ${fn}` },
  go:  { image:"golang:1.20-alpine",runCmd: fn => `go run ${fn}` },
  rb:  { image:"ruby:3.2-alpine",   runCmd: fn => `ruby ${fn}` },
  rs:  { image:"rust:latest",       runCmd: fn => `rustc ${fn} && ./$(basename ${fn} .rs)` },
  c:   { image:"gcc:latest",        runCmd: fn => `gcc ${fn} -o a.out && ./a.out` },
  cpp: { image:"gcc:latest",        runCmd: fn => `g++ ${fn} -o a.out && ./a.out` },
  java:{ image:"openjdk:17",        runCmd: fn => `javac ${fn} && java ${fn.replace(/\\.java$/, "")}` },
}

export async function usarContainerExecutor(
  filePath: string,
  content: string
): Promise<ExecResult> {
  const ext = filePath.split(".").pop()!.toLowerCase()
  const cfg = imageMap[ext]
  if (!cfg) {
    return { stdout:"", stderr:"", error:`Extensão .${ext} não suportada no executor Docker.` }
  }

  const tmpDir = mkdtempSync(join(os.tmpdir(), "builder-"))
  const fileName = `arquivo.${ext}`
  const fullPath = join(tmpDir, fileName)
  writeFileSync(fullPath, content, "utf8")

  const dockerCmd = [
    "docker run --rm",
    `-v ${tmpDir}:/workspace`,
    `-w /workspace`,
    `${cfg.image}`,
    cfg.runCmd(fileName)
  ].join(" ")

  return new Promise(resolve => {
    exec(dockerCmd, { timeout: 10000, maxBuffer: 1024 * 1024 * 5 }, (err, stdout, stderr) => {
      try { rmSync(tmpDir, { recursive: true, force: true }) } catch {}
      if (err) return resolve({ stdout, stderr, error: err.message })
      resolve({ stdout, stderr })
    })
  })
}
