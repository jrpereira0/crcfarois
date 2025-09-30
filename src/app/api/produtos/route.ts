import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const categoriaId = searchParams.get("categoria") || "";
    const origem = searchParams.get("origem") || "";
    const ativo = searchParams.get("ativo");

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

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

    if (ativo !== null && ativo !== undefined && ativo !== "") {
      where.ativo = ativo === "true";
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
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Dados recebidos para criar produto:", body);

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
    } = body;

    // Validações
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

    // Verificar se SKU já existe
    const skuExistente = await prisma.produto.findUnique({
      where: { sku: sku.trim().toUpperCase() },
    });

    if (skuExistente) {
      return NextResponse.json(
        { error: "SKU já está em uso" },
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
    let imagemPrincipal = null;
    let imagensUrls: string[] = [];
    let cloudinaryIds: string[] = [];

    if (imagens && imagens.length > 0) {
      // Separar URLs e Public IDs
      imagensUrls = imagens.map((img: any) => img.url);
      cloudinaryIds = imagens.map((img: any) => img.publicId || "");

      // Encontrar imagem principal
      const imagemPrincipalObj = imagens.find((img: any) => img.isPrincipal);
      imagemPrincipal = imagemPrincipalObj
        ? imagemPrincipalObj.url
        : imagens[0]?.url;
    }

    // Criar produto com URLs do Cloudinary
    const novoProduto = await prisma.produto.create({
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
        // Campos de imagens do Cloudinary
        imagemPrincipal,
        imagensUrls,
        cloudinaryIds,
        ativo: true,
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

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
