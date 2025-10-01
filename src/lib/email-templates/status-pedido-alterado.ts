interface EmailStatusPedidoAlteradoParams {
  nomeCliente: string;
  numeroPedido: string;
  statusAnterior: string;
  statusNovo: string;
  dataPedido: string;
  subtotal: string;
  frete: string;
  total: string;
  itens: Array<{
    titulo: string;
    quantidade: number;
    precoUnitario: string;
    subtotal: string;
  }>;
}

export function emailStatusPedidoAlterado(
  params: EmailStatusPedidoAlteradoParams
): string {
  const statusConfig: Record<
    string,
    { label: string; icon: string; message: string; color: string }
  > = {
    PENDENTE: {
      label: "Pendente",
      icon: "⏳",
      color: "#f59e0b",
      message:
        "Seu pedido está sendo analisado por nossa equipe e em breve será processado.",
    },
    CONFIRMADO: {
      label: "Confirmado",
      icon: "✅",
      color: "#3b82f6",
      message: "Seu pedido foi confirmado! Estamos preparando tudo para você.",
    },
    EM_SEPARACAO: {
      label: "Em Separação",
      icon: "📦",
      color: "#8b5cf6",
      message: "Estamos separando os produtos do seu pedido com todo cuidado.",
    },
    ENVIADO: {
      label: "Enviado",
      icon: "🚚",
      color: "#06b6d4",
      message:
        "Seu pedido foi enviado! Em breve você receberá mais informações sobre a entrega.",
    },
    PRONTO_RETIRADA: {
      label: "Pronto para Retirada",
      icon: "🏪",
      color: "#10b981",
      message: "Seu pedido está pronto! Você já pode retirá-lo em nossa loja.",
    },
    ENTREGUE: {
      label: "Entregue",
      icon: "🎉",
      color: "#059669",
      message:
        "Seu pedido foi entregue com sucesso! Obrigado por escolher a CRC Faróis.",
    },
    CANCELADO: {
      label: "Cancelado",
      icon: "❌",
      color: "#ef4444",
      message:
        "Seu pedido foi cancelado. Se tiver dúvidas, entre em contato conosco.",
    },
  };

  const status = statusConfig[params.statusNovo] || statusConfig.PENDENTE;
  const statusAnteriorInfo = statusConfig[params.statusAnterior] || {
    label: params.statusAnterior,
    icon: "•",
  };

  const itensHtml = params.itens
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">
        ${item.titulo}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantidade}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        R$ ${item.precoUnitario}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        R$ ${item.subtotal}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Atualização do Pedido</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">${
            status.icon
          } Status Atualizado!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Seu pedido foi atualizado</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Olá, <strong>${params.nomeCliente}</strong>!
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
            O status do seu pedido <strong>#${
              params.numeroPedido
            }</strong> foi atualizado.
          </p>

          <!-- Status Update -->
          <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <div style="margin-bottom: 15px;">
              <div style="display: inline-block; background-color: #e5e7eb; padding: 12px 20px; border-radius: 20px;">
                <span style="color: #6b7280; font-size: 14px;">${
                  statusAnteriorInfo.icon
                } ${statusAnteriorInfo.label}</span>
              </div>
            </div>
            <div style="margin: 15px 0;">
              <span style="color: #9ca3af; font-size: 24px;">↓</span>
            </div>
            <div style="margin-top: 15px;">
              <div style="display: inline-block; background-color: ${
                status.color
              }; padding: 12px 20px; border-radius: 20px;">
                <span style="color: #ffffff; font-weight: 700; font-size: 16px;">${
                  status.icon
                } ${status.label}</span>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-size: 15px; line-height: 1.6;">
              ${status.message}
            </p>
          </div>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">📋 Detalhes do Pedido</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #6b7280; font-size: 14px;">Número:</span>
              <span style="color: #1e40af; font-weight: 700;">#${
                params.numeroPedido
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280; font-size: 14px;">Data do Pedido:</span>
              <span style="color: #374151; font-weight: 600;">${
                params.dataPedido
              }</span>
            </div>
          </div>

          <!-- Produtos -->
          <h3 style="color: #374151; font-size: 18px; margin: 30px 0 15px 0;">📦 Itens do Pedido</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 14px; font-weight: 600;">Produto</th>
                <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 14px; font-weight: 600;">Qtd</th>
                <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">Preço</th>
                <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 14px; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itensHtml}
            </tbody>
          </table>

          <!-- Totais -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Subtotal:</span>
              <span style="color: #374151; font-weight: 600;">R$ ${
                params.subtotal
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Frete:</span>
              <span style="color: #374151; font-weight: 600;">R$ ${
                params.frete
              }</span>
            </div>
            <div style="height: 1px; background-color: #e5e7eb; margin: 12px 0;"></div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #1e40af; font-size: 18px; font-weight: 700;">Total:</span>
              <span style="color: #1e40af; font-size: 20px; font-weight: 700;">R$ ${
                params.total
              }</span>
            </div>
          </div>

          ${
            params.statusNovo === "PRONTO_RETIRADA"
              ? `
          <!-- Info Retirada -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
              📍 Endereço para Retirada:
            </p>
            <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
              CRC Faróis - Entre em contato para confirmar horário de retirada.
            </p>
          </div>
          `
              : ""
          }

          ${
            params.statusNovo === "CANCELADO"
              ? `
          <!-- Info Cancelamento -->
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
              Precisa de ajuda?
            </p>
            <p style="margin: 8px 0 0 0; color: #991b1b; font-size: 13px;">
              Se você não solicitou o cancelamento ou tem alguma dúvida, entre em contato conosco.
            </p>
          </div>
          `
              : ""
          }
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            Dúvidas? Entre em contato com nosso suporte
          </p>
          <p style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0;">
            CRC Faróis - Iluminando o seu caminho
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
