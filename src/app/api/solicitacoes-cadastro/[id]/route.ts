import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  enviarEmailAprovacaoCadastro,
  enviarEmailRejeicaoCadastro,
  enviarEmailNovoClienteRepresentante,
} from "@/lib/email";

// PUT - Aprovar ou negar solicitação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const solicitacaoId = params.id;
    const body = await request.json();
    const { acao, representanteId, motivoRejeicao } = body;

    // Buscar solicitação
    const solicitacao = await prisma.solicitacaoCadastro.findUnique({
      where: { id: solicitacaoId },
    });

    if (!solicitacao) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    if (solicitacao.status !== "PENDENTE") {
      return NextResponse.json(
        { error: "Solicitação já foi processada" },
        { status: 400 }
      );
    }

    if (acao === "APROVAR") {
      if (!representanteId) {
        return NextResponse.json(
          { error: "Representante é obrigatório para aprovação" },
          { status: 400 }
        );
      }

      // Verificar se representante existe e buscar dados do usuário
      const representante = await prisma.representante.findUnique({
        where: { id: representanteId },
        select: {
          id: true,
          whatsapp: true,
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

      // Usar transação para criar usuário, cliente e atualizar solicitação
      const resultado = await prisma.$transaction(async (tx) => {
        // Criar usuário
        const user = await tx.user.create({
          data: {
            name: solicitacao.nomeResponsavel,
            email: solicitacao.emailResponsavel,
            password: solicitacao.senha, // Já está hasheada
            role: "CLIENTE",
          },
        });

        // Criar cliente
        const cliente = await tx.cliente.create({
          data: {
            userId: user.id,
            razaoSocial: solicitacao.razaoSocial,
            responsavel: solicitacao.nomeResponsavel,
            cnpjCpf: solicitacao.cnpj,
            inscricaoEstadual: solicitacao.inscricaoEstadual,
            inscricaoMunicipal: solicitacao.inscricaoMunicipal,
            tipoEmpresa: solicitacao.tipoEmpresa,
            cep: solicitacao.cep,
            endereco: solicitacao.endereco,
            numero: solicitacao.numero,
            complemento: solicitacao.complemento,
            bairro: solicitacao.bairro,
            cidade: solicitacao.cidade,
            estado: solicitacao.estado,
            email: solicitacao.emailResponsavel,
            telefone: solicitacao.telefoneResponsavel,
            whatsapp: solicitacao.whatsappResponsavel,
            ativo: true,
          },
        });

        // Atribuir cliente ao representante
        await tx.representanteCliente.create({
          data: {
            representanteId: representanteId,
            clienteId: cliente.id,
          },
        });

        // Atualizar solicitação
        const solicitacaoAtualizada = await tx.solicitacaoCadastro.update({
          where: { id: solicitacaoId },
          data: {
            status: "APROVADA",
            aprovadoPorId: session.user.id,
            representanteId: representanteId,
            aprovadaEm: new Date(),
          },
        });

        return {
          user,
          cliente,
          solicitacao: solicitacaoAtualizada,
          representante,
        };
      });

      // Enviar email de aprovação para o cliente (não bloquear se falhar)
      enviarEmailAprovacaoCadastro({
        nomeResponsavel: solicitacao.nomeResponsavel,
        razaoSocial: solicitacao.razaoSocial,
        emailResponsavel: solicitacao.emailResponsavel,
        representanteNome: representante.user.name || "Representante",
        representanteEmail: representante.user.email,
        representanteWhatsapp: representante.whatsapp || "Não informado",
      }).catch((error) => {
        console.error("Erro ao enviar email de aprovação:", error);
      });

      // Enviar email separado para o representante (não bloquear se falhar)
      enviarEmailNovoClienteRepresentante({
        representanteNome: representante.user.name || "Representante",
        representanteEmail: representante.user.email,
        clienteRazaoSocial: solicitacao.razaoSocial,
        clienteResponsavel: solicitacao.nomeResponsavel,
        clienteEmail: solicitacao.emailResponsavel,
        clienteWhatsapp: solicitacao.whatsappResponsavel,
        clienteTelefone: solicitacao.telefoneResponsavel || "",
        clienteCidade: solicitacao.cidade,
        clienteEstado: solicitacao.estado,
      }).catch((error) => {
        console.error("Erro ao enviar email para representante:", error);
      });

      return NextResponse.json({
        message: "Solicitação aprovada e cliente criado com sucesso",
        cliente: {
          id: resultado.cliente.id,
          razaoSocial: resultado.cliente.razaoSocial,
          email: resultado.user.email,
        },
      });
    } else if (acao === "NEGAR") {
      // Negar solicitação
      const solicitacaoAtualizada = await prisma.solicitacaoCadastro.update({
        where: { id: solicitacaoId },
        data: {
          status: "NEGADA",
          aprovadoPorId: session.user.id,
          motivoRejeicao:
            motivoRejeicao || "Solicitação negada pelo administrador",
          aprovadaEm: new Date(),
        },
      });

      // Enviar email de rejeição (não bloquear se falhar)
      enviarEmailRejeicaoCadastro({
        nomeResponsavel: solicitacao.nomeResponsavel,
        razaoSocial: solicitacao.razaoSocial,
        emailResponsavel: solicitacao.emailResponsavel,
        motivoRejeicao:
          motivoRejeicao || "Solicitação negada pelo administrador",
      }).catch((error) => {
        console.error("Erro ao enviar email de rejeição:", error);
      });

      return NextResponse.json({
        message: "Solicitação negada",
        solicitacao: {
          id: solicitacaoAtualizada.id,
          status: solicitacaoAtualizada.status,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Ação inválida. Use 'APROVAR' ou 'NEGAR'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Buscar solicitação específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const solicitacao = await prisma.solicitacaoCadastro.findUnique({
      where: { id: params.id },
      include: {
        aprovadoPor: {
          select: {
            name: true,
            email: true,
          },
        },
        representante: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!solicitacao) {
      return NextResponse.json(
        { error: "Solicitação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ solicitacao });
  } catch (error) {
    console.error("Erro ao buscar solicitação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
