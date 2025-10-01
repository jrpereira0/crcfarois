interface EmailNovoPedidoAdminParams {
  numeroPedido: string;
  dataPedido: string;
  clienteNome: string;
  clienteEmail: string;
  representanteNome?: string;
  tipoEntrega: string;
  formaPagamento: string;
  condicaoPagamento?: string;
  subtotal: string;
  frete: string;
  total: string;
  quantidadeItens: number;
}

export function emailNovoPedidoAdmin(
  params: EmailNovoPedidoAdminParams
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

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Pedido - Admin</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔔 Novo Pedido Recebido</h1>
          <p style="color: #ede9fe; margin: 10px 0 0 0; font-size: 16px;">Administração - CRC Faróis</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Um novo pedido foi registrado no sistema e aguarda processamento.
          </p>

          <!-- Quick Info -->
          <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="color: #6b7280; font-size: 14px;">Pedido:</span>
              <span style="color: #7c3aed; font-weight: 700; font-size: 18px;">#${
                params.numeroPedido
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280; font-size: 14px;">Valor Total:</span>
              <span style="color: #059669; font-weight: 700; font-size: 18px;">R$ ${
                params.total
              }</span>
            </div>
          </div>

          <!-- Detalhes do Cliente -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">👤 Informações do Cliente</h3>
            <div style="margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Nome:</span>
              <span style="color: #374151; font-weight: 600; margin-left: 8px;">${
                params.clienteNome
              }</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Email:</span>
              <span style="color: #374151; margin-left: 8px;">${
                params.clienteEmail
              }</span>
            </div>
            ${
              params.representanteNome
                ? `
            <div>
              <span style="color: #6b7280; font-size: 14px;">Representante:</span>
              <span style="color: #374151; font-weight: 600; margin-left: 8px;">${params.representanteNome}</span>
            </div>
            `
                : ""
            }
          </div>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">📋 Detalhes do Pedido</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Data:</span>
              <span style="color: #374151; font-weight: 600;">${
                params.dataPedido
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Quantidade de Itens:</span>
              <span style="color: #374151; font-weight: 600;">${
                params.quantidadeItens
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #6b7280; font-size: 14px;">Tipo de Entrega:</span>
              <span style="color: #374151; font-weight: 600;">${formatarTipoEntrega(
                params.tipoEntrega
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
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

          <!-- Resumo Financeiro -->
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #059669;">
            <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 16px;">💰 Resumo Financeiro</h3>
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
            <div style="height: 1px; background-color: #d1fae5; margin: 12px 0;"></div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #065f46; font-size: 16px; font-weight: 700;">Total:</span>
              <span style="color: #059669; font-size: 18px; font-weight: 700;">R$ ${
                params.total
              }</span>
            </div>
          </div>

          <!-- Alert -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-top: 20px; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⚠️ <strong>Ação Necessária:</strong> Este pedido está aguardando análise e processamento.
            </p>
            <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
              Acesse o painel administrativo para gerenciar este pedido.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            CRC Faróis - Painel Administrativo
          </p>
          <p style="color: #7c3aed; font-size: 14px; font-weight: 600; margin: 0;">
            Sistema de Gestão de Pedidos
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
