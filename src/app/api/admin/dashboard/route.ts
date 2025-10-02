import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "FUNCIONARIO")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Datas para comparação
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total de Clientes
    const totalClientes = await prisma.cliente.count();
    const clientesAtivos = await prisma.cliente.count({
      where: { ativo: true },
    });
    const clientesMesAnterior = await prisma.cliente.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Total de Representantes
    const totalRepresentantes = await prisma.representante.count();
    const representantesAtivos = await prisma.representante.count({
      where: { ativo: true },
    });
    const representantesMesAnterior = await prisma.representante.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Total de Produtos
    const totalProdutos = await prisma.produto.count();
    const produtosAtivos = await prisma.produto.count({
      where: { ativo: true },
    });
    const produtosMesAnterior = await prisma.produto.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Pedidos
    const totalPedidos = await prisma.pedido.count();
    const pedidosPendentes = await prisma.pedido.count({
      where: { status: "PENDENTE" },
    });
    const pedidosAprovados = await prisma.pedido.count({
      where: {
        status: {
          in: ["CONFIRMADO", "PREPARANDO", "PRONTO", "ENVIADO"],
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    const pedidosRecusados = await prisma.pedido.count({
      where: {
        status: "CANCELADO",
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    const pedidosMesAtual = await prisma.pedido.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
    const pedidosMesAnterior = await prisma.pedido.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    // Faturamento (pedidos confirmados, em preparação, prontos e enviados)
    const pedidosAprovadosMesAtual = await prisma.pedido.findMany({
      where: {
        status: {
          in: ["CONFIRMADO", "PREPARANDO", "PRONTO", "ENVIADO"],
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
      select: {
        total: true,
      },
    });

    const pedidosAprovadosMesAnterior = await prisma.pedido.findMany({
      where: {
        status: {
          in: ["CONFIRMADO", "PREPARANDO", "PRONTO", "ENVIADO"],
        },
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: {
        total: true,
      },
    });

    const pedidosAprovadosTotal = await prisma.pedido.findMany({
      where: {
        status: {
          in: ["CONFIRMADO", "PREPARANDO", "PRONTO", "ENVIADO"],
        },
      },
      select: {
        total: true,
      },
    });

    const faturamentoMesAtual = pedidosAprovadosMesAtual.reduce(
      (acc, p) => acc + Number(p.total),
      0
    );
    const faturamentoMesAnterior = pedidosAprovadosMesAnterior.reduce(
      (acc, p) => acc + Number(p.total),
      0
    );
    const faturamentoTotal = pedidosAprovadosTotal.reduce(
      (acc, p) => acc + Number(p.total),
      0
    );

    // Solicitações de Cadastro
    const solicitacoesPendentes = await prisma.solicitacaoCadastro.count({
      where: { status: "PENDENTE" },
    });
    const solicitacoesTotal = await prisma.solicitacaoCadastro.count();

    // Pedidos Recentes (últimos 10)
    const pedidosRecentes = await prisma.pedido.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            cliente: {
              select: {
                razaoSocial: true,
                representantes: {
                  select: {
                    representante: {
                      select: {
                        user: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      totalClientes,
      clientesAtivos,
      clientesMesAnterior,
      totalRepresentantes,
      representantesAtivos,
      representantesMesAnterior,
      totalProdutos,
      produtosAtivos,
      produtosMesAnterior,
      totalPedidos,
      pedidosPendentes,
      pedidosAprovados,
      pedidosRecusados,
      pedidosMesAtual,
      pedidosMesAnterior,
      faturamentoMesAtual,
      faturamentoMesAnterior,
      faturamentoTotal,
      solicitacoesPendentes,
      solicitacoesTotal,
      pedidosRecentes: pedidosRecentes.map((p) => ({
        id: p.id,
        numeroPedido: p.numero,
        status: p.status,
        total: Number(p.total),
        createdAt: p.createdAt.toISOString(),
        cliente: {
          razaoSocial: p.user.cliente?.razaoSocial || "N/A",
        },
        representante: {
          user: {
            name:
              p.user.cliente?.representantes?.[0]?.representante?.user?.name ||
              "N/A",
          },
        },
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

