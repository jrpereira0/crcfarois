import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar faturamento específico
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

    const faturamento = await prisma.faturamento.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            cliente: true,
          },
        },
      },
    });

    if (!faturamento) {
      return NextResponse.json(
        { error: "Faturamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ faturamento });
  } catch (error) {
    console.error("Erro ao buscar faturamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar faturamento
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
      clienteId,
      valor,
      dataVencimento,
      status,
      observacoes,
      anexoUrl,
      anexoNome,
    } = await request.json();

    // Verificar se faturamento existe
    const faturamentoExistente = await prisma.faturamento.findUnique({
      where: { id },
    });

    if (!faturamentoExistente) {
      return NextResponse.json(
        { error: "Faturamento não encontrado" },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const dadosAtualizacao: any = {};

    if (clienteId) dadosAtualizacao.clienteId = clienteId;
    if (valor !== undefined)
      dadosAtualizacao.valor = parseFloat(valor.toString());
    if (dataVencimento)
      dadosAtualizacao.dataVencimento = new Date(dataVencimento);
    if (status) {
      dadosAtualizacao.status = status;
      // Se status mudou para PAGO, definir data de pagamento
      if (status === "PAGO" && faturamentoExistente.status !== "PAGO") {
        dadosAtualizacao.dataPagamento = new Date();
      }
      // Se status não é mais PAGO, remover data de pagamento
      if (status !== "PAGO") {
        dadosAtualizacao.dataPagamento = null;
      }
    }
    if (observacoes !== undefined) dadosAtualizacao.observacoes = observacoes;
    if (anexoUrl !== undefined) dadosAtualizacao.anexoUrl = anexoUrl;
    if (anexoNome !== undefined) dadosAtualizacao.anexoNome = anexoNome;

    // Atualizar faturamento
    const faturamentoAtualizado = await prisma.faturamento.update({
      where: { id },
      data: dadosAtualizacao,
      include: {
        cliente: {
          include: {
            cliente: true,
          },
        },
      },
    });

    return NextResponse.json({ faturamento: faturamentoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar faturamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir faturamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;

    // Verificar se faturamento existe
    const faturamento = await prisma.faturamento.findUnique({
      where: { id },
    });

    if (!faturamento) {
      return NextResponse.json(
        { error: "Faturamento não encontrado" },
        { status: 404 }
      );
    }

    // Excluir faturamento
    await prisma.faturamento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Faturamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir faturamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
