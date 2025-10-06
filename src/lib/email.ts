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
import { emailRecuperacaoSenhaTemplate } from "./email-templates/recuperacao-senha";
import { emailNovaSolicitacaoAdmin } from "./email-templates/nova-solicitacao-admin";
import { emailUsuarioCriadoAdmin } from "./email-templates/usuario-criado-admin";
import { emailFormularioContato } from "./email-templates/formulario-contato";

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
    console.log("📧 Preparando email de solicitação de cadastro...");
    console.log("   Para:", params.emailResponsavel);
    console.log(
      "   Remetente:",
      process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br"
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Solicitação de Cadastro Recebida - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailResponsavel,
        name: params.nomeResponsavel,
      },
    ];
    sendSmtpEmail.htmlContent = emailSolicitacaoCadastro(params);

    console.log("📤 Enviando email via Brevo...");
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email de solicitação enviado com sucesso!");
    console.log("   Response:", response);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro ao enviar email de solicitação:");
    console.error("   Mensagem:", error.message);
    console.error("   Status:", error.status || error.statusCode);
    console.error("   Body:", error.body || error.response?.body);
    console.error("   Stack:", error.stack);
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
  senhaAcesso: string;
  representanteNome: string;
  representanteEmail: string;
  representanteWhatsapp: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Bem-vindo à CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
  senhaAcesso: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Bem-vindo à Equipe CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailRepresentante,
        name: params.nomeRepresentante,
      },
    ];
    sendSmtpEmail.htmlContent = emailRepresentanteCriadoAdmin({
      nomeRepresentante: params.nomeRepresentante,
      emailRepresentante: params.emailRepresentante,
      senhaAcesso: params.senhaAcesso,
    });

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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
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

/**
 * Envia email de notificação ao admin sobre nova solicitação
 */
export async function enviarEmailNovaSolicitacaoAdmin(params: {
  razaoSocial: string;
  cnpj: string;
  nomeResponsavel: string;
  emailResponsavel: string;
  telefoneResponsavel?: string;
  whatsappResponsavel: string;
  cidade: string;
  estado: string;
  tipoEmpresa: string;
  solicitacaoId: string;
  adminEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📧 Enviando notificação de nova solicitação ao admin...");
    console.log("   Para:", params.adminEmail);

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🔔 Nova Solicitação de Cadastro - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.adminEmail,
        name: "Administrador",
      },
    ];
    sendSmtpEmail.htmlContent = emailNovaSolicitacaoAdmin({
      razaoSocial: params.razaoSocial,
      cnpj: params.cnpj,
      nomeResponsavel: params.nomeResponsavel,
      emailResponsavel: params.emailResponsavel,
      telefoneResponsavel: params.telefoneResponsavel,
      whatsappResponsavel: params.whatsappResponsavel,
      cidade: params.cidade,
      estado: params.estado,
      tipoEmpresa: params.tipoEmpresa,
      solicitacaoId: params.solicitacaoId,
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email de notificação enviado ao admin:", response);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro ao enviar email ao admin:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email para usuário (admin/funcionário) criado pelo admin
 */
export async function enviarEmailUsuarioCriadoAdmin(params: {
  nomeUsuario: string;
  emailUsuario: string;
  senhaAcesso: string;
  tipoUsuario: "ADMIN" | "FUNCIONARIO";
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📧 Enviando email para novo usuário:", params.emailUsuario);

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "🎉 Bem-vindo ao Sistema CRC Faróis!";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.emailUsuario,
        name: params.nomeUsuario,
      },
    ];
    sendSmtpEmail.htmlContent = emailUsuarioCriadoAdmin({
      nomeUsuario: params.nomeUsuario,
      emailUsuario: params.emailUsuario,
      senhaAcesso: params.senhaAcesso,
      tipoUsuario: params.tipoUsuario,
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email enviado para usuário criado pelo admin:", response);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro ao enviar email para usuário:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email com código de recuperação de senha
 */
export async function enviarEmailRecuperacaoSenha(params: {
  email: string;
  nomeUsuario: string;
  codigo: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Recuperação de Senha - CRC Faróis";
    sendSmtpEmail.sender = {
      name: "CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: params.email,
        name: params.nomeUsuario,
      },
    ];
    sendSmtpEmail.htmlContent = emailRecuperacaoSenhaTemplate({
      nomeUsuario: params.nomeUsuario,
      codigo: params.codigo,
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email de recuperação de senha enviado:", response);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email de recuperação de senha:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar email",
    };
  }
}

/**
 * Envia email do formulário de contato para o admin
 */
export async function enviarEmailFormularioContato(params: {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  assunto: string;
  mensagem: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("📧 Enviando email do formulário de contato...");
    console.log("   De:", params.email);
    console.log("   Nome:", params.nome);

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = `Novo Contato: ${params.assunto} - ${params.nome}`;
    sendSmtpEmail.sender = {
      name: "Site CRC Faróis",
      email: process.env.BREVO_SENDER_EMAIL || "contato@crcfarois.ind.br",
    };
    sendSmtpEmail.to = [
      {
        email: "contato@crcfarois.com.br",
        name: "Contato CRC Faróis",
      },
    ];
    sendSmtpEmail.replyTo = {
      email: params.email,
      name: params.nome,
    };
    sendSmtpEmail.htmlContent = emailFormularioContato(params);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email do formulário de contato enviado com sucesso!");
    console.log("   Response:", response);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro ao enviar email do formulário de contato:");
    console.error("   Mensagem:", error.message);
    console.error("   Status:", error.status || error.statusCode);
    console.error("   Body:", JSON.stringify(error.body || error.response?.body, null, 2));
    console.error("   Stack:", error.stack);
    
    // Se for hard bounce, mostrar detalhes
    if (error.body?.message) {
      console.error("   Detalhes Brevo:", error.body.message);
    }
    
    return {
      success: false,
      error: error.body?.message || error.message || "Erro desconhecido ao enviar email",
    };
  }
}
