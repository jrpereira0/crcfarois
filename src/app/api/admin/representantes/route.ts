import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { enviarEmailRepresentanteCriadoAdmin } from "@/lib/email";

// GET - Listar todos os representantes (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const representantes = await prisma.representante.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        clientes: {
          include: {
            cliente: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            clientes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ representantes });
  } catch (error) {
    console.error("Erro ao buscar representantes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo representante (admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const {
      name,
      email,
      password,
      cpf,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      whatsapp,
      banco,
      agencia,
      conta,
      tipoConta,
      chavePix,
      comissaoPercentual,
    } = await request.json();

    // Validações básicas
    if (!name || !email || !password || !cpf) {
      return NextResponse.json(
        { error: "Nome, email, senha e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const emailExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 400 }
      );
    }

    // Verificar se CPF já existe
    const cpfExistente = await prisma.representante.findUnique({
      where: { cpf: cpf.replace(/\D/g, "") },
    });

    if (cpfExistente) {
      return NextResponse.json(
        { error: "CPF já está em uso" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário e representante
    const representante = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "REPRESENTANTE",
        },
      });

      // Criar dados do representante
      const representanteData = await tx.representante.create({
        data: {
          userId: user.id,
          cpf: cpf.replace(/\D/g, ""),
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          cep: cep.replace(/\D/g, ""),
          whatsapp: whatsapp?.replace(/\D/g, ""),
          banco,
          agencia,
          conta,
          tipoConta,
          chavePix,
          comissaoPercentual: parseFloat(comissaoPercentual) || 0,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
      });

      return representanteData;
    });

    // Enviar email de boas-vindas ao representante (não bloquear se falhar)
    enviarEmailRepresentanteCriadoAdmin({
      nomeRepresentante: name,
      emailRepresentante: email,
    }).catch((error) => {
      console.error("Erro ao enviar email para representante:", error);
    });

    return NextResponse.json({
      success: true,
      representante,
    });
  } catch (error) {
    console.error("Erro ao criar representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
