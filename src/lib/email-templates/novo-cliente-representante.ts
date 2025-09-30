interface NovoClienteRepresentanteData {
  representanteNome: string;
  clienteRazaoSocial: string;
  clienteResponsavel: string;
  clienteEmail: string;
  clienteWhatsapp: string;
  clienteTelefone: string;
  clienteCidade: string;
  clienteEstado: string;
}

export const emailNovoClienteRepresentante = (
  data: NovoClienteRepresentanteData
): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Cliente Atribuído - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente azul -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Novo Cliente Atribuído! 🎯
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">
                Um novo cliente foi designado para você
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Olá, ${data.representanteNome}!
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Um novo cliente foi aprovado e atribuído a você. Confira os dados abaixo e entre em contato para dar as boas-vindas e apresentar nossos produtos.
              </p>
              
              <!-- Box destaque -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                      📋 Dados do Cliente
                    </p>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Empresa</p>
                          <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${
                            data.clienteRazaoSocial
                          }</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Responsável</p>
                          <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${
                            data.clienteResponsavel
                          }</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Email</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px;">${
                            data.clienteEmail
                          }</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">WhatsApp</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px;">${
                            data.clienteWhatsapp
                          }</p>
                        </td>
                      </tr>
                      ${
                        data.clienteTelefone
                          ? `
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Telefone</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px;">${data.clienteTelefone}</p>
                        </td>
                      </tr>
                      `
                          : ""
                      }
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Localização</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px;">${
                            data.clienteCidade
                          } - ${data.clienteEstado}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Próximos passos -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                      🚀 Próximos Passos
                    </p>
                    <ol style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Entre em contato com o cliente via WhatsApp ou email</li>
                      <li style="margin-bottom: 8px;">Apresente nosso catálogo e condições especiais</li>
                      <li style="margin-bottom: 8px;">Oriente sobre o acesso à plataforma B2B</li>
                      <li>Mantenha o relacionamento ativo e tire dúvidas</li>
                    </ol>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                O cliente já recebeu o email de aprovação e pode acessar a plataforma. Faça o primeiro contato para dar as boas-vindas e iniciar o relacionamento comercial!
              </p>
              
              <!-- Botão de acesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://crcfarois.com.br"
                    }/representante/clientes" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      Ver Meus Clientes
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Boas vendas!<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Precisa de suporte? Entre em contato: contato@crc.ind.br | (11) 99226-8645
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} CRC Faróis - Todos os direitos reservados
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

