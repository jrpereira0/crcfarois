import * as brevo from "@getbrevo/brevo";
import { apiInstance } from "./brevo";
import { emailSolicitacaoCadastro } from "./email-templates/solicitacao-cadastro";
import { emailAprovacaoCadastro } from "./email-templates/aprovacao-cadastro";
import { emailRejeicaoCadastro } from "./email-templates/rejeicao-cadastro";
import { emailNovoClienteRepresentante } from "./email-templates/novo-cliente-representante";
import { emailClienteCriadoAdmin } from "./email-templates/cliente-criado-admin";
import { emailRepresentanteCriadoAdmin } from "./email-templates/representante-criado-admin";

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
