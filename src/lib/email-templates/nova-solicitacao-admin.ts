interface NovaSolicitacaoAdminData {
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
}

export function emailNovaSolicitacaoAdmin(
  data: NovaSolicitacaoAdminData
): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Solicitação de Cadastro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                🔔 Nova Solicitação de Cadastro
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Uma nova empresa solicitou cadastro na plataforma
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Alert Badge -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⚠️ Ação necessária: Análise de nova solicitação
                </p>
              </div>

              <!-- Company Info -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
                  📋 Dados da Empresa
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 35%;">
                      Razão Social:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">
                      ${data.razaoSocial}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">
                      CNPJ:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500; font-family: 'Courier New', monospace;">
                      ${data.cnpj}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">
                      Tipo:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">
                      ${data.tipoEmpresa}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">
                      Localização:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">
                      ${data.cidade} - ${data.estado}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Contact Info -->
              <div style="background-color: #f0f9ff; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600; border-bottom: 2px solid #bae6fd; padding-bottom: 12px;">
                  👤 Dados do Responsável
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600; width: 35%;">
                      Nome:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">
                      ${data.nomeResponsavel}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
                      E-mail:
                    </td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${data.emailResponsavel}" style="color: #2563eb; text-decoration: none; font-size: 14px;">
                        ${data.emailResponsavel}
                      </a>
                    </td>
                  </tr>
                  ${
                    data.telefoneResponsavel
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
                      Telefone:
                    </td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500; font-family: 'Courier New', monospace;">
                      ${data.telefoneResponsavel}
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td style="padding: 8px 0; color: #0c4a6e; font-size: 14px; font-weight: 600;">
                      WhatsApp:
                    </td>
                    <td style="padding: 8px 0;">
                      <a href="https://wa.me/${data.whatsappResponsavel.replace(/\D/g, "")}" style="color: #16a34a; text-decoration: none; font-size: 14px; font-weight: 500;">
                        ${data.whatsappResponsavel} 📱
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.crc.ind.br"}/dashboard/solicitacoes" 
                   style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3); transition: all 0.3s;">
                  🔍 Analisar Solicitação
                </a>
              </div>

              <!-- Info Box -->
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                  💡 <strong>Dica:</strong> Acesse o painel administrativo para revisar os dados completos, verificar a documentação e aprovar ou rejeitar esta solicitação.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                <strong>CRC Faróis</strong>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                Este é um e-mail automático de notificação do sistema.<br>
                ID da Solicitação: <span style="font-family: 'Courier New', monospace;">${data.solicitacaoId}</span>
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
}

