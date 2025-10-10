import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { enviarEmailStatusPedidoAlterado } from "@/lib/email";

// GET - Buscar pedido específico (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    const pedido = await prisma.pedido.findUnique({
      where: { id },
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
                representantes: {
                  select: {
                    representante: {
                      select: {
                        id: true,
                        whatsapp: true,
                        user: {
                          select: {
                            name: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
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
                categoria: {
                  select: {
                    id: true,
                    nome: true,
                    slug: true,
                  },
                },
                quantidadeEstoque: true,
                preco: true,
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

    // Formatar o pedido para o frontend
    const pedidoFormatado = {
      ...pedido,
      subtotal: parseFloat(pedido.subtotal.toString()),
      frete: parseFloat(pedido.frete.toString()),
      total: parseFloat(pedido.total.toString()),
      itens: pedido.itens.map((item) => ({
        ...item,
        precoUnitario: parseFloat(item.precoUnitario.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
        produto: {
          ...item.produto,
          preco: parseFloat(item.produto.preco.toString()),
        },
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

// PATCH - Atualizar status do pedido (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status é obrigatório" },
        { status: 400 }
      );
    }

    // Validar status
    const statusValidos = [
      "PENDENTE",
      "CONFIRMADO",
      "PREPARANDO",
      "PRONTO",
      "ENVIADO",
      "ENTREGUE",
      "CANCELADO",
    ];

    if (!statusValidos.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // Verificar se pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Buscar pedido com informações do cliente antes de atualizar
    const pedidoCompleto = await prisma.pedido.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            cliente: true,
          },
        },
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!pedidoCompleto) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Guardar status anterior
    const statusAnterior = pedidoCompleto.status;

    // Atualizar status
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: {
        status: status as any,
        updatedAt: new Date(),
      },
    });

    // Se o status mudou, enviar email para o cliente
    if (statusAnterior !== status) {
      const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(pedidoCompleto.createdAt);

      // Formatar itens para email
      const itensEmail = pedidoCompleto.itens.map((item) => ({
        titulo: item.produtoTitulo,
        quantidade: item.quantidade,
        precoUnitario: parseFloat(item.precoUnitario.toString()).toFixed(2),
        subtotal: parseFloat(item.subtotal.toString()).toFixed(2),
      }));

      enviarEmailStatusPedidoAlterado({
        nomeCliente:
          pedidoCompleto.user.cliente?.responsavel ||
          pedidoCompleto.user.name ||
          "Cliente",
        emailCliente: pedidoCompleto.user.email || "",
        numeroPedido: pedidoCompleto.numero,
        statusAnterior: statusAnterior,
        statusNovo: status,
        dataPedido: dataFormatada,
        subtotal: parseFloat(pedidoCompleto.subtotal.toString()).toFixed(2),
        frete: parseFloat(pedidoCompleto.frete.toString()).toFixed(2),
        total: parseFloat(pedidoCompleto.total.toString()).toFixed(2),
        itens: itensEmail,
      }).catch((error) => {
        console.error("Erro ao enviar email de alteração de status:", error);
        // Não falhar a atualização do pedido se o email falhar
      });
    }

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedidoAtualizado.id,
        status: pedidoAtualizado.status,
        updatedAt: pedidoAtualizado.updatedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Editar pedido completo (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    const {
      status,
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      observacoes,
      enderecoEntrega,
      itens,
      subtotal,
      frete,
      total,
    } = await request.json();

    // Verificar se pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!pedidoExistente) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Validar produtos se houver itens
    if (itens && itens.length > 0) {
      const produtoIds = itens.map((item: any) => item.produtoId);
      const produtos = await prisma.produto.findMany({
        where: {
          id: { in: produtoIds },
          ativo: true,
        },
      });

      if (produtos.length !== produtoIds.length) {
        return NextResponse.json(
          { error: "Alguns produtos não foram encontrados ou estão inativos" },
          { status: 400 }
        );
      }
    }

    // Usar transação para garantir consistência
    const pedidoAtualizado = await prisma.$transaction(async (tx) => {
      // 1. Restaurar estoque dos itens removidos/alterados
      for (const itemAtual of pedidoExistente.itens) {
        const itemNovo = itens?.find((i: any) => i.id === itemAtual.id);

        if (!itemNovo) {
          // Item foi removido - restaurar estoque completo
          await tx.produto.update({
            where: { id: itemAtual.produtoId },
            data: {
              quantidadeEstoque: {
                increment: itemAtual.quantidade,
              },
            },
          });
        } else if (itemNovo.quantidade < itemAtual.quantidade) {
          // Quantidade diminuiu - restaurar diferença
          const diferenca = itemAtual.quantidade - itemNovo.quantidade;
          await tx.produto.update({
            where: { id: itemAtual.produtoId },
            data: {
              quantidadeEstoque: {
                increment: diferenca,
              },
            },
          });
        }
      }

      // 2. Remover todos os itens atuais
      await tx.pedidoItem.deleteMany({
        where: { pedidoId: id },
      });

      // 3. Criar novos itens e ajustar estoque
      if (itens && itens.length > 0) {
        for (const item of itens) {
          // Buscar preço atual do produto (sempre usar preço atual)
          const produto = await tx.produto.findUnique({
            where: { id: item.produtoId },
            select: { preco: true, titulo: true, sku: true },
          });

          if (!produto) {
            throw new Error(`Produto ${item.produtoId} não encontrado`);
          }

          const precoAtual = parseFloat(produto.preco.toString());

          // Criar item do pedido com preço atual
          await tx.pedidoItem.create({
            data: {
              pedidoId: id,
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnitario: precoAtual, // Sempre usar preço atual do sistema
              subtotal: item.quantidade * precoAtual,
              produtoTitulo: produto.titulo,
              produtoSku: produto.sku,
            },
          });

          // Ajustar estoque
          await tx.produto.update({
            where: { id: item.produtoId },
            data: {
              quantidadeEstoque: {
                decrement: item.quantidade,
              },
            },
          });
        }
      }

      // 4. Atualizar dados do pedido
      return await tx.pedido.update({
        where: { id },
        data: {
          status: status as any,
          tipoEntrega: tipoEntrega as any,
          formaPagamento: formaPagamento as any,
          condicaoPagamento: condicaoPagamento || null,
          observacoes,
          subtotal: subtotal || 0,
          frete: frete || 0,
          total: total || subtotal || 0,
          enderecoEntrega: enderecoEntrega?.endereco || null,
          numeroEntrega: enderecoEntrega?.numero || null,
          complementoEntrega: enderecoEntrega?.complemento || null,
          bairroEntrega: enderecoEntrega?.bairro || null,
          cidadeEntrega: enderecoEntrega?.cidade || null,
          estadoEntrega: enderecoEntrega?.estado || null,
          cepEntrega: enderecoEntrega?.cep || null,
          updatedAt: new Date(),
        },
        include: {
          itens: {
            include: {
              produto: {
                select: {
                  id: true,
                  titulo: true,
                  sku: true,
                  imagemPrincipal: true,
                  imagensUrls: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedidoAtualizado.id,
        numero: pedidoAtualizado.numero,
        status: pedidoAtualizado.status,
        updatedAt: pedidoAtualizado.updatedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao editar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
