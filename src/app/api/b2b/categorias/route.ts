import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar categorias para clientes B2B
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar se o usuário está autenticado e é um cliente
    if (!session || session.user.role !== "CLIENTE") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Construir filtros - apenas categorias ativas
    const where: any = {
      ativo: true, // Apenas categorias ativas para clientes
    };

    if (search) {
      where.nome = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Buscar todas as categorias ativas
    const todasCategorias = await prisma.categoria.findMany({
      where,
      include: {
        children: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            slug: true,
            parentId: true,
          },
        },
      },
      orderBy: { nome: "asc" },
    });

    // Função para organizar em estrutura hierárquica
    const buildHierarchy = (
      items: any[],
      parentId: string | null = null
    ): any[] => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          ...item,
          children: buildHierarchy(items, item.id),
        }));
    };

    const categoriasHierarquicas = buildHierarchy(todasCategorias);

    return NextResponse.json({
      categorias: categoriasHierarquicas,
    });
  } catch (error) {
    console.error("Erro ao buscar categorias B2B:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
