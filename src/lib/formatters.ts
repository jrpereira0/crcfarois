// Funções de formatação para campos de entrada

export const formatCnpjCpf = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, "");

  // Aplica formatação baseada no tamanho
  if (cleanValue.length <= 11) {
    // CPF: 000.000.000-00
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ: 00.000.000/0000-00
    return cleanValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
};

export const formatCep = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  // CEP: 00000-000
  return cleanValue.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
};

export const formatTelefone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  } else {
    // Celular: (00) 00000-0000
    return cleanValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }
};

export const formatWhatsapp = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "");
  // WhatsApp sempre como celular: (00) 00000-0000
  return cleanValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

// Funções para remover formatação (para envio ao backend)
export const unformatValue = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Funções para formatação de exibição (a partir de dados do banco)
export const formatCnpjCpfDisplay = (value: string): string => {
  if (!value) return "";
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 11) {
    // CPF: 000.000.000-00
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cleanValue.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return cleanValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  return value;
};

export const formatCepDisplay = (value: string): string => {
  if (!value) return "";
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 8) {
    return cleanValue.replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  return value;
};

export const formatTelefoneDisplay = (value: string): string => {
  if (!value) return "";
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 10) {
    // Fixo: (00) 0000-0000
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (cleanValue.length === 11) {
    // Celular: (00) 00000-0000
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return value;
};

// Função para formatar número do WhatsApp com prefixo +55 do Brasil
export const formatWhatsAppUrl = (whatsappNumber: string): string => {
  if (!whatsappNumber) return "";

  // Remove todos os caracteres não numéricos
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  // Se já tem o prefixo 55, mantém
  if (cleanNumber.startsWith("55")) {
    return cleanNumber;
  }

  // Se não tem o prefixo, adiciona +55
  return `55${cleanNumber}`;
};
