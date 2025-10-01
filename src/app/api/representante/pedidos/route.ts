import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  enviarEmailNovoPedidoCliente,
  enviarEmailNovoPedidoRepresentante,
  enviarEmailNovoPedidoAdmin,
} from "@/lib/email";

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

    // Verificar se o cliente está atribuído ao representante
    const relacionamento = await prisma.representanteCliente.findFirst({
      where: {
        representanteId: representante.id,
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

    let numeroSequencial = 2025;
    if (ultimoPedido) {
      const ultimoNumero = parseInt(ultimoPedido.numero);
      if (!isNaN(ultimoNumero)) {
        numeroSequencial = ultimoNumero + 1;
      }
    }

    const numeroPedido = numeroSequencial.toString();

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

    // Formatar data
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(pedido.createdAt);

    // Formatar itens para email
    const itensEmail = pedido.itens.map((item) => ({
      titulo: item.produtoTitulo,
      quantidade: item.quantidade,
      precoUnitario: parseFloat(item.precoUnitario.toString()).toFixed(2),
      subtotal: parseFloat(item.subtotal.toString()).toFixed(2),
    }));

    // Enviar email para o cliente
    const emailClientePromise = enviarEmailNovoPedidoCliente({
      nomeCliente:
        pedido.user.cliente?.nomeResponsavel || pedido.user.name || "Cliente",
      emailCliente: pedido.user.email || "",
      numeroPedido: pedido.numero,
      dataPedido: dataFormatada,
      tipoEntrega: pedido.tipoEntrega,
      formaPagamento: pedido.formaPagamento,
      condicaoPagamento: pedido.condicaoPagamento || undefined,
      subtotal: parseFloat(pedido.subtotal.toString()).toFixed(2),
      frete: parseFloat(pedido.frete.toString()).toFixed(2),
      total: parseFloat(pedido.total.toString()).toFixed(2),
      itens: itensEmail,
      enderecoEntrega: pedido.enderecoEntrega
        ? {
            endereco: pedido.enderecoEntrega,
            numero: pedido.numeroEntrega || "",
            complemento: pedido.complementoEntrega || undefined,
            bairro: pedido.bairroEntrega || "",
            cidade: pedido.cidadeEntrega || "",
            estado: pedido.estadoEntrega || "",
            cep: pedido.cepEntrega || "",
          }
        : undefined,
    });

    // Buscar dados do representante
    const representanteUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    // Enviar email para o representante
    const emailRepresentantePromise = enviarEmailNovoPedidoRepresentante({
      nomeRepresentante: representanteUser?.name || "Representante",
      emailRepresentante: representanteUser?.email || "",
      numeroPedido: pedido.numero,
      dataPedido: dataFormatada,
      clienteNome: pedido.user.cliente?.razaoSocial || "Cliente",
      clienteEmail: pedido.user.email || "",
      clienteTelefone: pedido.user.cliente?.telefone || undefined,
      tipoEntrega: pedido.tipoEntrega,
      formaPagamento: pedido.formaPagamento,
      condicaoPagamento: pedido.condicaoPagamento || undefined,
      subtotal: parseFloat(pedido.subtotal.toString()).toFixed(2),
      frete: parseFloat(pedido.frete.toString()).toFixed(2),
      total: parseFloat(pedido.total.toString()).toFixed(2),
      itens: itensEmail,
    });

    // Buscar todos os admins para enviar email
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true, name: true },
    });

    // Criar promises de email para cada admin
    const emailAdminPromises = admins.map((admin) =>
      enviarEmailNovoPedidoAdmin({
        emailAdmin: admin.email || "",
        numeroPedido: pedido.numero,
        dataPedido: dataFormatada,
        clienteNome:
          pedido.user.cliente?.razaoSocial || pedido.user.name || "Cliente",
        clienteEmail: pedido.user.email || "",
        representanteNome: representanteUser?.name || undefined,
        tipoEntrega: pedido.tipoEntrega,
        formaPagamento: pedido.formaPagamento,
        condicaoPagamento: pedido.condicaoPagamento || undefined,
        subtotal: parseFloat(pedido.subtotal.toString()).toFixed(2),
        frete: parseFloat(pedido.frete.toString()).toFixed(2),
        total: parseFloat(pedido.total.toString()).toFixed(2),
        quantidadeItens: pedido.itens.length,
      })
    );

    // Enviar todos os emails em paralelo (não bloquear a resposta)
    Promise.all([
      emailClientePromise,
      emailRepresentantePromise,
      ...emailAdminPromises,
    ])
      .then((results) => {
        console.log("Emails enviados:", {
          cliente: results[0].success,
          representante: results[1].success,
          admins: `${results.slice(2).filter((r) => r.success).length}/${
            admins.length
          }`,
        });
      })
      .catch((error) => {
        console.error("Erro ao enviar emails:", error);
        // Não falhar a criação do pedido se o email falhar
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
