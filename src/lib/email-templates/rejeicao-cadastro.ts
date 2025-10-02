interface RejeicaoCadastroData {
  nomeResponsavel: string;
  razaoSocial: string;
  motivoRejeicao: string;
}

export const emailRejeicaoCadastro = (data: RejeicaoCadastroData): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atualização de Solicitação - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                CRC Faróis
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Olá, ${data.nomeResponsavel}
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Informamos que, após análise, a solicitação de cadastro da empresa <strong>${
                  data.razaoSocial
                }</strong> não pôde ser aprovada neste momento.
              </p>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; margin: 25px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; color: #dc2626; font-size: 14px; font-weight: 600;">
                      Motivo:
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                      ${data.motivoRejeicao}
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Caso tenha dúvidas ou deseje mais informações, nossa equipe está à disposição:
              </p>
              
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 15px;">
                📧 Email: contato@crcfarois.ind.br
              </p>
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 15px;">
                📞 Telefone: (11) 99226-8645
              </p>
              
              <p style="margin: 30px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                Atenciosamente,<br>
                <span style="color: #3b82f6;">Equipe CRC Faróis</span>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
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
