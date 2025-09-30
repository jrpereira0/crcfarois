import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enviarEmailNovoClienteRepresentante } from "@/lib/email";

// POST - Atribuir clientes ao representante (admin)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = params;
    const { clientesIds } = await request.json();

    // Verificar se representante existe e buscar dados completos
    const representante = await prisma.representante.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!representante) {
      return NextResponse.json(
        { error: "Representante não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se os clientes já têm representantes
    if (clientesIds && clientesIds.length > 0) {
      const clientesComRepresentantes =
        await prisma.representanteCliente.findMany({
          where: {
            clienteId: { in: clientesIds },
          },
          include: {
            cliente: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            representante: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

      if (clientesComRepresentantes.length > 0) {
        const clientesIndisponiveis = clientesComRepresentantes.map(
          (rel) =>
            `${rel.cliente.user.name} (já possui representante: ${rel.representante.user.name})`
        );

        return NextResponse.json(
          {
            error: "Alguns clientes já possuem representantes",
            clientesIndisponiveis,
          },
          { status: 400 }
        );
      }
    }

    // Buscar clientes antigos para identificar novos
    const clientesAntigos = await prisma.representanteCliente.findMany({
      where: { representanteId: id },
      select: { clienteId: true },
    });
    const clientesAntigosIds = clientesAntigos.map((rel) => rel.clienteId);

    // Identificar novos clientes (que não estavam antes)
    const novosClientesIds =
      clientesIds?.filter(
        (clienteId: string) => !clientesAntigosIds.includes(clienteId)
      ) || [];

    // Atualizar relacionamentos
    await prisma.$transaction(async (tx) => {
      // Remover relacionamentos existentes
      await tx.representanteCliente.deleteMany({
        where: { representanteId: id },
      });

      // Criar novos relacionamentos
      if (clientesIds && clientesIds.length > 0) {
        await tx.representanteCliente.createMany({
          data: clientesIds.map((clienteId: string) => ({
            representanteId: id,
            clienteId,
          })),
        });
      }
    });

    // Enviar emails para cada novo cliente atribuído
    if (novosClientesIds.length > 0) {
      const novosClientes = await prisma.cliente.findMany({
        where: { id: { in: novosClientesIds } },
        select: {
          razaoSocial: true,
          responsavel: true,
          email: true,
          whatsapp: true,
          telefone: true,
          cidade: true,
          estado: true,
        },
      });

      // Enviar email para cada novo cliente (não bloquear se falhar)
      for (const cliente of novosClientes) {
        enviarEmailNovoClienteRepresentante({
          representanteNome: representante.user.name || "Representante",
          representanteEmail: representante.user.email,
          clienteRazaoSocial: cliente.razaoSocial,
          clienteResponsavel: cliente.responsavel,
          clienteEmail: cliente.email,
          clienteWhatsapp: cliente.whatsapp,
          clienteTelefone: cliente.telefone || "",
          clienteCidade: cliente.cidade || "",
          clienteEstado: cliente.estado || "",
        }).catch((error) => {
          console.error(
            `Erro ao enviar email para representante sobre cliente ${cliente.razaoSocial}:`,
            error
          );
        });
      }
    }

    return NextResponse.json({
      success: true,
      novosClientesCount: novosClientesIds.length,
    });
  } catch (error) {
    console.error("Erro ao atribuir clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
