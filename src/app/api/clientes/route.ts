import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { enviarEmailClienteCriadoAdmin } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Debug: Log dos dados recebidos
    console.log("Dados recebidos para cadastro:", body);
    const {
      razaoSocial,
      responsavel,
      cnpjCpf,
      inscricaoEstadual,
      inscricaoMunicipal,
      tipoEmpresa,
      condicoesPagamento,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      email,
      telefone,
      whatsapp,
      senha,
      representanteId,
    } = body;

    // Validações básicas
    if (
      !razaoSocial ||
      !responsavel ||
      !cnpjCpf ||
      !email ||
      !whatsapp ||
      !senha ||
      !cep ||
      !endereco ||
      !numero
    ) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: Razão social, responsável, CNPJ/CPF, endereço completo, email, WhatsApp e senha",
        },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const emailExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Verificar se CNPJ/CPF já existe
    const cnpjCpfExistente = await prisma.cliente.findUnique({
      where: { cnpjCpf },
    });

    if (cnpjCpfExistente) {
      return NextResponse.json(
        { error: "CNPJ/CPF já cadastrado" },
        { status: 400 }
      );
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 12);

    // Criar usuário e cliente em uma transação
    const result = await prisma.$transaction(async (tx: any) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          name: razaoSocial,
          email,
          password: hashedPassword,
          role: "CLIENTE",
        },
      });

      // Criar cliente
      const cliente = await tx.cliente.create({
        data: {
          userId: user.id,
          razaoSocial,
          responsavel,
          cnpjCpf,
          inscricaoEstadual: inscricaoEstadual || null,
          inscricaoMunicipal: inscricaoMunicipal || null,
          tipoEmpresa: tipoEmpresa || null,
          condicoesPagamento: condicoesPagamento || [],
          cep,
          endereco,
          numero,
          complemento: complemento || null,
          bairro: bairro || null,
          cidade: cidade || null,
          estado: estado || null,
          email,
          telefone: telefone || null,
          whatsapp,
        },
      });

      // Vincular representante se fornecido
      if (representanteId) {
        await tx.representanteCliente.create({
          data: {
            clienteId: cliente.id,
            representanteId,
          },
        });
      }

      return { user, cliente };
    });

    // Buscar dados do representante (se houver) para incluir no email
    let representanteDados = null;
    if (representanteId) {
      const representante = await prisma.representante.findUnique({
        where: { id: representanteId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (representante) {
        representanteDados = {
          nome: representante.user.name || "Representante",
          email: representante.user.email,
          whatsapp: representante.whatsapp || "Não informado",
        };
      }
    }

    // Se não houver representante, buscar um admin para contato
    if (!representanteDados) {
      const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      if (admin) {
        representanteDados = {
          nome: "Equipe CRC Faróis",
          email: admin.email,
          whatsapp: "(11) 99226-8645",
        };
      }
    }

    // Enviar email para o cliente (não bloquear se falhar)
    if (representanteDados) {
      enviarEmailClienteCriadoAdmin({
        nomeResponsavel: responsavel,
        razaoSocial,
        emailResponsavel: email,
        representanteNome: representanteDados.nome,
        representanteEmail: representanteDados.email,
        representanteWhatsapp: representanteDados.whatsapp,
      }).catch((error) => {
        console.error("Erro ao enviar email para cliente:", error);
      });
    }

    return NextResponse.json(result.cliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tipoEmpresa = searchParams.get("tipoEmpresa") || "";
    const estado = searchParams.get("estado") || "";
    const ativo = searchParams.get("ativo") || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filtro de busca
    if (search) {
      where.OR = [
        { razaoSocial: { contains: search, mode: "insensitive" as const } },
        { responsavel: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { cnpjCpf: { contains: search, mode: "insensitive" as const } },
      ];
    }

    // Filtros específicos
    if (tipoEmpresa) {
      where.tipoEmpresa = tipoEmpresa;
    }

    if (estado) {
      where.estado = estado;
    }

    if (ativo) {
      where.ativo = ativo === "true";
    }

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
          representantes: {
            include: {
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
          },
        },
      }),
      prisma.cliente.count({ where }),
    ]);

    return NextResponse.json({
      clientes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
