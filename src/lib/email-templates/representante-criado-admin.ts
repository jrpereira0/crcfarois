interface RepresentanteCriadoAdminData {
  nomeRepresentante: string;
  emailRepresentante: string;
  senhaAcesso: string;
}

export const emailRepresentanteCriadoAdmin = (
  data: RepresentanteCriadoAdminData
): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à Equipe CRC Faróis</title>
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
                Bem-vindo à Equipe! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">
                Você agora faz parte da CRC Faróis
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Olá, ${data.nomeRepresentante}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                É com grande satisfação que informamos que você foi cadastrado como <strong style="color: #1e40af;">Representante Comercial</strong> na plataforma CRC Faróis!
              </p>
              
              <!-- Box de destaque com dados de acesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                      🔐 Seus Dados de Acesso
                    </p>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; padding: 16px;">
                      <tr>
                        <td style="padding: 12px 0;">
                          <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">
                            E-mail de Login:
                          </p>
                          <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                            ${data.emailRepresentante}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">
                            Senha de Acesso:
                          </p>
                          <p style="margin: 0; color: #1e40af; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                            ${data.senhaAcesso}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 16px 0 0 0; color: #dc2626; font-size: 13px; line-height: 1.6;">
                      ⚠️ <strong>Importante:</strong> Guarde esta senha em local seguro. Recomendamos alterá-la no primeiro acesso.
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
                      Acessar Painel de Representante
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Recursos disponíveis -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                      🎯 Suas Responsabilidades:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Gerenciar seus clientes atribuídos</li>
                      <li style="margin-bottom: 8px;">Fazer pedidos em nome dos clientes</li>
                      <li style="margin-bottom: 8px;">Acompanhar histórico de pedidos</li>
                      <li style="margin-bottom: 8px;">Apresentar catálogo e condições especiais</li>
                      <li>Manter relacionamento ativo com os clientes</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <!-- Dicas importantes -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 16px; font-weight: 600;">
                      💡 Dicas para o Sucesso:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Mantenha contato regular com seus clientes</li>
                      <li style="margin-bottom: 8px;">Responda rapidamente às solicitações</li>
                      <li style="margin-bottom: 8px;">Apresente novos produtos e promoções</li>
                      <li>Esteja sempre disponível via WhatsApp e email</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Quando novos clientes forem atribuídos a você, receberá uma notificação por email com todos os dados de contato.
              </p>
              
              <p style="margin: 30px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Caso tenha alguma dúvida sobre a plataforma ou suas funções, entre em contato com nossa equipe administrativa.
              </p>
              
              <p style="margin: 30px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Seja bem-vindo à equipe e boas vendas!<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Suporte administrativo: contato@crcfarois.ind.br (11) 99226-8645
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
