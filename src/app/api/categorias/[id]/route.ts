import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Buscar categoria por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: {
          orderBy: [{ ordem: "asc" }, { nome: "asc" }],
        },
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Buscar contagem de produtos para a categoria e filhas
    const categoriasIds = [
      categoria.id,
      ...categoria.children.map((c) => c.id),
    ];
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

    // Função recursiva para calcular produtos totais (incluindo subcategorias)
    const calcularProdutosTotais = async (
      categoriaId: string
    ): Promise<number> => {
      const produtosDiretos = produtosCountMap.get(categoriaId) || 0;

      // Buscar subcategorias
      const subcategorias = await prisma.categoria.findMany({
        where: { parentId: categoriaId },
        select: { id: true },
      });

      let produtosSubcategorias = 0;
      for (const sub of subcategorias) {
        produtosSubcategorias += await calcularProdutosTotais(sub.id);
      }

      return produtosDiretos + produtosSubcategorias;
    };

    // Adicionar contagem de produtos real
    const categoriaComCount = {
      ...categoria,
      produtosCount: await calcularProdutosTotais(categoria.id),
      children: categoria.children.map((child) => ({
        ...child,
        produtosCount: produtosCountMap.get(child.id) || 0,
      })),
    };

    return NextResponse.json(categoriaComCount);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Dados recebidos para atualizar categoria:", body);

    const { nome, slug, descricao, parentId, ordem, ativo } = body;

    // Verificar se categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: params.id },
    });

    if (!categoriaExistente) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

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

    // Verificar se slug já existe (excluindo a categoria atual)
    if (slug !== categoriaExistente.slug) {
      const slugExistente = await prisma.categoria.findUnique({
        where: { slug },
      });

      if (slugExistente) {
        return NextResponse.json(
          { error: "Slug já está em uso" },
          { status: 400 }
        );
      }
    }

    // Verificar se categoria pai existe e não é a própria categoria
    if (parentId) {
      if (parentId === params.id) {
        return NextResponse.json(
          { error: "Uma categoria não pode ser pai de si mesma" },
          { status: 400 }
        );
      }

      const categoriaPai = await prisma.categoria.findUnique({
        where: { id: parentId },
      });

      if (!categoriaPai) {
        return NextResponse.json(
          { error: "Categoria pai não encontrada" },
          { status: 400 }
        );
      }

      // Verificar se não criaria uma referência circular
      const verificarCircular = async (
        categoriaId: string,
        parentIdCheck: string
      ): Promise<boolean> => {
        if (categoriaId === parentIdCheck) return true;

        const parent = await prisma.categoria.findUnique({
          where: { id: parentIdCheck },
          select: { parentId: true },
        });

        if (parent?.parentId) {
          return verificarCircular(categoriaId, parent.parentId);
        }

        return false;
      };

      const isCircular = await verificarCircular(params.id, parentId);
      if (isCircular) {
        return NextResponse.json(
          { error: "Não é possível criar uma referência circular" },
          { status: 400 }
        );
      }
    }

    // Atualizar categoria
    const categoriaAtualizada = await prisma.categoria.update({
      where: { id: params.id },
      data: {
        nome: nome.trim(),
        slug: slug.trim(),
        descricao: descricao?.trim() || null,
        parentId: parentId || null,
        ordem: parseInt(ordem) || 1,
        ativo: Boolean(ativo),
      },
    });

    console.log("Categoria atualizada:", categoriaAtualizada);

    return NextResponse.json(categoriaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: params.id },
      include: {
        children: true,
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se tem subcategorias
    if (categoria.children.length > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir uma categoria que possui subcategorias",
        },
        { status: 400 }
      );
    }

    // TODO: Verificar se tem produtos associados
    // const produtosCount = await prisma.produto.count({
    //   where: { categoriaId: params.id }
    // });
    //
    // if (produtosCount > 0) {
    //   return NextResponse.json(
    //     { error: `Não é possível excluir uma categoria que possui ${produtosCount} produto(s) associado(s)` },
    //     { status: 400 }
    //   );
    // }

    // Excluir categoria
    await prisma.categoria.delete({
      where: { id: params.id },
    });

    console.log("Categoria excluída:", params.id);

    return NextResponse.json(
      { message: "Categoria excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
