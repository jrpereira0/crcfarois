const testClientData = {
  razaoSocial: "Empresa Teste LTDA",
  responsavel: "João Silva",
  cnpjCpf: "12.345.678/0001-24", // Formatado - diferente do já cadastrado
  tipoEmpresa: "Simples Nacional",
  condicoesPagamento: ["30 DDL", "Á VISTA"],
  cep: "01310-100", // Formatado
  endereco: "Avenida Paulista",
  numero: "1000",
  complemento: "Sala 101",
  bairro: "Bela Vista",
  cidade: "São Paulo",
  estado: "SP",
  email: "teste2@empresa.com", // Diferente do já cadastrado
  telefone: "(11) 3000-0000", // Formatado
  whatsapp: "(11) 99999-9999", // Formatado
  senha: "123456",
};

console.log("📋 Dados de teste para cliente:");
console.log(JSON.stringify(testClientData, null, 2));

console.log("\n🧪 Para testar manualmente:");
console.log("1. Acesse http://localhost:3000/dashboard/clientes/novo");
console.log("2. Preencha os campos com os dados acima");
console.log("3. Verifique o console do browser para logs de debug");
console.log("4. Se houver erro, verifique o terminal do servidor");

console.log("\n✅ Campos obrigatórios incluídos (COM FORMATAÇÃO):");
console.log("- Razão Social:", testClientData.razaoSocial);
console.log("- Responsável:", testClientData.responsavel);
console.log("- CNPJ/CPF:", testClientData.cnpjCpf, "(formatação automática)");
console.log("- CEP:", testClientData.cep, "(formatação automática)");
console.log("- Endereço:", testClientData.endereco);
console.log("- Número:", testClientData.numero);
console.log("- Email:", testClientData.email);
console.log("- Telefone:", testClientData.telefone, "(formatação automática)");
console.log("- WhatsApp:", testClientData.whatsapp, "(formatação automática)");
console.log("- Senha: [DEFINIDA]");

console.log("\n✨ NOVA FUNCIONALIDADE:");
console.log("- CNPJ/CPF se formata automaticamente enquanto digita");
console.log("- CEP se formata e busca endereço automaticamente");
console.log("- Telefone e WhatsApp se formatam automaticamente");
console.log("- Botão mostra progresso: Normal → Cadastrando → Sucesso!");

console.log("\n⚠️ IMPORTANTE:");
console.log("- Use email e CNPJ diferentes dos já cadastrados");
console.log("- Já existe: teste@empresa.com e 12345678000123");
console.log("- Use os dados acima que são diferentes");
