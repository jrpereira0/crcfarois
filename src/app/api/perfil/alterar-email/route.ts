import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { novoEmail, senhaAtual } = await request.json();

    if (!novoEmail || !senhaAtual) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(novoEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, user.password);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 400 }
      );
    }

    // Verificar se o novo email já está em uso
    const emailExistente = await prisma.user.findUnique({
      where: { email: novoEmail.toLowerCase() },
    });

    if (emailExistente && emailExistente.id !== user.id) {
      return NextResponse.json(
        { error: "Este email já está em uso por outro usuário" },
        { status: 400 }
      );
    }

    // Atualizar email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: novoEmail.toLowerCase(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email alterado com sucesso. Faça login novamente com o novo email.",
    });
  } catch (error) {
    console.error("Erro ao alterar email:", error);
    return NextResponse.json(
      { error: "Erro ao alterar email" },
      { status: 500 }
    );
  }
}

