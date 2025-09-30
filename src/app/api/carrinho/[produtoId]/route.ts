import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// DELETE - Remover item específico do carrinho
export async function DELETE(
  request: NextRequest,
  { params }: { params: { produtoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { produtoId } = params;

    if (!produtoId) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar carrinho
    const carrinho = await prisma.carrinho.findUnique({
      where: { userId: session.user.id },
    });

    if (!carrinho) {
      return NextResponse.json(
        { error: "Carrinho não encontrado" },
        { status: 404 }
      );
    }

    // Remover item específico
    await prisma.carrinhoItem.deleteMany({
      where: {
        carrinhoId: carrinho.id,
        produtoId: produtoId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

