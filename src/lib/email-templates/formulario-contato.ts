/**
 * Template de email para formulário de contato
 */

interface FormularioContatoParams {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  assunto: string;
  mensagem: string;
}

export function emailFormularioContato(params: FormularioContatoParams): string {
  const assuntoDescricao: { [key: string]: string } = {
    orcamento: "Solicitação de Orçamento",
    produtos: "Informações sobre Produtos",
    suporte: "Suporte Técnico",
    parceria: "Parceria Comercial",
    outros: "Outros",
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Contato - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                📬 Novo Contato
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px;">
                Formulário do Site - CRC Faróis
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Alerta de novo contato -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⚡ NOVO CONTATO RECEBIDO
                </p>
                <p style="margin: 5px 0 0 0; color: #78350f; font-size: 13px;">
                  Respondeu através do formulário de contato do site
                </p>
              </div>

              <!-- Assunto -->
              <div style="background-color: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 2px solid #3b82f6;">
                <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  Assunto
                </p>
                <p style="margin: 0; color: #1e3a8a; font-size: 18px; font-weight: 700;">
                  ${assuntoDescricao[params.assunto] || params.assunto}
                </p>
              </div>

              <!-- Dados do Contato -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">
                  👤 Dados do Contato
                </h2>
                
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                        Nome
                      </p>
                      <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                        ${params.nome}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                        E-mail
                      </p>
                      <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                        <a href="mailto:${params.email}" style="color: #3b82f6; text-decoration: none;">
                          ${params.email}
                        </a>
                      </p>
                    </td>
                  </tr>
                  ${
                    params.telefone
                      ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                        Telefone
                      </p>
                      <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                        <a href="tel:${params.telefone}" style="color: #3b82f6; text-decoration: none;">
                          ${params.telefone}
                        </a>
                      </p>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    params.empresa
                      ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                        Empresa
                      </p>
                      <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 15px; font-weight: 600;">
                        ${params.empresa}
                      </p>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <!-- Mensagem -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; font-weight: 700; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">
                  💬 Mensagem
                </h2>
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                  <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${params.mensagem}
                  </p>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 25px; text-align: center; margin-top: 30px;">
                <p style="margin: 0 0 15px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                  📞 Responda o mais rápido possível
                </p>
                <a href="mailto:${params.email}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                  Responder E-mail
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 700;">
                CRC Faróis
              </p>
              <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 13px;">
                Especialistas em Faróis Automotivos desde 2022
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este é um email automático enviado pelo sistema de contato do site.
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

