import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar pedidos dos clientes do representante
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const tipoEntrega = searchParams.get("tipoEntrega");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    if (clienteUserIds.length === 0) {
      return NextResponse.json({ pedidos: [] });
    }

    // Construir filtros
    const where: any = {
      userId: {
        in: clienteUserIds,
      },
    };

    if (status) {
      where.status = status;
    }

    if (tipoEntrega) {
      where.tipoEntrega = tipoEntrega;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Adicionar filtro de busca na query do Prisma
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              {
                cliente: {
                  OR: [
                    { razaoSocial: { contains: search, mode: "insensitive" } },
                    { cnpjCpf: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
        },
        {
          itens: {
            some: {
              OR: [
                { produtoTitulo: { contains: search, mode: "insensitive" } },
                { produtoSku: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      ];
    }

    // Buscar pedidos
    const pedidos = await prisma.pedido.findMany({
      where,
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transformar dados para o formato esperado
    const pedidosFormatados = pedidos.map((pedido) => ({
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
    }));

    return NextResponse.json({ pedidos: pedidosFormatados });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar pedido (já existe no arquivo original)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clienteId,
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      enderecoEntrega,
      frete,
      observacoes,
      itens,
    } = body;

    // Validações básicas
    if (
      !clienteId ||
      !tipoEntrega ||
      !formaPagamento ||
      !itens ||
      itens.length === 0
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // Verificar se o cliente está atribuído ao representante
    const relacionamento = await prisma.representanteCliente.findFirst({
      where: {
        representanteId: session.user.id,
        clienteId: clienteId,
      },
      include: {
        cliente: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!relacionamento) {
      return NextResponse.json(
        { error: "Cliente não atribuído a este representante" },
        { status: 403 }
      );
    }

    // Validar produtos e calcular valores
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

    // Calcular valores usando preços do sistema
    const itensComPrecos = itens.map((item: any) => {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) {
        throw new Error(`Produto ${item.produtoId} não encontrado`);
      }

      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: produto.preco, // Usar preço do sistema
        subtotal: Number(produto.preco) * item.quantidade,
      };
    });

    const subtotal = itensComPrecos.reduce(
      (total: number, item: any) => total + item.subtotal,
      0
    );

    const freteValue = frete || 0;
    const totalValue = subtotal + freteValue;

    // Gerar número do pedido
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { createdAt: "desc" },
      select: { numero: true },
    });

    const ultimoNumero = ultimoPedido?.numero || "0000";
    const proximoNumero = (parseInt(ultimoNumero) + 1)
      .toString()
      .padStart(4, "0");
    const numeroPedido = proximoNumero;

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        numero: numeroPedido,
        userId: relacionamento.cliente.user.id, // Pedido fica no nome do cliente
        status: "PENDENTE",
        tipoEntrega: tipoEntrega as any,
        formaPagamento: formaPagamento as any,
        condicaoPagamento,
        subtotal,
        frete: freteValue,
        total: totalValue,
        enderecoEntrega: enderecoEntrega?.endereco || null,
        numeroEntrega: enderecoEntrega?.numero || null,
        complementoEntrega: enderecoEntrega?.complemento || null,
        bairroEntrega: enderecoEntrega?.bairro || null,
        cidadeEntrega: enderecoEntrega?.cidade || null,
        estadoEntrega: enderecoEntrega?.estado || null,
        cepEntrega: enderecoEntrega?.cep || null,
        observacoes: observacoes || null,
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

    return NextResponse.json({
      pedido: {
        id: pedido.id,
        numero: pedido.numero,
        status: pedido.status,
        total: pedido.total,
      },
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
