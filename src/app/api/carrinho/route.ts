import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Buscar carrinho do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar ou criar carrinho do usuário
    let carrinho = await prisma.carrinho.findUnique({
      where: { userId: session.user.id },
      include: {
        itens: {
          include: {
            produto: {
              include: {
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
    });

    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: { userId: session.user.id },
        include: {
          itens: {
            include: {
              produto: {
                include: {
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
      });
    }

    // Transformar para o formato esperado pelo frontend
    const carrinhoFormatado = {
      items: carrinho.itens.map((item) => ({
        id: item.produto.id,
        titulo: item.produto.titulo,
        sku: item.produto.sku,
        preco: parseFloat(item.precoUnitario.toString()),
        precoDropshipping: item.produto.precoDropshipping
          ? parseFloat(item.produto.precoDropshipping.toString())
          : null,
        imagemPrincipal: item.produto.imagemPrincipal,
        imagensUrls: item.produto.imagensUrls,
        categoria: item.produto.categoria,
        quantidadeEstoque: item.produto.quantidadeEstoque,
        compraMinima: item.produto.compraMinima,
        compraMaxima: item.produto.compraMaxima,
        quantidade: item.quantidade,
        subtotal: parseFloat(item.precoUnitario.toString()) * item.quantidade,
      })),
      total: carrinho.itens.reduce(
        (total, item) =>
          total + parseFloat(item.precoUnitario.toString()) * item.quantidade,
        0
      ),
      totalItems: carrinho.itens.reduce(
        (total, item) => total + item.quantidade,
        0
      ),
    };

    return NextResponse.json(carrinhoFormatado);
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { produtoId, quantidade } = await request.json();

    if (!produtoId || !quantidade || quantidade <= 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Verificar se o produto existe
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto || !produto.ativo) {
      return NextResponse.json(
        { error: "Produto não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Validar quantidade
    if (quantidade < produto.compraMinima) {
      return NextResponse.json(
        { error: `Quantidade mínima: ${produto.compraMinima}` },
        { status: 400 }
      );
    }

    const maxQuantidade = produto.compraMaxima || produto.quantidadeEstoque;
    if (quantidade > maxQuantidade) {
      return NextResponse.json(
        { error: `Quantidade máxima: ${maxQuantidade}` },
        { status: 400 }
      );
    }

    // Buscar ou criar carrinho
    let carrinho = await prisma.carrinho.findUnique({
      where: { userId: session.user.id },
    });

    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: { userId: session.user.id },
      });
    }

    // Verificar se o item já existe no carrinho
    const itemExistente = await prisma.carrinhoItem.findUnique({
      where: {
        carrinhoId_produtoId: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
        },
      },
    });

    if (itemExistente) {
      // Calcular nova quantidade total
      const novaQuantidade = itemExistente.quantidade + quantidade;

      // Verificar se excede o máximo permitido
      if (novaQuantidade > maxQuantidade) {
        return NextResponse.json(
          {
            error: `Você já tem ${itemExistente.quantidade} unidade(s) deste produto no carrinho. Quantidade máxima permitida: ${maxQuantidade}`,
          },
          { status: 400 }
        );
      }

      // Validar quantidade mínima (não é necessário para atualização, mas mantém consistência)
      if (novaQuantidade < produto.compraMinima) {
        return NextResponse.json(
          { error: `Quantidade mínima: ${produto.compraMinima}` },
          { status: 400 }
        );
      }

      // Atualizar quantidade
      await prisma.carrinhoItem.update({
        where: { id: itemExistente.id },
        data: {
          quantidade: novaQuantidade,
          precoUnitario: produto.preco,
        },
      });
    } else {
      // Criar novo item
      await prisma.carrinhoItem.create({
        data: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
          quantidade: quantidade,
          precoUnitario: produto.preco,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar quantidade de item no carrinho
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { produtoId, quantidade } = await request.json();

    if (!produtoId || quantidade < 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Buscar carrinho
    const carrinho = await prisma.carrinho.findUnique({
      where: { userId: session.user.id },
    });

    if (!carrinho) {
      return NextResponse.json(
        { error: "Carrinho não encontrado" },
        { status: 404 }
      );
    }

    // Buscar produto para validações
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Se quantidade for 0, remover item
    if (quantidade === 0) {
      await prisma.carrinhoItem.deleteMany({
        where: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
        },
      });
    } else {
      // Validar quantidade mínima
      if (quantidade < produto.compraMinima) {
        return NextResponse.json(
          { error: `Quantidade mínima: ${produto.compraMinima}` },
          { status: 400 }
        );
      }

      // Validar quantidade máxima
      const maxQuantidade = produto.compraMaxima || produto.quantidadeEstoque;
      if (quantidade > maxQuantidade) {
        return NextResponse.json(
          { error: `Quantidade máxima: ${maxQuantidade}` },
          { status: 400 }
        );
      }

      // Validar estoque
      if (quantidade > produto.quantidadeEstoque) {
        return NextResponse.json(
          { error: `Estoque disponível: ${produto.quantidadeEstoque}` },
          { status: 400 }
        );
      }

      await prisma.carrinhoItem.upsert({
        where: {
          carrinhoId_produtoId: {
            carrinhoId: carrinho.id,
            produtoId: produtoId,
          },
        },
        update: {
          quantidade: quantidade,
          precoUnitario: produto.preco,
        },
        create: {
          carrinhoId: carrinho.id,
          produtoId: produtoId,
          quantidade: quantidade,
          precoUnitario: produto.preco,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar carrinho:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Limpar carrinho
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar carrinho
    const carrinho = await prisma.carrinho.findUnique({
      where: { userId: session.user.id },
    });

    if (carrinho) {
      // Remover todos os itens do carrinho
      await prisma.carrinhoItem.deleteMany({
        where: { carrinhoId: carrinho.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
