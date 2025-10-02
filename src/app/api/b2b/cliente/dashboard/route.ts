import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "CLIENTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar cliente e seu representante
    const cliente = await prisma.cliente.findUnique({
      where: { userId: session.user.id },
      select: { 
        id: true,
        representantes: {
          select: {
            representante: {
              select: {
                id: true,
                whatsapp: true,
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

    // Pegar o primeiro representante (pode haver mais de um no futuro)
    const representante = cliente.representantes[0]?.representante || null;

    // Buscar pedidos do cliente
    const pedidos = await prisma.pedido.findMany({
      where: { userId: session.user.id },
      include: {
        itens: {
          select: {
            quantidade: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcular estatísticas
    const totalPedidos = pedidos.length;
    const pedidosPendentes = pedidos.filter(
      (p) => p.status === "PENDENTE" || p.status === "CONFIRMADO"
    ).length;
    const valorTotalCompras = pedidos.reduce(
      (acc, p) => acc + Number(p.total),
      0
    );

    // Pegar últimos 5 pedidos
    const pedidosRecentes = pedidos.slice(0, 5);

    return NextResponse.json({
      totalPedidos,
      pedidosPendentes,
      valorTotalCompras,
      pedidosRecentes,
      representante: representante ? {
        nome: representante.user.name,
        email: representante.user.email,
        whatsapp: representante.whatsapp,
      } : null,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
