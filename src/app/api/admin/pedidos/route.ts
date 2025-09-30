import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar todos os pedidos (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tipoEntrega = searchParams.get("tipoEntrega");
    const search = searchParams.get("search");

    // Construir filtros
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tipoEntrega) {
      where.tipoEntrega = tipoEntrega;
    }

    if (search) {
      where.OR = [
        { numero: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              {
                cliente: {
                  razaoSocial: { contains: search, mode: "insensitive" },
                },
              },
            ],
          },
        },
        {
          itens: {
            some: {
              OR: [
                { produtoTitulo: { contains: search, mode: "insensitive" } },
                { produtoSku: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
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
      },
      orderBy: { createdAt: "desc" },
    });

    // Formatar pedidos para o frontend
    const pedidosFormatados = pedidos.map((pedido) => ({
      ...pedido,
      subtotal: parseFloat(pedido.subtotal.toString()),
      frete: parseFloat(pedido.frete.toString()),
      total: parseFloat(pedido.total.toString()),
      itens: pedido.itens.map((item) => ({
        ...item,
        precoUnitario: parseFloat(item.precoUnitario.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
    }));

    return NextResponse.json({ pedidos: pedidosFormatados });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
