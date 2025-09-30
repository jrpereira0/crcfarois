import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Buscar clientes por nome/razão social
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ clientes: [] });
    }

    const clientes = await prisma.user.findMany({
      where: {
        role: "CLIENTE",
        AND: [
          {
            cliente: {
              isNot: null,
            },
          },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                cliente: {
                  razaoSocial: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
              {
                cliente: {
                  cnpjCpf: {
                    contains: query,
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        cliente: true,
      },
      take: 10, // Limitar resultados
      orderBy: {
        cliente: {
          razaoSocial: "asc",
        },
      },
    });

    return NextResponse.json({ clientes });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
