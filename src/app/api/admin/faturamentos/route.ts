import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Listar faturamentos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const faturamentos = await prisma.faturamento.findMany({
      include: {
        cliente: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ faturamentos });
  } catch (error) {
    console.error("Erro ao buscar faturamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar faturamento
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { clienteId, valor, dataVencimento, observacoes } =
      await request.json();

    // Validações
    if (!clienteId || !valor || !dataVencimento) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // Verificar se cliente existe
    const cliente = await prisma.user.findUnique({
      where: { id: clienteId },
      include: { cliente: true },
    });

    if (!cliente || !cliente.cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Gerar número do faturamento
    const ultimoFaturamento = await prisma.faturamento.findFirst({
      orderBy: { numero: "desc" },
    });

    let proximoNumero = 1;
    if (ultimoFaturamento) {
      const ultimoNumeroInt = parseInt(
        ultimoFaturamento.numero.replace("FAT-", "")
      );
      proximoNumero = ultimoNumeroInt + 1;
    }

    const numeroFaturamento = `FAT-${proximoNumero
      .toString()
      .padStart(3, "0")}`;

    // Criar faturamento
    const novoFaturamento = await prisma.faturamento.create({
      data: {
        numero: numeroFaturamento,
        clienteId,
        valor: parseFloat(valor.toString()),
        dataVencimento: new Date(dataVencimento),
        observacoes,
        status: "PENDENTE" as any,
      },
      include: {
        cliente: {
          include: {
            cliente: true,
          },
        },
      },
    });

    return NextResponse.json({ faturamento: novoFaturamento });
  } catch (error) {
    console.error("Erro ao criar faturamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
