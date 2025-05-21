// pages/api/auth/cadastro.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

const RegisterSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z
    .string()
    .min(6, 'Senha deve ter ao menos 6 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos 1 letra maiúscula'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Método não permitido');
  }

  // 1) validação de payload
  const parse = RegisterSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Dados inválidos', details: parse.error.flatten().fieldErrors });
  }
  const { nome, email, senha } = parse.data;

  try {
    // 2) check de e-mail duplicado
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    // 3) hashing da senha
    const passwordHash = await bcrypt.hash(senha, 10);

    // 4) criação do usuário
    const user = await prisma.user.create({
      data: { nome, email, password: passwordHash },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    // 5) resposta limpa (sem expor passwordHash)
    return res.status(201).json({ user });
  } catch (err: any) {
    console.error('Cadastro falhou:', err);
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário' });
  }
}
