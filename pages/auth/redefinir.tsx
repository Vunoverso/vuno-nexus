// pages/auth/redefinir.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(() => import('@/components/3DBackground'), {
  ssr: false
});

export default function RedefinirPage() {
  const router = useRouter();
  const { token } = router.query;
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [status, setStatus] = useState<'validating'|'ready'|'error'|'success'>('validating');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (typeof token === 'string') {
      fetch(`/api/auth/verificar-token?token=${token}`)
        .then(r => r.json())
        .then(data => {
          if (data.valid) setStatus('ready');
          else { setStatus('error'); setMsg('Token inválido ou expirado'); }
        });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmar) { setMsg('Senhas não coincidem'); return; }
    const res = await fetch('/api/auth/redefinir', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ token, novaSenha })
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); }
    else { setStatus('success'); setMsg('Senha atualizada! Redirecionando...'); setTimeout(() => router.push('/auth/login'),2000); }
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-white font-sans overflow-hidden">
      <Head><title>Redefinir Senha | VUNO NEXUS OS</title></Head>
      <AnimatedBackground />
      <div className="relative z-20 flex justify-center items-center min-h-screen">
        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded shadow-lg border border-indigo-800 backdrop-blur max-w-sm w-full">
          <h2 className="text-center text-2xl font-bold text-indigo-300 mb-4">Redefinir Senha</h2>
          {status==='validating' && <p>Validando token...</p>}
          {status==='error' && <p className="text-red-400 mb-4">{msg}</p>}
          {status==='ready' && (
            <>
              <input type="password" placeholder="Nova senha" className="w-full mb-3 p-2 border border-indigo-600 rounded bg-transparent text-white" value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} required />
              <input type="password" placeholder="Confirmar senha" className="w-full mb-3 p-2 border border-indigo-600 rounded bg-transparent text-white" value={confirmar} onChange={e=>setConfirmar(e.target.value)} required />
              <button type="submit" className="w-full bg-indigo-600 py-2 rounded text-white font-semibold hover:bg-indigo-700">Atualizar Senha</button>
              {msg && <p className="text-sm text-red-400 mt-2">{msg}</p>}
            </>
          )}
          {status==='success' && <p className="text-green-400 text-center">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
