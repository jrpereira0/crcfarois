import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log("❌ Contadores: Usuário não autenticado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se é admin ou funcionário
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "FUNCIONARIO"
    ) {
      console.log("❌ Contadores: Usuário sem permissão:", session.user.role);
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    console.log("🔍 Buscando contadores para usuário:", session.user.email);

    // Contar solicitações pendentes
    const solicitacoesPendentes = await prisma.solicitacaoCadastro.count({
      where: {
        status: "PENDENTE",
      },
    });

    console.log("📋 Solicitações pendentes encontradas:", solicitacoesPendentes);

    // Contar pedidos pendentes (status PENDENTE ou CONFIRMADO)
    const pedidosPendentes = await prisma.pedido.count({
      where: {
        status: {
          in: ["PENDENTE", "CONFIRMADO"],
        },
      },
    });

    console.log("📦 Pedidos pendentes encontrados:", pedidosPendentes);

    const resultado = {
      solicitacoesPendentes,
      pedidosPendentes,
    };

    console.log("✅ Contadores retornados:", resultado);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("❌ Erro ao buscar contadores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar contadores" },
      { status: 500 }
    );
  }
}

