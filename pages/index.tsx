// pages/index.tsx

import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Carrega componente 3D Background apenas no cliente
const AnimatedBackground = dynamic(() => import('@/components/3DBackground'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden font-sans">
      <Head>
        <title>VUNO NEXUS OS - IA para Engenharia de Sistemas</title>
        <meta
          name="description"
          content="A plataforma cognitiva que cria sistemas com você. IA com memória, preview, refatoração e execução real de código."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e1b4b" />
        <meta property="og:title" content="VUNO NEXUS OS" />
        <meta property="og:description" content="A IA engenheira de software que transforma ideias em sistemas reais." />
        <meta property="og:image" content="/vuno-banner.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VUNO NEXUS OS" />
        <meta
          name="twitter:description"
          content="Plataforma que gera código, corrige, executa e evolui projetos com IA."
        />
        <meta name="twitter:image" content="/vuno-banner.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatedBackground />

      <header className="absolute top-0 left-0 right-0 z-20 p-6 bg-black/50 backdrop-blur border-b border-indigo-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-400">VUNO NEXUS OS</h1>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-white font-medium hover:underline"
            >
              Entrar
            </Link>
            <Link
              href="/auth/cadastro"
              className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-40 space-y-32">
        {/* HERO */}
        <section className="text-center space-y-6">
  <h2 className="text-5xl font-extrabold drop-shadow-2xl">
    O sistema que <span className="text-indigo-400">cria</span> sistemas com você
  </h2>
  <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
    Uma IA engenheira de software que transforma suas ideias em código real. Com memória por
    projeto, execução com preview, refatoração automatizada e aprendizado contínuo.
  </p>
  <div className="space-x-4">
    <Link
      href="/auth/cadastro"
      className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 transition"
    >
      Criar Conta Gratuita
    </Link>
    <Link
      href="/auth/login"
      className="text-indigo-300 font-medium hover:underline transition"
    >
      Entrar
    </Link>
  </div>
</section>

        {/* SOBRE */}
        <section id="porque-usar" className="grid md:grid-cols-3 gap-8">
          {[
            'O que é o VUNO NEXUS?',
            'O que ele faz?',
            'Para quem foi criado?',
          ].map((title, i) => (
            <div
              key={i}
              className="bg-white/10 p-6 rounded-lg backdrop-blur border border-indigo-800"
            >
              <h3 className="font-bold text-lg text-indigo-300">{title}</h3>
              <p className="text-sm text-indigo-100 mt-2">
                {i === 0 &&
                  'Uma plataforma de engenharia inteligente, onde a IA cria, refatora e organiza seu sistema.'}
                {i === 1 &&
                  'Gera projetos completos com backend, frontend, banco de dados, rotas e deploy.'}
                {i === 2 &&
                  'Desenvolvedores, freelancers, startups, empresas e qualquer criador digital.'}
              </p>
            </div>
          ))}
        </section>

        {/* POR QUE USAR */}
        <section className="bg-indigo-900/30 p-8 rounded-xl shadow-xl backdrop-blur border border-indigo-700">
          <h3 className="text-3xl font-bold text-center text-indigo-300 mb-6">
            Por que usar o VUNO NEXUS?
          </h3>
          <ul className="grid md:grid-cols-2 gap-4 text-sm text-indigo-100 list-disc list-inside">
            <li>Geração de sistemas com linguagem natural e IA contextual</li>
            <li>Preview ao vivo, rollback, histórico de execuções e refatorações</li>
            <li>Memória por projeto: o sistema aprende sua arquitetura</li>
            <li>Controle total: nenhuma mudança é aplicada sem sua confirmação</li>
            <li>Multiusuário, multiempresa, multilíngua, multi-instância</li>
            <li>Roteamento automático, documentação técnica e testes</li>
            <li>Deploy automatizado ou manual com um clique</li>
            <li>Planejamento por fases com IA e automação de arquitetura</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h3 className="text-3xl font-bold text-indigo-300 text-center">Perguntas Frequentes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'Preciso saber programar?',
                a: 'Não. A IA guia você do zero até a execução do sistema.',
              },
              {
                q: 'O sistema é gratuito?',
                a: 'Sim. Você começa com plano gratuito e terá upgrades futuros.',
              },
              {
                q: 'O código gerado é real?',
                a: 'Sim. Você pode exportar, editar, executar e implantar onde quiser.',
              },
              {
                q: 'A IA aprende com meu projeto?',
                a: 'Sim. Ela evolui com base no histórico, contexto e estrutura.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 p-4 rounded border border-indigo-800"
              >
                <p className="font-semibold text-indigo-200">{item.q}</p>
                <p className="text-sm text-indigo-100 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center mt-20">
          <h4 className="text-2xl font-bold mb-4">
            Experimente a engenharia com IA como nunca antes
          </h4>
          <Link
            href="/auth/cadastro"
            className="bg-indigo-600 text-white px-8 py-4 rounded font-semibold text-lg hover:bg-indigo-700"
          >
            Criar Conta Agora
          </Link>
        </section>
      </main>

      <footer className="relative z-30 text-center text-xs text-indigo-300 py-6">
        &copy; {new Date().getFullYear()} VUNO NEXUS OS. Todos os direitos reservados.
      </footer>
    </div>
  );
}
