import * as brevo from "@getbrevo/brevo";
import { apiInstance } from "./brevo";
import { emailSolicitacaoCadastro } from "./email-templates/solicitacao-cadastro";
import { emailAprovacaoCadastro } from "./email-templates/aprovacao-cadastro";
import { emailRejeicaoCadastro } from "./email-templates/rejeicao-cadastro";
import { emailNovoClienteRepresentante } from "./email-templates/novo-cliente-representante";
import { emailClienteCriadoAdmin } from "./email-templates/cliente-criado-admin";
import { emailRepresentanteCriadoAdmin } from "./email-templates/representante-criado-admin";
import { emailNovoPedidoCliente } from "./email-templates/novo-pedido-cliente";
import { emailNovoPedidoRepresentante } from "./email-templates/novo-pedido-representante";
import { emailNovoPedidoAdmin } from "./email-templates/novo-pedido-admin";
import { emailStatusPedidoAlterado } from "./email-templates/status-pedido-alterado";

interface EnviarEmailSolicitacaoParams {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
}

interface EnviarEmailAprovacaoParams {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
  representanteNome: string;
  representanteEmail: string;
  representanteWhatsapp: string;
}

/**
 * Envia email de confirmação de solicitação de cadastro
 */
export async function enviarEmailSolicitacaoCadastro(
  params: EnviarEmailSolicitacaoParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Solicitação de Cadastro Recebida - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailResponsavel,
        name: params.nomeResponsavel,
      },
    ];
    sendSmtpEmail.htmlContent = emailSolicitacaoCadastro(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de solicitação enviado com sucesso:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de solicitação:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de aprovação de cadastro
 */
export async function enviarEmailAprovacaoCadastro(
  params: EnviarEmailAprovacaoParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Cadastro Aprovado - Bem-vindo à CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailResponsavel,
        name: params.nomeResponsavel,
      },
    ];
    sendSmtpEmail.htmlContent = emailAprovacaoCadastro(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de aprovação enviado com sucesso:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de aprovação:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de rejeição de cadastro
 */
export async function enviarEmailRejeicaoCadastro(params: {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
  motivoRejeicao: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Atualização sobre sua Solicitação - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailResponsavel,
        name: params.nomeResponsavel,
      },
    ];
    sendSmtpEmail.htmlContent = emailRejeicaoCadastro(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de rejeição enviado com sucesso:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de rejeição:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email para representante informando novo cliente atribuído
 */
export async function enviarEmailNovoClienteRepresentante(params: {
  representanteNome: string;
  representanteEmail: string;
  clienteRazaoSocial: string;
  clienteResponsavel: string;
  clienteEmail: string;
  clienteWhatsapp: string;
  clienteTelefone: string;
  clienteCidade: string;
  clienteEstado: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎯 Novo Cliente Atribuído - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.representanteEmail,
        name: params.representanteNome,
      },
    ];
    sendSmtpEmail.htmlContent = emailNovoClienteRepresentante(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email para representante enviado com sucesso:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email para representante:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email para cliente criado diretamente pelo admin
 */
export async function enviarEmailClienteCriadoAdmin(params: {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
  representanteNome: string;
  representanteEmail: string;
  representanteWhatsapp: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Bem-vindo à CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailResponsavel,
        name: params.nomeResponsavel,
      },
    ];
    sendSmtpEmail.htmlContent = emailClienteCriadoAdmin(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      "Email para cliente criado pelo admin enviado com sucesso:",
      response
    );
    return { success: true };
  } catch (error: any) {
    console.error(
      "Erro ao enviar email para cliente criado pelo admin:",
      error
    );
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email para representante criado diretamente pelo admin
 */
export async function enviarEmailRepresentanteCriadoAdmin(params: {
  nomeRepresentante: string;
  emailRepresentante: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Bem-vindo à Equipe CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailRepresentante,
        name: params.nomeRepresentante,
      },
    ];
    sendSmtpEmail.htmlContent = emailRepresentanteCriadoAdmin(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      "Email para representante criado pelo admin enviado com sucesso:",
      response
    );
    return { success: true };
  } catch (error: any) {
    console.error(
      "Erro ao enviar email para representante criado pelo admin:",
      error
    );
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de novo pedido para o cliente
 */
export async function enviarEmailNovoPedidoCliente(params: {
  nomeCliente: string;
  emailCliente: string;
  numeroPedido: string;
  dataPedido: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: string;
  frete: string;
  total: string;
  itens: Array<{
    titulo: string;
    quantidade: number;
    precoUnitario: string;
    subtotal: string;
  }>;
  enderecoEntrega?: {
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `✅ Pedido #${params.numeroPedido} Confirmado - CRC Faróis`;
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailCliente,
        name: params.nomeCliente,
      },
    ];
    sendSmtpEmail.htmlContent = emailNovoPedidoCliente(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de novo pedido enviado para cliente:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de novo pedido para cliente:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de novo pedido para o representante
 */
export async function enviarEmailNovoPedidoRepresentante(params: {
  nomeRepresentante: string;
  emailRepresentante: string;
  numeroPedido: string;
  dataPedido: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: string;
  frete: string;
  total: string;
  itens: Array<{
    titulo: string;
    quantidade: number;
    precoUnitario: string;
    subtotal: string;
  }>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `🎯 Novo Pedido #${params.numeroPedido} - ${params.clienteNome}`;
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailRepresentante,
        name: params.nomeRepresentante,
      },
    ];
    sendSmtpEmail.htmlContent = emailNovoPedidoRepresentante(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de novo pedido enviado para representante:", response);
    return { success: true };
  } catch (error: any) {
    console.error(
      "Erro ao enviar email de novo pedido para representante:",
      error
    );
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de novo pedido para o admin
 */
export async function enviarEmailNovoPedidoAdmin(params: {
  emailAdmin: string;
  numeroPedido: string;
  dataPedido: string;
  clienteNome: string;
  clienteEmail: string;
  representanteNome?: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: string;
  frete: string;
  total: string;
  quantidadeItens: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `🔔 Novo Pedido #${params.numeroPedido} - CRC Faróis`;
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailAdmin,
        name: "Administração",
      },
    ];
    sendSmtpEmail.htmlContent = emailNovoPedidoAdmin(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de novo pedido enviado para admin:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de novo pedido para admin:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email de alteração de status do pedido para o cliente
 */
export async function enviarEmailStatusPedidoAlterado(params: {
  nomeCliente: string;
  emailCliente: string;
  numeroPedido: string;
  statusAnterior: string;
  statusNovo: string;
  dataPedido: string;
  subtotal: string;
  frete: string;
  total: string;
  itens: Array<{
    titulo: string;
    quantidade: number;
    precoUnitario: string;
    subtotal: string;
  }>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    const statusLabels: Record<string, string> = {
      PENDENTE: "Pendente",
      CONFIRMADO: "Confirmado",
      EM_SEPARACAO: "Em Separação",
      ENVIADO: "Enviado",
      PRONTO_RETIRADA: "Pronto para Retirada",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
    };

    sendSmtpEmail.subject = `📦 Pedido #${params.numeroPedido} - ${
      statusLabels[params.statusNovo] || params.statusNovo
    }`;
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crc.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailCliente,
        name: params.nomeCliente,
      },
    ];
    sendSmtpEmail.htmlContent = emailStatusPedidoAlterado(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email de alteração de status enviado:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de alteração de status:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}
