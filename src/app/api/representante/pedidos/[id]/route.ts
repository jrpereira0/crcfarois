import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar pedido específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const pedidoId = params.id;

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

    // Buscar relacionamentos do representante
    const relacionamentos = await prisma.representanteCliente.findMany({
      where: {
        representanteId: representante.id,
      },
      select: {
        cliente: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const clienteUserIds = relacionamentos.map((rel) => rel.cliente.user.id);

    // Buscar pedido
    const pedido = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        userId: {
          in: clienteUserIds,
        },
      },
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
                endereco: true,
                numero: true,
                complemento: true,
                bairro: true,
                cidade: true,
                estado: true,
                cep: true,
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
                preco: true,
                quantidadeEstoque: true,
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

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Transformar dados para o formato esperado
    const pedidoFormatado = {
      id: pedido.id,
      numero: pedido.numero,
      status: pedido.status,
      tipoEntrega: pedido.tipoEntrega,
      formaPagamento: pedido.formaPagamento,
      condicaoPagamento: pedido.condicaoPagamento,
      subtotal: pedido.subtotal,
      frete: pedido.frete,
      total: pedido.total,
      observacoes: pedido.observacoes,
      createdAt: pedido.createdAt.toISOString(),
      updatedAt: pedido.updatedAt.toISOString(),
      // Endereço
      enderecoEntrega: pedido.enderecoEntrega,
      numeroEntrega: pedido.numeroEntrega,
      complementoEntrega: pedido.complementoEntrega,
      bairroEntrega: pedido.bairroEntrega,
      cidadeEntrega: pedido.cidadeEntrega,
      estadoEntrega: pedido.estadoEntrega,
      cepEntrega: pedido.cepEntrega,
      // Usuário
      user: {
        id: pedido.user.id,
        name: pedido.user.name,
        email: pedido.user.email,
        cliente: pedido.user.cliente,
      },
      userId: pedido.userId,
      // Itens
      itens: pedido.itens.map((item) => ({
        id: item.id,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.subtotal,
        produtoTitulo: item.produtoTitulo,
        produtoSku: item.produtoSku,
        produto: item.produto,
      })),
    };

    return NextResponse.json({ pedido: pedidoFormatado });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar pedido (status ou dados completos)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const pedidoId = params.id;
    const body = await request.json();

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

    // Buscar relacionamentos do representante
    const relacionamentos = await prisma.representanteCliente.findMany({
      where: {
        representanteId: representante.id,
      },
      select: {
        cliente: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const clienteUserIds = relacionamentos.map((rel) => rel.cliente.user.id);

    // Verificar se o pedido pertence a um cliente do representante
    const pedidoExistente = await prisma.pedido.findFirst({
      where: {
        id: pedidoId,
        userId: {
          in: clienteUserIds,
        },
      },
    });

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Se for apenas atualização de status
    if (body.status && Object.keys(body).length === 1) {
      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: pedidoId },
        data: { status: body.status },
      });

      return NextResponse.json({
        pedido: {
          id: pedidoAtualizado.id,
          status: pedidoAtualizado.status,
        },
      });
    }

    // Atualização completa do pedido
    const {
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      enderecoEntrega,
      frete,
      observacoes,
      itens,
    } = body;

    let dadosAtualizacao: any = {};

    if (tipoEntrega) dadosAtualizacao.tipoEntrega = tipoEntrega;
    if (formaPagamento) dadosAtualizacao.formaPagamento = formaPagamento;
    if (condicaoPagamento !== undefined)
      dadosAtualizacao.condicaoPagamento = condicaoPagamento;
    if (observacoes !== undefined) dadosAtualizacao.observacoes = observacoes;

    // Atualizar endereço se fornecido
    if (enderecoEntrega) {
      dadosAtualizacao.enderecoEntrega = enderecoEntrega.endereco || null;
      dadosAtualizacao.numeroEntrega = enderecoEntrega.numero || null;
      dadosAtualizacao.complementoEntrega = enderecoEntrega.complemento || null;
      dadosAtualizacao.bairroEntrega = enderecoEntrega.bairro || null;
      dadosAtualizacao.cidadeEntrega = enderecoEntrega.cidade || null;
      dadosAtualizacao.estadoEntrega = enderecoEntrega.estado || null;
      dadosAtualizacao.cepEntrega = enderecoEntrega.cep || null;
    }

    // Atualizar frete se fornecido
    if (frete !== undefined) {
      dadosAtualizacao.frete = frete;
    }

    // Se há itens para atualizar
    if (itens && itens.length > 0) {
      // Validar produtos
      const produtoIds = itens.map((item: any) => item.produtoId);
      const produtos = await prisma.produto.findMany({
        where: {
          id: {
            in: produtoIds,
          },
        },
      });

      if (produtos.length !== produtoIds.length) {
        return NextResponse.json(
          { error: "Um ou mais produtos não foram encontrados" },
          { status: 400 }
        );
      }

      // Calcular novos valores
      const itensComPrecos = itens.map((item: any) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        return {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: produto.preco, // Sempre usar preço do sistema
          subtotal: Number(produto.preco) * item.quantidade,
        };
      });

      const novoSubtotal = itensComPrecos.reduce(
        (total: number, item: any) => total + item.subtotal,
        0
      );

      const novoFrete = frete !== undefined ? frete : pedidoExistente.frete;
      const novoTotal = novoSubtotal + novoFrete;

      dadosAtualizacao.subtotal = novoSubtotal;
      dadosAtualizacao.total = novoTotal;

      // Usar transação para atualizar pedido e itens
      const pedidoAtualizado = await prisma.$transaction(async (tx) => {
        // Deletar itens existentes
        await tx.pedidoItem.deleteMany({
          where: { pedidoId: pedidoId },
        });

        // Atualizar pedido
        const pedido = await tx.pedido.update({
          where: { id: pedidoId },
          data: {
            ...dadosAtualizacao,
            itens: {
              create: itensComPrecos.map((item: any) => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                subtotal: item.subtotal,
                produtoTitulo:
                  produtos.find((p) => p.id === item.produtoId)?.titulo || "",
                produtoSku:
                  produtos.find((p) => p.id === item.produtoId)?.sku || "",
              })),
            },
          },
          include: {
            itens: {
              include: {
                produto: true,
              },
            },
            user: {
              include: {
                cliente: true,
              },
            },
          },
        });

        return pedido;
      });

      return NextResponse.json({
        pedido: {
          id: pedidoAtualizado.id,
          numero: pedidoAtualizado.numero,
          status: pedidoAtualizado.status,
          total: pedidoAtualizado.total,
        },
      });
    } else {
      // Atualização sem itens
      const pedidoAtualizado = await prisma.pedido.update({
        where: { id: pedidoId },
        data: dadosAtualizacao,
      });

      return NextResponse.json({
        pedido: {
          id: pedidoAtualizado.id,
          numero: pedidoAtualizado.numero,
          status: pedidoAtualizado.status,
          total: pedidoAtualizado.total,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
