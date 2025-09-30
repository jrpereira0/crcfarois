import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "REPRESENTANTE") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar todas as categorias ativas que possuem produtos
    const categorias = await prisma.categoria.findMany({
      where: {
        ativo: true,
        produtos: {
          some: {
            ativo: true,
          },
        },
      },
      select: {
        id: true,
        nome: true,
        slug: true,
      },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json({ categorias });
  } catch (error) {
    console.error("Erro ao buscar categorias para representante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
