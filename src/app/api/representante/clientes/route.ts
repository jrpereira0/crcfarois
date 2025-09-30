import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const tipoEmpresa = searchParams.get("tipoEmpresa");
    const estado = searchParams.get("estado");
    const ativo = searchParams.get("ativo");

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

    // Construir filtros para clientes
    const clienteWhere: any = {};

    if (search) {
      clienteWhere.OR = [
        { razaoSocial: { contains: search, mode: "insensitive" } },
        { cnpjCpf: { contains: search } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (tipoEmpresa) {
      clienteWhere.tipoEmpresa = tipoEmpresa;
    }

    if (estado) {
      clienteWhere.estado = estado;
    }

    if (ativo !== null && ativo !== undefined && ativo !== "") {
      clienteWhere.ativo = ativo === "true";
    }

    // Buscar total de clientes para paginação
    const totalClientes = await prisma.representanteCliente.count({
      where: {
        representanteId: representante.id,
        cliente: clienteWhere,
      },
    });

    // Buscar relacionamentos com dados completos dos clientes
    const relacionamentos = await prisma.representanteCliente.findMany({
      where: {
        representanteId: representante.id,
        cliente: clienteWhere,
      },
      include: {
        cliente: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                  select: {
                    pedidos: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        cliente: {
          razaoSocial: "asc",
        },
      },
    });

    // Extrair os clientes dos relacionamentos e mapear a contagem de pedidos
    const clientes = relacionamentos.map((rel) => ({
      ...rel.cliente,
      responsavel: rel.cliente.user.name,
      email: rel.cliente.user.email,
      user: rel.cliente.user,
      _count: {
        pedidos: rel.cliente.user._count.pedidos,
      },
    }));

    const totalPages = Math.ceil(totalClientes / limit);

    return NextResponse.json({
      clientes,
      pagination: {
        page,
        limit,
        total: totalClientes,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar clientes do representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
