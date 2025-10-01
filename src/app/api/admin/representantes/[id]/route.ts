import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Buscar representante específico (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    const representante = await prisma.representante.findUnique({
      where: { id },
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
      },
    });

    if (!representante) {
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ representante });
  } catch (error) {
    console.error("Erro ao buscar representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar representante (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("=== ATUALIZANDO REPRESENTANTE ===");
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      console.log("Usuário não autorizado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    console.log("ID do representante:", id);

    const requestBody = await request.json();
    console.log("Dados recebidos:", JSON.stringify(requestBody, null, 2));

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
      ativo,
      clientesIds,
    } = requestBody;

    // Verificar se representante existe
    console.log("Buscando representante existente...");
    const representanteExistente = await prisma.representante.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!representanteExistente) {
      console.log("Representante não encontrado");
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    console.log("Representante encontrado:", representanteExistente.user.name);

    // Verificar se email já existe em outro usuário
    if (email !== representanteExistente.user.email) {
      const emailExistente = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExistente) {
        return NextResponse.json(
          { error: "Email já está em uso" },
          { status: 400 }
        );
      }
    }

    // Verificar se CPF já existe em outro representante
    if (cpf !== representanteExistente.cpf) {
      const cpfExistente = await prisma.representante.findUnique({
        where: { cpf: cpf.replace(/\D/g, "") },
      });

      if (cpfExistente) {
        return NextResponse.json(
          { error: "CPF já está em uso" },
          { status: 400 }
        );
      }
    }

    // Atualizar representante
    console.log("Iniciando transação de atualização...");
    const representanteAtualizado = await prisma.$transaction(async (tx) => {
      // Atualizar usuário
      const userData: any = {
        name,
        email,
      };

      // Se nova senha foi fornecida
      if (password && password.trim() !== "") {
        console.log("Atualizando senha...");
        userData.password = await bcrypt.hash(password, 12);
      }

      console.log("Atualizando usuário...");
      await tx.user.update({
        where: { id: representanteExistente.userId },
        data: userData,
      });

      // Atualizar dados do representante
      console.log("Atualizando dados do representante...");
      const representanteData = await tx.representante.update({
        where: { id },
        data: {
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
          ativo,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Atualizar relacionamentos com clientes
      if (clientesIds && Array.isArray(clientesIds)) {
        // Remover relacionamentos existentes
        await tx.representanteCliente.deleteMany({
          where: { representanteId: id },
        });

        // Criar novos relacionamentos
        if (clientesIds.length > 0) {
          await tx.representanteCliente.createMany({
            data: clientesIds.map((clienteId: string) => ({
              representanteId: id,
              clienteId,
            })),
          });
        }
      }

      console.log("Representante atualizado com sucesso");
      return representanteData;
    });

    console.log("Transação concluída, retornando resposta...");
    return NextResponse.json({
      success: true,
      representante: representanteAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir representante (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    // Verificar se representante existe
    const representante = await prisma.representante.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!representante) {
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    // Excluir representante e usuário
    await prisma.$transaction(async (tx) => {
      // Remover relacionamentos com clientes
      await tx.representanteCliente.deleteMany({
        where: { representanteId: id },
      });

      // Excluir representante
      await tx.representante.delete({
        where: { id },
      });

      // Excluir usuário
      await tx.user.delete({
        where: { id: representante.userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
