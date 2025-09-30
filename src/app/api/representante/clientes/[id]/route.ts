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

    const { id } = params;

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

    // Buscar relacionamento específico do representante com o cliente
    const relacionamento = await prisma.representanteCliente.findFirst({
      where: {
        representanteId: representante.id,
        clienteId: id,
      },
      include: {
        cliente: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                pedidos: {
                  select: {
                    id: true,
                    numero: true,
                    status: true,
                    total: true,
                    createdAt: true,
                    itens: {
                      select: {
                        id: true,
                        quantidade: true,
                        produtoTitulo: true,
                      },
                    },
                  },
                  orderBy: { createdAt: "desc" },
                },
              },
            },
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

    // Extrair dados do cliente e mapear pedidos
    const cliente = {
      ...relacionamento.cliente,
      pedidos: relacionamento.cliente.user.pedidos,
    };

    return NextResponse.json({ cliente });
  } catch (error) {
    console.error("Erro ao buscar cliente do representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
