import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar dados do perfil
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        cliente: true,
        representante: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      cliente: user.cliente,
      representante: user.representante,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar dados do perfil
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      telefone,
      whatsapp,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
    } = data;

    // Atualizar nome do usuário
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    // Atualizar dados específicos baseado no role
    if (session.user.role === "CLIENTE") {
      const cliente = await prisma.cliente.findUnique({
        where: { userId: session.user.id },
      });

      if (cliente) {
        await prisma.cliente.update({
          where: { id: cliente.id },
          data: {
            responsavel: name,
            telefone,
            whatsapp,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
          },
        });
      }
    } else if (session.user.role === "REPRESENTANTE") {
      const representante = await prisma.representante.findUnique({
        where: { userId: session.user.id },
      });

      if (representante) {
        await prisma.representante.update({
          where: { id: representante.id },
          data: {
            telefone,
            whatsapp,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Perfil atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
