/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Ignora erros de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Tempo máximo (segundos) para geração estática de páginas
  staticPageGenerationTimeout: 60,

  // Permite servir tudo dentro de /generated/*
  async rewrites() {
    return [
      {
        source: '/generated/:path*',
        destination: '/generated/:path*',
      },
    ]
  },
}

module.exports = nextConfig
