interface EmailNovoPedidoRepresentanteParams {
  nomeRepresentante: string;
  numeroPedido: string;
  dataPedido: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
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
}

export function emailNovoPedidoRepresentante(
  params: EmailNovoPedidoRepresentanteParams
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

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Pedido Registrado</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎯 Novo Pedido Registrado!</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Um de seus clientes fez um pedido</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Olá, <strong>${params.nomeRepresentante}</strong>!
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
            Um novo pedido foi registrado para um de seus clientes. Confira os detalhes abaixo:
          </p>

          <!-- Informações do Cliente -->
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 12px 0; color: #065f46; font-size: 16px;">👤 Cliente</h3>
            <p style="margin: 4px 0; color: #374151; font-weight: 600;">${
              params.clienteNome
            }</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📧 ${
              params.clienteEmail
            }</p>
            ${
              params.clienteTelefone
                ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📱 ${params.clienteTelefone}</p>`
                : ""
            }
          </div>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Número do Pedido:</span>
              <span style="color: #059669; font-weight: 700; font-size: 16px;">#${
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
              <span style="color: #059669; font-size: 18px; font-weight: 700;">Total:</span>
              <span style="color: #059669; font-size: 20px; font-weight: 700;">R$ ${
                params.total
              }</span>
            </div>
          </div>

          <!-- Ação -->
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
              Acesse o painel para visualizar todos os detalhes e gerenciar este pedido
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            CRC Faróis - Painel do Representante
          </p>
          <p style="color: #059669; font-size: 14px; font-weight: 600; margin: 0;">
            Continue acompanhando seus clientes e vendas!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
