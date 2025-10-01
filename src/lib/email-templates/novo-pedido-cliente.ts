interface EmailNovoPedidoClienteParams {
  nomeCliente: string;
  numeroPedido: string;
  dataPedido: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: string;
  frete: string;
  total: string;
  itens: Array<{
    titulo: string;
    quantidade: number;
    precoUnitario: string;
    subtotal: string;
  }>;
  enderecoEntrega?: {
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export function emailNovoPedidoCliente(
  params: EmailNovoPedidoClienteParams
): string {
  const formatarFormaPagamento = (forma: string) => {
    const formas: Record<string, string> = {
      DINHEIRO: "Dinheiro",
      PIX: "PIX",
      CARTAO_CREDITO: "Cartão de Crédito",
      CARTAO_DEBITO: "Cartão de Débito",
      BOLETO: "Boleto",
      TRANSFERENCIA: "Transferência",
    };
    return formas[forma] || forma;
  };

  const formatarTipoEntrega = (tipo: string) => {
    return tipo === "RETIRADA" ? "Retirada na Loja" : "Entrega no Endereço";
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

  const enderecoHtml = params.enderecoEntrega
    ? `
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px;">📍 Endereço de Entrega</h3>
      <p style="margin: 4px 0; color: #6b7280;">
        ${params.enderecoEntrega.endereco}, ${params.enderecoEntrega.numero}
        ${
          params.enderecoEntrega.complemento
            ? ` - ${params.enderecoEntrega.complemento}`
            : ""
        }
      </p>
      <p style="margin: 4px 0; color: #6b7280;">
        ${params.enderecoEntrega.bairro} - ${params.enderecoEntrega.cidade}/${
        params.enderecoEntrega.estado
      }
      </p>
      <p style="margin: 4px 0; color: #6b7280;">
        CEP: ${params.enderecoEntrega.cep}
      </p>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido Confirmado</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Pedido Confirmado!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Recebemos seu pedido com sucesso</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Olá, <strong>${params.nomeCliente}</strong>!
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
            Seu pedido foi confirmado e já está sendo processado. Abaixo estão os detalhes:
          </p>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Número do Pedido:</span>
              <span style="color: #1e40af; font-weight: 700; font-size: 16px;">#${
                params.numeroPedido
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Data:</span>
              <span style="color: #374151; font-weight: 600;">${
                params.dataPedido
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Tipo de Entrega:</span>
              <span style="color: #374151; font-weight: 600;">${formatarTipoEntrega(
                params.tipoEntrega
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Forma de Pagamento:</span>
              <span style="color: #374151; font-weight: 600;">${formatarFormaPagamento(
                params.formaPagamento
              )}</span>
            </div>
            ${
              params.condicaoPagamento
                ? `
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280; font-size: 14px;">Condição:</span>
              <span style="color: #374151; font-weight: 600;">${params.condicaoPagamento}</span>
            </div>
            `
                : ""
            }
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

          ${enderecoHtml}

          <!-- Status -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 30px; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏳ <strong>Status Atual:</strong> Pedido em análise
            </p>
            <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
              Você receberá atualizações sobre o status do seu pedido por email.
            </p>
          </div>
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
