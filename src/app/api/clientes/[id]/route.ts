import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            role: true,
            createdAt: true,
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
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Se for apenas atualização de status
    if (Object.keys(body).length === 1 && "ativo" in body) {
      const cliente = await prisma.cliente.update({
        where: { id: params.id },
        data: { ativo: body.ativo },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      });

      return NextResponse.json(cliente);
    }

    // Atualização completa do cliente
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
      ativo,
      novaSenha,
      representanteId,
      horarioCorteMercadoLivre,
    } = body;

    // Validações básicas
    if (!razaoSocial || !responsavel || !cnpjCpf || !email || !whatsapp) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: Razão social, responsável, CNPJ/CPF, email, WhatsApp",
        },
        { status: 400 }
      );
    }

    // Verificar se email já existe (exceto o atual)
    const emailExistente = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          cliente: {
            id: params.id,
          },
        },
      },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "Email já está sendo usado por outro cliente" },
        { status: 400 }
      );
    }

    // Verificar se CNPJ/CPF já existe (exceto o atual)
    const cnpjCpfExistente = await prisma.cliente.findFirst({
      where: {
        cnpjCpf,
        NOT: {
          id: params.id,
        },
      },
    });

    if (cnpjCpfExistente) {
      return NextResponse.json(
        { error: "CNPJ/CPF já está sendo usado por outro cliente" },
        { status: 400 }
      );
    }

    // Atualizar cliente e usuário em transação
    const result = await prisma.$transaction(async (tx: any) => {
      // Atualizar cliente
      const cliente = await tx.cliente.update({
        where: { id: params.id },
        data: {
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
          horarioCorteMercadoLivre: horarioCorteMercadoLivre || null,
          ativo,
        },
        include: {
          user: true,
        },
      });

      // Preparar dados do usuário
      const userData: any = {
        name: razaoSocial,
        email,
      };

      // Se nova senha foi fornecida, criptografar e incluir
      if (novaSenha) {
        userData.password = await bcrypt.hash(novaSenha, 12);
      }

      // Atualizar usuário
      await tx.user.update({
        where: { id: cliente.userId },
        data: userData,
      });

      // Atualizar representante se fornecido
      if (representanteId) {
        // Verificar se o representante existe
        const representanteExiste = await tx.representante.findUnique({
          where: { id: representanteId },
        });

        if (!representanteExiste) {
          throw new Error("Representante não encontrado");
        }

        // Deletar associações antigas
        await tx.representanteCliente.deleteMany({
          where: { clienteId: params.id },
        });

        // Criar nova associação
        await tx.representanteCliente.create({
          data: {
            representanteId,
            clienteId: params.id,
          },
        });
      }

      return cliente;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar cliente para pegar o userId
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Deletar cliente e usuário em transação
    await prisma.$transaction(async (tx) => {
      await tx.cliente.delete({
        where: { id: params.id },
      });

      await tx.user.delete({
        where: { id: cliente.userId },
      });
    });

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
