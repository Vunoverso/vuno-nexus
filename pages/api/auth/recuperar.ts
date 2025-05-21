// pages/api/auth/recuperar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método não permitido' });
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail é obrigatório' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const token = randomUUID();
  const expiraEm = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.recuperacaoSenha.create({
    data: { userId: user.id, email, token, expiraEm }
  });

  await prisma.execEvent.create({
    data: {
      projetoId: '', // opcional
      tipo: 'password_recovery_request',
      resultado: { userId: user.id, email },
    }
  });

  const { error } = await supabase.auth.api.sendEmail({
    to: email,
    subject: 'Recuperação de Senha - VUNO NEXUS',
    html: `<p>Para redefinir sua senha, acesse:</p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/redefinir?token=${token}">Redefinir Senha</a>`
  });

  if (error) {
    await prisma.execEvent.create({
      data: {
        projetoId: '', tipo: 'password_recovery_email_fail', resultado: { error: error.message }
      }
    });
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }

  return res.status(200).json({ message: 'E-mail enviado' });
}