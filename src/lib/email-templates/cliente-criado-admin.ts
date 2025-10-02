interface ClienteCriadoAdminData {
  nomeResponsavel: string;
  razaoSocial: string;
  emailResponsavel: string;
  senhaAcesso: string;
  representanteNome: string;
  representanteEmail: string;
  representanteWhatsapp: string;
}

export const emailClienteCriadoAdmin = (
  data: ClienteCriadoAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à CRC Faróis</title>
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
                Bem-vindo à CRC Faróis! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">
                Seu cadastro foi realizado com sucesso
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
                É com grande satisfação que informamos que a empresa <strong style="color: #1e40af;">${
                  data.razaoSocial
                }</strong> foi cadastrada em nossa plataforma B2B!
              </p>
              
              <!-- Box de destaque - Dados de Acesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                      🔐 Seus Dados de Acesso
                    </p>
                    <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; margin-bottom: 12px;">
                      <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px;">
                        <strong style="color: #1e293b;">Email:</strong>
                      </p>
                      <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                        ${data.emailResponsavel}
                      </p>
                      <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px;">
                        <strong style="color: #1e293b;">Senha:</strong>
                      </p>
                      <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                        ${data.senhaAcesso}
                      </p>
                    </div>
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                      💡 <em>Por segurança, recomendamos alterar sua senha após o primeiro acesso.</em>
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
                Seu representante está à disposição para tirar dúvidas, apresentar nossos produtos e auxiliá-lo em suas compras. Não hesite em entrar em contato!
              </p>
              
              <!-- Recursos disponíveis -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                      ✨ O que você pode fazer na plataforma:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Navegar pelo catálogo completo de produtos</li>
                      <li style="margin-bottom: 8px;">Adicionar produtos ao carrinho</li>
                      <li style="margin-bottom: 8px;">Fazer pedidos com condições especiais</li>
                      <li style="margin-bottom: 8px;">Acompanhar histórico de pedidos</li>
                      <li>Entrar em contato com seu representante</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
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
                Precisa de ajuda? Entre em contato: contato@crcfarois.ind.br) 99226-8645
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
