import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

// GET - Buscar usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const usuario = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (usuario.role !== "ADMIN" && usuario.role !== "FUNCIONARIO") {
      return NextResponse.json(
        { error: "Usuário não é admin ou funcionário" },
        { status: 400 }
      );
    }

    return NextResponse.json({ usuario });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Verificar se usuário existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (
      usuarioExistente.role !== "ADMIN" &&
      usuarioExistente.role !== "FUNCIONARIO"
    ) {
      return NextResponse.json(
        { error: "Usuário não é admin ou funcionário" },
        { status: 400 }
      );
    }

    // Impedir que o usuário altere seu próprio role
    if (session.user.id === params.id && role && role !== session.user.role) {
      return NextResponse.json(
        { error: "Você não pode alterar seu próprio nível de acesso" },
        { status: 400 }
      );
    }

    // Validações
    if (role && role !== "ADMIN" && role !== "FUNCIONARIO") {
      return NextResponse.json(
        { error: "Role inválido. Deve ser ADMIN ou FUNCIONARIO" },
        { status: 400 }
      );
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Email inválido" },
          { status: 400 }
        );
      }

      // Verificar se email já está em uso por outro usuário
      const emailEmUso = await prisma.user.findFirst({
        where: {
          email,
          id: { not: params.id },
        },
      });

      if (emailEmUso) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 }
        );
      }
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Preparar dados para atualização
    const dataToUpdate: any = {};

    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (role) dataToUpdate.role = role;
    if (password) {
      dataToUpdate.password = await bcryptjs.hash(password, 10);
    }

    // Atualizar usuário
    const usuario = await prisma.user.update({
      where: { id: params.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      usuario,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Impedir que o usuário delete a si mesmo
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: "Você não pode excluir sua própria conta" },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const usuario = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (usuario.role !== "ADMIN" && usuario.role !== "FUNCIONARIO") {
      return NextResponse.json(
        { error: "Usuário não é admin ou funcionário" },
        { status: 400 }
      );
    }

    // Excluir usuário
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Usuário excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

