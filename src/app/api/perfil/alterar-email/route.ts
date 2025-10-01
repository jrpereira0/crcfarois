import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log("❌ Não autorizado - sem sessão");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { novoEmail, senhaAtual } = body;

    console.log("📧 Tentando alterar email:", {
      userId: session.user.id,
      emailAtual: session.user.email,
      novoEmail,
      temSenha: !!senhaAtual,
    });

    if (!novoEmail || !senhaAtual) {
      console.log("❌ Campos obrigatórios faltando:", {
        novoEmail: !!novoEmail,
        senhaAtual: !!senhaAtual,
      });
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(novoEmail)) {
      console.log("❌ Email inválido:", novoEmail);
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado:", session.user.id);
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, user.password);

    if (!senhaValida) {
      console.log("❌ Senha incorreta");
      return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });
    }

    // Verificar se o novo email já está em uso
    const emailExistente = await prisma.user.findUnique({
      where: { email: novoEmail.toLowerCase() },
    });

    if (emailExistente && emailExistente.id !== user.id) {
      console.log("❌ Email já em uso:", novoEmail);
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

    console.log("✅ Email alterado com sucesso:", {
      de: user.email,
      para: novoEmail,
    });

    return NextResponse.json({
      success: true,
      message:
        "Email alterado com sucesso. Faça login novamente com o novo email.",
    });
  } catch (error) {
    console.error("❌ Erro ao alterar email:", error);
    return NextResponse.json(
      { error: "Erro ao alterar email" },
      { status: 500 }
    );
  }
}
