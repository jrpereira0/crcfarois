interface SolicitacaoCadastroData {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
}

export const emailSolicitacaoCadastro = (
  data: SolicitacaoCadastroData
): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitação de Cadastro Recebida - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente azul -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: -0.5px;">
                CRC Faróis
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 14px;">
                Excelência em Iluminação Automotiva
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Olá, ${data.nomeResponsavel}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Recebemos sua solicitação de cadastro da empresa <strong style="color: #1e40af;">${
                  data.razaoSocial
                }</strong> em nossa plataforma B2B.
              </p>
              
              <!-- Box de destaque -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                      📋 Próximos Passos
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Nossa equipe irá analisar sua solicitação</li>
                      <li style="margin-bottom: 8px;">Você receberá uma resposta em <strong>até 48 horas úteis</strong></li>
                      <li style="margin-bottom: 8px;">Após aprovação, você terá acesso completo à plataforma</li>
                      <li>Um representante será designado para atendê-lo</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Enquanto isso, caso tenha alguma dúvida, nossa equipe está à disposição:
              </p>
              
              <!-- Informações de contato -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid #e2e8f0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: middle;">
                          <span style="font-size: 24px;">📞</span>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Telefone</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 500;">(11) 99226-8645</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid #e2e8f0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: middle;">
                          <span style="font-size: 24px;">✉️</span>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Email</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 500;">contato@crcfarois.ind.br</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: middle;">
                          <span style="font-size: 24px;">🕐</span>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; color: #64748b; font-size: 13px;">Horário de Atendimento</p>
                          <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 500;">Seg - Qui: 08h às 17h | Sex: 08h às 16h</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Agradecemos seu interesse em fazer parte da nossa rede de parceiros!
              </p>
              
              <p style="margin: 20px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Atenciosamente,<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Este é um email automático, por favor não responda.
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
