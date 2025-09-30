const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function testCreateClient() {
  console.log("🧪 Testando criação de cliente diretamente no banco...");

  try {
    const hashedPassword = await bcrypt.hash("123456", 12);

    const result = await prisma.$transaction(async (tx) => {
      // Criar usuário
      const user = await tx.user.create({
        data: {
          name: "Empresa Teste LTDA",
          email: "teste@empresa.com",
          password: hashedPassword,
          role: "CLIENTE",
        },
      });

      console.log("✅ Usuário criado:", user.id);

      // Criar cliente
      const cliente = await tx.cliente.create({
        data: {
          userId: user.id,
          razaoSocial: "Empresa Teste LTDA",
          responsavel: "João Silva",
          cnpjCpf: "12345678000123",
          tipoEmpresa: "Simples Nacional",
          condicoesPagamento: ["30 DDL", "Á VISTA"],
          cep: "01310100",
          endereco: "Avenida Paulista",
          numero: "1000",
          complemento: "Sala 101",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          email: "teste@empresa.com",
          telefone: "(11) 3000-0000",
          whatsapp: "(11) 99999-9999",
        },
      });

      console.log("✅ Cliente criado:", cliente.id);
      return { user, cliente };
    });

    console.log("🎉 Sucesso! Cliente e usuário criados:");
    console.log("- User ID:", result.user.id);
    console.log("- Cliente ID:", result.cliente.id);
    console.log("- Email:", result.user.email);
    console.log("- Role:", result.user.role);
  } catch (error) {
    console.error("❌ Erro ao criar cliente:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateClient();
