interface AprovacaoCadastroData {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
  representanteNome: string;
  representanteEmail: string;
  representanteWhatsapp: string;
}

export const emailAprovacaoCadastro = (data: AprovacaoCadastroData): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cadastro Aprovado - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente verde (sucesso) -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Cadastro Aprovado!
              </h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">
                Bem-vindo à CRC Faróis
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Parabéns, ${data.nomeResponsavel}! 🎉
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                É com grande satisfação que informamos que o cadastro da empresa <strong style="color: #059669;">${
                  data.razaoSocial
                }</strong> foi aprovado!
              </p>
              
              <!-- Box de sucesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #059669; font-size: 16px; font-weight: 600;">
                      🚀 Você já pode acessar a plataforma!
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                      Utilize o email <strong>${
                        data.emailResponsavel
                      }</strong> e a senha cadastrada para fazer login e começar a explorar nosso catálogo completo de produtos.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Botão de acesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://crcfarois.com.br"
                    }/login" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      Acessar Plataforma B2B
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                <strong style="color: #1e293b;">Seu representante designado:</strong>
              </p>
              
              <!-- Card do representante -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 17px; font-weight: 600;">
                      👤 ${data.representanteNome}
                    </p>
                    <p style="margin: 0 0 6px 0; color: #64748b; font-size: 14px;">
                      📧 ${data.representanteEmail}
                    </p>
                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                      📱 WhatsApp: ${data.representanteWhatsapp}
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Seu representante está à disposição para tirar dúvidas, apresentar nossos produtos e auxiliá-lo em suas compras.
              </p>
              
              <p style="margin: 30px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Seja bem-vindo e ótimos negócios!<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Precisa de ajuda? Entre em contato: contato@crcfarois.ind.br | (11) 99226-8645
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
