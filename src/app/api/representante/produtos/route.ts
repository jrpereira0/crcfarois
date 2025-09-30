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
    const search = searchParams.get("search") || "";
    const categoria = searchParams.get("categoria") || "";
    const origem = searchParams.get("origem") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Construir filtros
    const whereClause: any = {
      ativo: true,
    };

    if (search) {
      whereClause.OR = [
        { titulo: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { descricao: { contains: search, mode: "insensitive" } },
        { categoria: { nome: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (categoria) {
      whereClause.categoriaId = categoria;
    }

    if (origem) {
      whereClause.origem = origem;
    }

    // Buscar produtos com paginação
    const [produtos, totalCount] = await Promise.all([
      prisma.produto.findMany({
        where: whereClause,
        include: {
          categoria: {
            select: {
              id: true,
              nome: true,
              slug: true,
            },
          },
        },
        orderBy: [{ categoria: { nome: "asc" } }, { titulo: "asc" }],
        skip,
        take: limit,
      }),
      prisma.produto.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      produtos,
      pagination: {
        page,
        pages: totalPages,
        total: totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos para representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
