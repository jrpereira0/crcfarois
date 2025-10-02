export interface EmailRecuperacaoSenhaParams {
  nomeUsuario: string;
  codigo: string;
}

export function emailRecuperacaoSenhaTemplate({
  nomeUsuario,
  codigo,
}: EmailRecuperacaoSenhaParams): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - CRC Faróis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    
                    <!-- Header com gradiente -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                🔒 Recuperação de Senha
                            </h1>
                            <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 16px;">
                                CRC Faróis - Plataforma B2B
                            </p>
                        </td>
                    </tr>

                    <!-- Saudação -->
                    <tr>
                        <td style="padding: 40px 30px 20px;">
                            <p style="margin: 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
                                Olá, <strong>${nomeUsuario}</strong>!
                            </p>
                        </td>
                    </tr>

                    <!-- Mensagem principal -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                                Recebemos uma solicitação para redefinir a senha da sua conta. 
                                Use o código abaixo para continuar:
                            </p>
                        </td>
                    </tr>

                    <!-- Código de verificação -->
                    <tr>
                        <td style="padding: 0 30px 30px;" align="center">
                            <table cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 30px; border: 2px dashed #3b82f6;">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 10px; color: #1e40af; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Seu Código de Verificação
                                        </p>
                                        <div style="font-size: 42px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${codigo}
                                        </div>
                                        <p style="margin: 15px 0 0; color: #6b7280; font-size: 13px;">
                                            ⏱️ Este código expira em <strong>15 minutos</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Instruções -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">
                                    ⚠️ Importante:
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <li>Não compartilhe este código com ninguém</li>
                                    <li>Nossa equipe nunca solicitará este código por telefone ou email</li>
                                    <li>O código é válido apenas para uma única redefinição</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Aviso de segurança -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                    <strong style="color: #374151;">Não solicitou esta recuperação?</strong><br>
                                    Se você não solicitou a redefinição de senha, ignore este email. 
                                    Sua senha permanecerá inalterada e segura.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 15px; color: #9ca3af; font-size: 14px; line-height: 1.6;">
                                <strong style="color: #ffffff; font-size: 16px;">CRC Faróis</strong><br>
                                Ilumine o seu caminho
                            </p>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                Este é um email automático, por favor não responda.<br>
                                Em caso de dúvidas, entre em contato com nosso suporte.
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
