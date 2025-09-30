import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar pedidos do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const pedidos = await prisma.pedido.findMany({
      where: { userId: session.user.id },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pedidos });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    console.log("=== INICIANDO CRIAÇÃO DE PEDIDO ===");
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log("Erro: Usuário não autorizado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("Usuário autorizado:", session.user.id);

    const requestBody = await request.json();
    console.log("Dados recebidos:", JSON.stringify(requestBody, null, 2));

    const {
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      enderecoEntrega,
      observacoes,
      itens,
    } = requestBody;

    console.log("Valores extraídos:", {
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      enderecoEntrega: !!enderecoEntrega,
      observacoes: !!observacoes,
      itensLength: itens?.length,
    });

    // Validações básicas
    if (!tipoEntrega || !formaPagamento || !itens || itens.length === 0) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // Validar enums
    const tiposEntregaValidos = ["RETIRADA", "ENTREGA"];
    const formasPagamentoValidas = [
      "DINHEIRO",
      "PIX",
      "CARTAO_CREDITO",
      "CARTAO_DEBITO",
      "BOLETO",
      "TRANSFERENCIA",
    ];

    if (!tiposEntregaValidos.includes(tipoEntrega)) {
      return NextResponse.json(
        { error: `Tipo de entrega inválido: ${tipoEntrega}` },
        { status: 400 }
      );
    }

    if (!formasPagamentoValidas.includes(formaPagamento)) {
      return NextResponse.json(
        { error: `Forma de pagamento inválida: ${formaPagamento}` },
        { status: 400 }
      );
    }

    // Validar se é entrega e tem endereço
    if (tipoEntrega === "ENTREGA" && !enderecoEntrega) {
      return NextResponse.json(
        { error: "Endereço de entrega é obrigatório" },
        { status: 400 }
      );
    }

    console.log("Validações básicas passaram");

    // Gerar número do pedido único
    console.log("Buscando último pedido...");
    const ultimoPedido = await prisma.pedido.findFirst({
      orderBy: { createdAt: "desc" },
      select: { numero: true },
    });
    console.log("Último pedido encontrado:", ultimoPedido);

    let numeroSequencial = 1;
    if (ultimoPedido) {
      const ultimoNumero = parseInt(ultimoPedido.numero.replace("PED-", ""));
      numeroSequencial = ultimoNumero + 1;
    }

    const numeroPedido = `PED-${numeroSequencial.toString().padStart(6, "0")}`;

    // Buscar produtos para validar preços e calcular totais
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

    // Calcular subtotal
    let subtotal = 0;
    const itensParaCriar = [];

    for (const item of itens) {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) continue;

      // Validar quantidade
      if (item.quantidade < produto.compraMinima) {
        return NextResponse.json(
          {
            error: `Quantidade mínima para ${produto.titulo}: ${produto.compraMinima}`,
          },
          { status: 400 }
        );
      }

      if (produto.compraMaxima && item.quantidade > produto.compraMaxima) {
        return NextResponse.json(
          {
            error: `Quantidade máxima para ${produto.titulo}: ${produto.compraMaxima}`,
          },
          { status: 400 }
        );
      }

      if (item.quantidade > produto.quantidadeEstoque) {
        return NextResponse.json(
          { error: `Estoque insuficiente para ${produto.titulo}` },
          { status: 400 }
        );
      }

      const precoUnitario = parseFloat(produto.preco.toString());
      const subtotalItem = precoUnitario * item.quantidade;
      subtotal += subtotalItem;

      itensParaCriar.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
        subtotal: subtotalItem,
        produtoTitulo: produto.titulo,
        produtoSku: produto.sku,
      });
    }

    // Por enquanto, frete é 0 (pode ser calculado depois)
    const frete = 0;
    const total = subtotal + frete;

    // Criar pedido
    console.log("Criando pedido com dados:", {
      numero: numeroPedido,
      userId: session.user.id,
      tipoEntrega,
      formaPagamento,
      condicaoPagamento,
      subtotal,
      frete,
      total,
      itensCount: itensParaCriar.length,
    });

    let pedido;
    try {
      pedido = await prisma.pedido.create({
        data: {
          numero: numeroPedido,
          userId: session.user.id,
          tipoEntrega,
          formaPagamento,
          condicaoPagamento: condicaoPagamento || null,
          subtotal,
          frete,
          total,
          enderecoEntrega: enderecoEntrega?.endereco || null,
          numeroEntrega: enderecoEntrega?.numero || null,
          complementoEntrega: enderecoEntrega?.complemento || null,
          bairroEntrega: enderecoEntrega?.bairro || null,
          cidadeEntrega: enderecoEntrega?.cidade || null,
          estadoEntrega: enderecoEntrega?.estado || null,
          cepEntrega: enderecoEntrega?.cep || null,
          observacoes,
          itens: {
            create: itensParaCriar,
          },
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
      console.log("Pedido criado com sucesso:", pedido.id);
    } catch (createError) {
      console.error("ERRO ESPECÍFICO NA CRIAÇÃO DO PEDIDO:", createError);
      console.error("Dados que causaram o erro:", {
        numero: numeroPedido,
        userId: session.user.id,
        tipoEntrega,
        formaPagamento,
        condicaoPagamento: condicaoPagamento || null,
        subtotal,
        frete,
        total,
        itensParaCriar,
      });
      throw createError;
    }

    // Atualizar estoque dos produtos (reduzir)
    for (const item of itens) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          quantidadeEstoque: {
            decrement: item.quantidade,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      pedido: {
        id: pedido.id,
        numero: pedido.numero,
        status: pedido.status,
        total: parseFloat(pedido.total.toString()),
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
