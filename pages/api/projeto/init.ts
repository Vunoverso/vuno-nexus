// pages/api/projeto/init.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// DTO validation schema
const ProjetoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  objetivo: z.string().min(5, 'Objetivo deve ter pelo menos 5 caracteres'),
  complexidade: z.enum(['iniciante', 'medio', 'avancado', 'enterprise']),
  tipo: z.string().min(2, 'Tipo deve ser especificado'),
  origem: z.enum(['novo', 'fork', 'migracao', 'continuacao']),
});

type ProjetoInput = z.infer<typeof ProjetoSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Autenticação
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  // 2) Método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 3) Validação
  const parsed = ProjetoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Dados inválidos', details: parsed.error.format() });
  }
  const data: ProjetoInput = parsed.data;

  try {
    // 4) Cria o Projeto no banco
    const projeto = await prisma.projeto.create({
      data: {
        ...data,
        userId: session.user.id,
        status: 'ativo',
      },
    });

    // 5) Registra ExecEvent (compatível com seu schema)
    await prisma.execEvent.create({
      data: {
        projetoId: projeto.id,
        tipo: 'init',
        resultado: {
          message: 'Projeto iniciado com sucesso',
          input: data
        },
        // timestamp será preenchido pelo @default(now())
      },
    });

    // 6) Gera arquivo project_context.json
    const dir = path.join(process.cwd(), 'generated', projeto.id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const contextPath = path.join(dir, 'project_context.json');
    const contextData = {
      ...data,
      userId: session.user.id,
      projetoId: projeto.id,
      criadoEm: new Date().toISOString(),
    };
    fs.writeFileSync(contextPath, JSON.stringify(contextData, null, 2));

    // 7) Retorna projeto e contexto
    return res.status(201).json({ projeto, contexto: contextData });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
