import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmailRecuperacaoSenha } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Por segurança, sempre retornar sucesso mesmo se o email não existir
    // Isso evita que atacantes descubram quais emails estão cadastrados
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "Se o email estiver cadastrado, você receberá um código de verificação",
      });
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex");

    // Criar expiração de 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Invalidar tokens anteriores do mesmo email
    await prisma.passwordResetToken.updateMany({
      where: {
        email: email.toLowerCase(),
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Criar novo token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        code,
        expires,
      },
    });

    // Enviar email com código
    await enviarEmailRecuperacaoSenha({
      email: user.email,
      nomeUsuario: user.name || "Usuário",
      codigo: code,
    });

    return NextResponse.json({
      success: true,
      message: "Código de verificação enviado para seu email",
      token, // Token será usado para validar o código
    });
  } catch (error) {
    console.error("Erro ao processar solicitação de recuperação:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
