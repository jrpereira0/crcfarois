import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar produtos para clientes B2B
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar se o usuário está autenticado e é um cliente
    if (!session || session.user.role !== "CLIENTE") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20"); // 20 produtos por página
    const search = searchParams.get("search") || "";
    const categoriaId = searchParams.get("categoria") || "";
    const origem = searchParams.get("origem") || "";

    const skip = (page - 1) * limit;

    // Construir filtros - apenas produtos ativos para clientes
    const where: any = {
      ativo: true, // Sempre filtrar apenas produtos ativos para clientes
    };

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { aplicacao: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (origem) {
      where.origem = origem;
    }

    // Buscar produtos
    const [produtos, total] = await Promise.all([
      prisma.produto.findMany({
        where,
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.produto.count({ where }),
    ]);

    return NextResponse.json({
      produtos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos B2B:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
