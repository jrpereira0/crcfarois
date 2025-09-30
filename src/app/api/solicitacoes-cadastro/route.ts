import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { enviarEmailSolicitacaoCadastro } from "@/lib/email";

// POST - Criar nova solicitação de cadastro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razaoSocial,
      cnpj,
      inscricaoEstadual,
      inscricaoMunicipal,
      tipoEmpresa,
      nomeResponsavel,
      emailResponsavel,
      telefoneResponsavel,
      whatsappResponsavel,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      senha,
    } = body;

    // Validações básicas
    if (
      !razaoSocial ||
      !cnpj ||
      !nomeResponsavel ||
      !emailResponsavel ||
      !whatsappResponsavel ||
      !cep ||
      !endereco ||
      !numero ||
      !bairro ||
      !cidade ||
      !estado ||
      !senha
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Verificar se CNPJ já existe
    const cnpjExistente = await prisma.cliente.findFirst({
      where: { cnpjCpf: cnpj },
    });

    if (cnpjExistente) {
      return NextResponse.json(
        { error: "CNPJ já cadastrado no sistema" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const emailExistente = await prisma.user.findFirst({
      where: { email: emailResponsavel },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Email já cadastrado no sistema" },
        { status: 400 }
      );
    }

    // Verificar se já existe solicitação pendente com mesmo CNPJ ou email
    // Permitir novo cadastro se a solicitação anterior foi negada
    const solicitacaoExistente = await prisma.solicitacaoCadastro.findFirst({
      where: {
        OR: [{ cnpj: cnpj }, { emailResponsavel: emailResponsavel }],
        status: "PENDENTE", // Apenas bloqueia se tiver pendente
      },
    });

    if (solicitacaoExistente) {
      return NextResponse.json(
        {
          error:
            "Já existe uma solicitação pendente com estes dados. Aguarde a análise.",
        },
        { status: 400 }
      );
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Criar solicitação
    const solicitacao = await prisma.solicitacaoCadastro.create({
      data: {
        razaoSocial,
        cnpj,
        inscricaoEstadual,
        inscricaoMunicipal,
        tipoEmpresa,
        nomeResponsavel,
        emailResponsavel,
        telefoneResponsavel,
        whatsappResponsavel,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        senha: senhaHash,
        status: "PENDENTE",
      },
    });

    // Enviar email de confirmação (não bloquear a resposta se falhar)
    enviarEmailSolicitacaoCadastro({
      nomeResponsavel,
      razaoSocial,
      emailResponsavel,
    }).catch((error) => {
      console.error("Erro ao enviar email de confirmação:", error);
      // Não bloqueia a criação da solicitação se o email falhar
    });

    return NextResponse.json({
      message: "Solicitação enviada com sucesso",
      solicitacao: {
        id: solicitacao.id,
        razaoSocial: solicitacao.razaoSocial,
        status: solicitacao.status,
      },
    });
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Listar solicitações (apenas para admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { razaoSocial: { contains: search, mode: "insensitive" } },
        { cnpj: { contains: search } },
        { nomeResponsavel: { contains: search, mode: "insensitive" } },
        { emailResponsavel: { contains: search, mode: "insensitive" } },
      ];
    }

    const solicitacoes = await prisma.solicitacaoCadastro.findMany({
      where,
      include: {
        aprovadoPor: {
          select: {
            name: true,
            email: true,
          },
        },
        representante: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ solicitacoes });
  } catch (error) {
    console.error("Erro ao buscar solicitações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
