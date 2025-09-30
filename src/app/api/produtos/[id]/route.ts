import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const produto = await prisma.produto.findUnique({
      where: { id: params.id },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            slug: true,
          },
        },
      },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar produto
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
    const {
      titulo,
      sku,
      categoriaId,
      origem,
      aplicacao,
      preco,
      descricao,
      quantidadeEstoque,
      compraMinima,
      compraMaxima,
      imagens,
      ativo,
    } = body;

    // Verificar se produto existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: params.id },
    });

    if (!produtoExistente) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Validações básicas
    if (!titulo?.trim()) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 }
      );
    }

    if (!sku?.trim()) {
      return NextResponse.json({ error: "SKU é obrigatório" }, { status: 400 });
    }

    if (!categoriaId) {
      return NextResponse.json(
        { error: "Categoria é obrigatória" },
        { status: 400 }
      );
    }

    if (!preco || parseFloat(preco) <= 0) {
      return NextResponse.json(
        { error: "Preço deve ser maior que zero" },
        { status: 400 }
      );
    }

    if (quantidadeEstoque === undefined || parseInt(quantidadeEstoque) < 0) {
      return NextResponse.json(
        { error: "Quantidade em estoque deve ser um número válido" },
        { status: 400 }
      );
    }

    if (compraMinima === undefined || parseInt(compraMinima) < 1) {
      return NextResponse.json(
        { error: "Compra mínima deve ser pelo menos 1" },
        { status: 400 }
      );
    }

    if (
      compraMaxima !== undefined &&
      compraMaxima !== null &&
      parseInt(compraMaxima) < parseInt(compraMinima)
    ) {
      return NextResponse.json(
        { error: "Compra máxima deve ser maior que a compra mínima" },
        { status: 400 }
      );
    }

    // Verificar se SKU já existe em outro produto
    const skuExistente = await prisma.produto.findFirst({
      where: {
        sku: sku.trim().toUpperCase(),
        NOT: { id: params.id },
      },
    });

    if (skuExistente) {
      return NextResponse.json(
        { error: "SKU já está em uso por outro produto" },
        { status: 400 }
      );
    }

    // Verificar se categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 }
      );
    }

    // Processar imagens do Cloudinary
    let imagemPrincipal = produtoExistente.imagemPrincipal;
    let imagensUrls = [...produtoExistente.imagensUrls];
    let cloudinaryIds = [...produtoExistente.cloudinaryIds];

    if (imagens && imagens.length > 0) {
      // Se há novas imagens, substituir completamente
      imagensUrls = imagens.map((img: any) => img.url);
      cloudinaryIds = imagens.map((img: any) => img.publicId || "");

      // Encontrar nova imagem principal
      const imagemPrincipalObj = imagens.find((img: any) => img.isPrincipal);
      imagemPrincipal = imagemPrincipalObj
        ? imagemPrincipalObj.url
        : imagens[0]?.url;

      // Deletar imagens antigas do Cloudinary se foram substituídas
      for (const oldPublicId of produtoExistente.cloudinaryIds) {
        if (oldPublicId && !cloudinaryIds.includes(oldPublicId)) {
          try {
            await deleteImage(oldPublicId);
          } catch (error) {
            console.error("Erro ao deletar imagem antiga:", error);
          }
        }
      }
    }

    // Atualizar produto
    const produtoAtualizado = await prisma.produto.update({
      where: { id: params.id },
      data: {
        titulo: titulo.trim(),
        sku: sku.trim().toUpperCase(),
        categoriaId,
        origem: origem?.trim() || null,
        aplicacao: aplicacao?.trim() || null,
        preco: parseFloat(preco),
        descricao: descricao?.trim() || null,
        quantidadeEstoque: parseInt(quantidadeEstoque),
        compraMinima: parseInt(compraMinima),
        compraMaxima: compraMaxima ? parseInt(compraMaxima) : null,
        imagemPrincipal,
        imagensUrls,
        cloudinaryIds,
        ativo: ativo !== undefined ? ativo : produtoExistente.ativo,
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Ativar/Desativar produto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { ativo } = await request.json();

    if (ativo === undefined) {
      return NextResponse.json(
        { error: "Campo 'ativo' é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se produto existe
    const produtoExistente = await prisma.produto.findUnique({
      where: { id: params.id },
    });

    if (!produtoExistente) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar status
    const produtoAtualizado = await prisma.produto.update({
      where: { id: params.id },
      data: { ativo },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao alterar status do produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Verificar se produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: params.id },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Deletar imagens do Cloudinary
    for (const publicId of produto.cloudinaryIds) {
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error("Erro ao deletar imagem do Cloudinary:", error);
        }
      }
    }

    // Deletar produto do banco
    await prisma.produto.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Produto deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
