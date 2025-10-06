import { NextRequest, NextResponse } from "next/server";
import { enviarEmailFormularioContato } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, telefone, empresa, assunto, mensagem } = body;

    // Validação básica
    if (!nome || !email || !assunto || !mensagem) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 }
      );
    }

    // Enviar email
    const resultado = await enviarEmailFormularioContato({
      nome,
      email,
      telefone: telefone || "",
      empresa: empresa || "",
      assunto,
      mensagem,
    });

    if (!resultado.success) {
      console.error("Erro ao enviar email:", resultado.error);
      return NextResponse.json(
        { error: "Erro ao enviar mensagem. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Mensagem enviada com sucesso!" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no endpoint de contato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

