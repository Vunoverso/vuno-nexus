// pages/auth/cadastro.tsx

import React, { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import dynamic from "next/dynamic"

// Carrega o AnimatedBackground apenas no cliente
const AnimatedBackground = dynamic(
  () => import("@/components/3DBackground"),
  { ssr: false }
)

const CadastroPage: React.FC = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    repetirSenha: "",
    tipoUsuario: "dev",
    linguagens: [] as string[],
    plataforma: "web",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const linguagensDisponiveis = [
    "JavaScript",
    "TypeScript",
    "Python",
    "PHP",
    "Go",
    "Java",
    "C#",
  ]
  const tiposUsuario = [
    { value: "dev", label: "Desenvolvedor" },
    { value: "gestor", label: "Gestor" },
    { value: "empresa", label: "Empresa" },
    { value: "aluno", label: "Estudante" },
  ]
  const plataformas = ["web", "mobile", "api", "iot"]

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleCheckboxChange(ling: string) {
    setForm((f) => {
      const langs = f.linguagens.includes(ling)
        ? f.linguagens.filter((l) => l !== ling)
        : [...f.linguagens, ling]
      return { ...f, linguagens: langs }
    })
  }

  function validatePassword(s: string) {
    return s.length >= 6 && /[A-Z]/.test(s)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    if (form.email !== form.confirmarEmail) {
      setError("Os e-mails não conferem")
      setIsSubmitting(false)
      return
    }
    if (form.senha !== form.repetirSenha) {
      setError("As senhas não coincidem")
      setIsSubmitting(false)
      return
    }
    if (!validatePassword(form.senha)) {
      setError("Senha deve ter ao menos 6 caracteres e 1 letra maiúscula")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "Erro ao cadastrar")
      }
      setSuccess(true)
      await signIn("credentials", {
        redirect: true,
        email: form.email,
        password: form.senha,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden font-sans">
      <AnimatedBackground />

      <header className="absolute top-0 left-0 right-0 z-20 p-6 bg-black/50 backdrop-blur border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">VUNO NEXUS OS</h1>
          <div className="space-x-4">
            <Link href="/" className="text-indigo-300 hover:underline">
              Home
            </Link>
            <Link href="/auth/login" className="text-white hover:underline">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-30 flex items-center justify-center px-4 py-40">
        <div className="w-full max-w-md bg-white text-gray-900 p-6 rounded shadow-lg">
          <Link
            href="/"
            className="inline-block mb-4 text-indigo-600 hover:underline"
          >
            ← Voltar para Home
          </Link>

          <h2 className="text-2xl font-bold text-center mb-4">Cadastro</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">Cadastro realizado!</p>}

          <form
            onSubmit={handleSubmit}
            aria-live="polite"
            className="space-y-4"
          >
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block font-medium">
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* E-mail */}
            <div>
              <label htmlFor="email" className="block font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Confirmar e-mail */}
            <div>
              <label htmlFor="confirmarEmail" className="block font-medium">
                Confirmar e-mail
              </label>
              <input
                id="confirmarEmail"
                type="email"
                name="confirmarEmail"
                value={form.confirmarEmail}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block font-medium">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Repetir senha */}
            <div>
              <label htmlFor="repetirSenha" className="block font-medium">
                Repetir senha
              </label>
              <input
                id="repetirSenha"
                type="password"
                name="repetirSenha"
                value={form.repetirSenha}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Tipo de usuário */}
            <div>
              <label htmlFor="tipoUsuario" className="block font-medium">
                Tipo de usuário
              </label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={form.tipoUsuario}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {tiposUsuario.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Linguagens favoritas */}
            <div>
              <p className="block font-medium">Linguagens favoritas</p>
              <div className="flex flex-wrap gap-2">
                {linguagensDisponiveis.map((ling) => (
                  <label
                    key={ling}
                    className="inline-flex items-center gap-1"
                  >
                    <input
                      type="checkbox"
                      checked={form.linguagens.includes(ling)}
                      onChange={() => handleCheckboxChange(ling)}
                      className="form-checkbox"
                    />
                    <span>{ling}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Plataforma */}
            <div>
              <label htmlFor="plataforma" className="block font-medium">
                Tipo de projeto
              </label>
              <select
                id="plataforma"
                name="plataforma"
                value={form.plataforma}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {plataformas.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-gray-500">
              Modo gratuito ativado por padrão. (Plano futuro: premium)
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded text-white ${
                isSubmitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600"
              }`}
            >
              {isSubmitting ? "Enviando…" : "Cadastrar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Já tem conta?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

// Define displayName para evitar warning
CadastroPage.displayName = "CadastroPage"
