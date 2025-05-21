// pages/api/auth/redefinir.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método não permitido' });
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha)
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });

  const registro = await prisma.recuperacaoSenha.findUnique({ where: { token } });
  if (!registro || registro.usado || new Date() > registro.expiraEm) {
    await prisma.execEvent.create({ type: 'password_reset_fail', resultado: { token } });
    return res.status(400).json({ error: 'Token inválido ou expirado' });
  }

  const passwordHash = await bcrypt.hash(novaSenha, 10);
  await prisma.user.update({ where: { id: registro.userId }, data: { password: passwordHash } });
  await prisma.recuperacaoSenha.update({ where: { token }, data: { usado: true } });

  await prisma.execEvent.create({
    data: { tipo: 'password_reset_success', resultado: { userId: registro.userId } }
  });

  return res.status(200).json({ message: 'Senha redefinida com sucesso' });
}
