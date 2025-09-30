import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Buscar pedido específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    const pedido = await prisma.pedido.findUnique({
      where: {
        id,
        userId: session.user.id, // Garantir que o usuário só veja seus próprios pedidos
      },
      include: {
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                titulo: true,
                sku: true,
                imagemPrincipal: true,
                imagensUrls: true,
                categoria: {
                  select: {
                    id: true,
                    nome: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cliente: {
              select: {
                razaoSocial: true,
                cnpjCpf: true,
                telefone: true,
                whatsapp: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Formatar o pedido para o frontend
    const pedidoFormatado = {
      ...pedido,
      subtotal: parseFloat(pedido.subtotal.toString()),
      frete: parseFloat(pedido.frete.toString()),
      total: parseFloat(pedido.total.toString()),
      itens: pedido.itens.map((item) => ({
        ...item,
        precoUnitario: parseFloat(item.precoUnitario.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
    };

    return NextResponse.json({ pedido: pedidoFormatado });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
