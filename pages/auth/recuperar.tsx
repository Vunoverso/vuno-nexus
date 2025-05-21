// pages/auth/recuperar.tsx

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Background animado sem SSR
const AnimatedBackground = dynamic(
  () => import('@/components/3DBackground'),
  { ssr: false }
);

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    try {
      const res = await fetch('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar e-mail');
      setMensagem('Um e-mail com instruções foi enviado. Verifique sua caixa de entrada.');
    } catch (err: any) {
      setErro(err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden font-sans">
      <Head>
        <title>Recuperar Senha | VUNO NEXUS OS</title>
      </Head>

      <AnimatedBackground />

      <header className="absolute top-0 left-0 right-0 z-40 p-6 bg-black/50 backdrop-blur border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">VUNO NEXUS OS</h1>
          <div className="space-x-4">
            <Link href="/" className="text-indigo-300 hover:underline">
              Home
            </Link>
            <Link href="/auth/login" className="text-white hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-20 flex items-center justify-center px-4 pt-40 pb-20">
        <div className="w-full max-w-sm bg-white/10 p-6 rounded shadow-lg backdrop-blur border border-indigo-800">
          <Link href="/" className="inline-block mb-4 text-indigo-200 hover:underline">
            ← Voltar para Home
          </Link>

          <h2 className="text-2xl font-bold text-center mb-2 text-indigo-300">
            Recuperar Acesso
          </h2>
          <p className="text-sm text-indigo-100 text-center mb-4">
            Informe seu e-mail cadastrado para redefinir a senha.
          </p>

          {mensagem && <p className="text-green-400 text-sm text-center mb-2">{mensagem}</p>}
          {erro && <p className="text-red-400 text-sm text-center mb-2">{erro}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full border border-indigo-600 bg-transparent p-2 rounded text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
            >
              Enviar Instruções
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Já lembrou sua senha?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}