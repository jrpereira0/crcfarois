import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, code, newPassword } = await request.json();

    if (!token || !code || !newPassword) {
      return NextResponse.json(
        { error: "Token, código e nova senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar senha
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      );
    }

    // Verificar se o token já foi usado
    if (resetToken.used) {
      return NextResponse.json(
        { error: "Este código já foi utilizado" },
        { status: 400 }
      );
    }

    // Verificar se o token expirou
    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { error: "Código expirado. Solicite um novo código" },
        { status: 400 }
      );
    }

    // Verificar se o código está correto
    if (resetToken.code !== code) {
      return NextResponse.json(
        { error: "Código incorreto" },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Marcar token como usado
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: {
        used: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}

