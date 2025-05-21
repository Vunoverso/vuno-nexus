// pages/auth/login.tsx

import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

// Background animado sem SSR
const AnimatedBackground = dynamic(
  () => import('@/components/3DBackground'),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('E-mail ou senha inválidos');
    } else {
      router.push('/');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden font-sans">
      <Head>
        <title>Login | VUNO NEXUS OS</title>
      </Head>

      <AnimatedBackground />

      <header className="absolute top-0 left-0 right-0 z-20 p-6 bg-black/50 backdrop-blur border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">VUNO NEXUS OS</h1>
          <div className="space-x-4">
            <Link href="/" className="text-indigo-300 hover:underline">
              Home
            </Link>
            <Link href="/auth/cadastro" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-30 flex items-center justify-center px-4 py-40">
        <div className="w-full max-w-sm bg-white/10 text-white p-6 rounded shadow-lg backdrop-blur border border-indigo-800">
          <Link href="/" className="inline-block mb-4 text-indigo-200 hover:underline">
            ← Voltar para Home
          </Link>

          <h2 className="text-2xl font-bold text-center mb-4 text-indigo-300">
            Acessar sua Conta
          </h2>

          {error && <p className="text-red-400 text-sm text-center mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-indigo-600 bg-transparent p-2 rounded text-white"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-indigo-600 bg-transparent p-2 rounded text-white"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded font-semibold text-white ${
                isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <div className="text-sm text-center mt-4">
            <p>
              Esqueceu a senha?{' '}
              <Link href="/auth/recuperar" className="underline text-indigo-200">
                Recuperar acesso
              </Link>
            </p>
            <p className="mt-2">
              Ainda não tem conta?{' '}
              <Link href="/auth/cadastro" className="underline text-indigo-200">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
