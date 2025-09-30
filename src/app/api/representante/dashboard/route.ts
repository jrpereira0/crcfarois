import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Estatísticas do dashboard do representante
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar representante
    const representante = await prisma.representante.findUnique({
      where: { userId: session.user.id },
      include: {
        clientes: {
          include: {
            cliente: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
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

    // IDs dos clientes atribuídos
    const clientesIds = representante.clientes.map(
      (rel) => rel.cliente.user.id
    );

    // Buscar pedidos dos clientes atribuídos
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [pedidosHoje, pedidosMes, pedidosRecentes] = await Promise.all([
      // Pedidos de hoje
      prisma.pedido.count({
        where: {
          userId: { in: clientesIds },
          createdAt: { gte: hoje },
        },
      }),

      // Pedidos do mês
      prisma.pedido.findMany({
        where: {
          userId: { in: clientesIds },
          createdAt: { gte: inicioMes },
        },
        select: {
          total: true,
        },
      }),

      // Pedidos recentes
      prisma.pedido.findMany({
        where: {
          userId: { in: clientesIds },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: {
              cliente: {
                select: {
                  razaoSocial: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Calcular comissão do mês
    const totalVendasMes = pedidosMes.reduce(
      (acc, pedido) => acc + parseFloat(pedido.total.toString()),
      0
    );
    const comissaoMes =
      (totalVendasMes *
        parseFloat(representante.comissaoPercentual.toString())) /
      100;

    // Formatar pedidos recentes
    const pedidosRecentesFormatados = pedidosRecentes.map((pedido) => ({
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      total: parseFloat(pedido.total.toString()),
      createdAt: pedido.createdAt.toISOString(),
      cliente: {
        razaoSocial: pedido.user.cliente?.razaoSocial || "",
        user: {
          name: pedido.user.name || "",
        },
      },
    }));

    return NextResponse.json({
      totalClientes: representante.clientes.length,
      pedidosHoje,
      pedidosMes: pedidosMes.length,
      comissaoMes,
      pedidosRecentes: pedidosRecentesFormatados,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
