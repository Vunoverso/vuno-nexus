// pages/api/auth/verificar-token.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function verificarTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;
  if (typeof token !== 'string') {
    return res.status(400).json({ valid: false, error: 'Token inválido' });
  }

  try {
    const registro = await prisma.recuperacaoSenha.findUnique({
      where: { token }
    });

    // Token não encontrado, já usado ou expirado
    if (
      !registro ||
      registro.usado ||
      new Date() > registro.expiraEm
    ) {
      return res.status(200).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({ valid: false, error: 'Erro interno' });
  }
}


// pages/api/auth/redefinir.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export default async function redefinirSenhaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({ error: 'Método não permitido' });
  }

  const { token, novaSenha } = req.body;
  if (!token || typeof token !== 'string' || !novaSenha) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  try {
    const registro = await prisma.recuperacaoSenha.findUnique({
      where: { token }
    });

    if (
      !registro ||
      registro.usado ||
      new Date() > registro.expiraEm
    ) {
      return res.status(400).json({ error: 'Token expirado ou inválido' });
    }

    // Hash e atualização de senha
    const passwordHash = await bcrypt.hash(novaSenha, 10);
    await prisma.user.update({
      where: { id: registro.userId },
      data: { password: passwordHash }
    });

    // Marca token como usado
    await prisma.recuperacaoSenha.update({
      where: { token },
      data: { usado: true }
    });

    return res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ error: 'Erro interno ao redefinir senha' });
  }
}
