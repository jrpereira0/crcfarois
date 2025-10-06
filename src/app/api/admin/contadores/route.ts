import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se é admin ou funcionário
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "FUNCIONARIO"
    ) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // Contar solicitações pendentes
    const solicitacoesPendentes = await prisma.solicitacaoCadastro.count({
      where: {
        status: "PENDENTE",
      },
    });

    // Contar pedidos pendentes (status PENDENTE ou CONFIRMADO)
    const pedidosPendentes = await prisma.pedido.count({
      where: {
        status: {
          in: ["PENDENTE", "CONFIRMADO"],
        },
      },
    });

    return NextResponse.json({
      solicitacoesPendentes,
      pedidosPendentes,
    });
  } catch (error) {
    console.error("Erro ao buscar contadores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contadores" },
      { status: 500 }
    );
  }
}

