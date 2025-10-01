import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params; // Pode ser userId ou clienteId

    // Buscar o representante logado
    const representante = await prisma.representante.findUnique({
      where: { userId: session.user.id },
    });

    if (!representante) {
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    // Primeiro, tentar buscar o cliente pelo userId (quando vem do pedido)
    const clientePorUserId = await prisma.cliente.findUnique({
      where: { userId: id },
      select: {
        id: true,
        condicoesPagamento: true,
      },
    });

    // Se encontrou pelo userId, verificar se o representante tem acesso
    if (clientePorUserId) {
      const relacionamento = await prisma.representanteCliente.findFirst({
        where: {
          representanteId: representante.id,
          clienteId: clientePorUserId.id,
        },
      });

      if (relacionamento) {
        return NextResponse.json({
          condicoes: clientePorUserId.condicoesPagamento || [],
        });
      }
    }

    // Se não encontrou pelo userId, tentar pelo clienteId direto
    const relacionamento = await prisma.representanteCliente.findFirst({
      where: {
        representanteId: representante.id,
        clienteId: id,
      },
      include: {
        cliente: {
          select: {
            id: true,
            condicoesPagamento: true,
          },
        },
      },
    });

    if (!relacionamento) {
      return NextResponse.json(
        { error: "Cliente não encontrado ou não atribuído a você" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      condicoes: relacionamento.cliente.condicoesPagamento || [],
    });
  } catch (error) {
    console.error("Erro ao buscar condições de pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
