interface UsuarioCriadoAdminData {
  nomeUsuario: string;
  emailUsuario: string;
  senhaAcesso: string;
  tipoUsuario: "ADMIN" | "FUNCIONARIO";
}

export const emailUsuarioCriadoAdmin = (
  data: UsuarioCriadoAdminData
): string => {
  const tipoTexto =
    data.tipoUsuario === "ADMIN" ? "Administrador" : "Funcionário";
  const corTipo = data.tipoUsuario === "ADMIN" ? "#dc2626" : "#2563eb";

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
          
          <!-- Header com gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Bem-vindo à Equipe! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">
                Acesso ao Sistema CRC Faróis
              </p>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Olá, ${data.nomeUsuario}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                É com grande satisfação que informamos que você foi cadastrado como <strong style="color: ${corTipo};">${tipoTexto}</strong> no sistema administrativo da CRC Faróis!
              </p>
              
              <!-- Badge do tipo de usuário -->
              <div style="text-align: center; margin: 25px 0;">
                <span style="display: inline-block; background: ${corTipo}; color: #ffffff; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  ${tipoTexto}
                </span>
              </div>
              
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
                            ${data.emailUsuario}
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
                      ⚠️ <strong>Importante:</strong> Guarde esta senha em local seguro. Recomendamos alterá-la no primeiro acesso através do menu de perfil.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Botão de acesso -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${
                      process.env.NEXT_PUBLIC_APP_URL || "https://crcfarois.com.br"
                    }/login" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                      Acessar Sistema
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Permissões -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">
                      🎯 Suas Permissões:
                    </p>
                    ${
                      data.tipoUsuario === "ADMIN"
                        ? `
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Gerenciar todos os clientes e representantes</li>
                      <li style="margin-bottom: 8px;">Criar e editar produtos e categorias</li>
                      <li style="margin-bottom: 8px;">Aprovar ou recusar pedidos</li>
                      <li style="margin-bottom: 8px;">Analisar solicitações de cadastro</li>
                      <li style="margin-bottom: 8px;">Gerenciar faturamentos</li>
                      <li style="margin-bottom: 8px;">Criar novos usuários (admin/funcionário)</li>
                      <li>Acesso total ao sistema</li>
                    </ul>
                    `
                        : `
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Gerenciar clientes e representantes</li>
                      <li style="margin-bottom: 8px;">Criar e editar produtos e categorias</li>
                      <li style="margin-bottom: 8px;">Aprovar ou recusar pedidos</li>
                      <li style="margin-bottom: 8px;">Analisar solicitações de cadastro</li>
                      <li>Gerenciar faturamentos</li>
                    </ul>
                    <p style="margin: 12px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                      <em>Nota: Funcionários não podem criar novos usuários do sistema.</em>
                    </p>
                    `
                    }
                  </td>
                </tr>
              </table>
              
              <!-- Dicas importantes -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px 0; color: #854d0e; font-size: 16px; font-weight: 600;">
                      💡 Primeiros Passos:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Faça login com suas credenciais</li>
                      <li style="margin-bottom: 8px;">Altere sua senha no menu de perfil</li>
                      <li style="margin-bottom: 8px;">Explore o dashboard e familiarize-se com o sistema</li>
                      <li>Entre em contato com a equipe em caso de dúvidas</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Seja bem-vindo à equipe!<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                Suporte administrativo: contato@crcfarois.ind.br | (11) 99226-8645
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

