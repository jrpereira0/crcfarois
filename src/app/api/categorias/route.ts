import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar todas as categorias com estrutura hierárquica
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const showInactive = searchParams.get("showInactive") === "true";

    // Buscar todas as categorias
    const categorias = await prisma.categoria.findMany({
      where: showInactive ? {} : { ativo: true },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
    });

    // Aplicar filtro de busca no JavaScript se necessário
    const categoriasFiltradas = search
      ? categorias.filter((cat) =>
          cat.nome.toLowerCase().includes(search.toLowerCase())
        )
      : categorias;

    // Buscar contagem de produtos por categoria
    const categoriasIds = categoriasFiltradas.map((cat) => cat.id);
    const produtosPorCategoria = await prisma.produto.groupBy({
      by: ["categoriaId"],
      where: {
        categoriaId: {
          in: categoriasIds,
        },
        ativo: true, // Apenas produtos ativos
      },
      _count: {
        id: true,
      },
    });

    // Criar mapa de contagem de produtos
    const produtosCountMap = new Map();
    produtosPorCategoria.forEach((item) => {
      produtosCountMap.set(item.categoriaId, item._count.id);
    });

    // Função para calcular produtos totais (incluindo subcategorias)
    const calcularProdutosTotais = (
      categoriaId: string,
      todasCategorias: any[]
    ): number => {
      const produtosDiretos = produtosCountMap.get(categoriaId) || 0;
      const subcategorias = todasCategorias.filter(
        (cat) => cat.parentId === categoriaId
      );
      const produtosSubcategorias = subcategorias.reduce((total, sub) => {
        return total + calcularProdutosTotais(sub.id, todasCategorias);
      }, 0);
      return produtosDiretos + produtosSubcategorias;
    };

    // Organizar em estrutura hierárquica
    const buildHierarchy = (
      items: any[],
      parentId: string | null = null
    ): any[] => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          ...item,
          produtosCount: calcularProdutosTotais(item.id, categoriasFiltradas),
          children: buildHierarchy(items, item.id),
        }));
    };

    const categoriasHierarquicas = buildHierarchy(categoriasFiltradas);

    return NextResponse.json({
      categorias: categoriasHierarquicas,
      total: categoriasFiltradas.length,
    });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova categoria
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Dados recebidos para criar categoria:", body);

    const { nome, slug, descricao, parentId, ordem, ativo } = body;

    // Validações
    if (!nome?.trim()) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Slug é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const slugExistente = await prisma.categoria.findUnique({
      where: { slug },
    });

    if (slugExistente) {
      return NextResponse.json(
        { error: "Slug já está em uso" },
        { status: 400 }
      );
    }

    // Verificar se categoria pai existe (se fornecida)
    if (parentId) {
      const categoriaPai = await prisma.categoria.findUnique({
        where: { id: parentId },
      });

      if (!categoriaPai) {
        return NextResponse.json(
          { error: "Categoria pai não encontrada" },
          { status: 400 }
        );
      }
    }

    // Criar categoria
    const novaCategoria = await prisma.categoria.create({
      data: {
        nome: nome.trim(),
        slug: slug.trim(),
        descricao: descricao?.trim() || null,
        parentId: parentId || null,
        ordem: parseInt(ordem) || 1,
        ativo: Boolean(ativo),
      },
    });

    console.log("Categoria criada:", novaCategoria);

    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
