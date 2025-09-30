const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Corrigindo role do usuário admin...");

  const admin = await prisma.user.update({
    where: { email: "admin@crcfarois.com" },
    data: { role: "ADMIN" },
  });

  console.log("✅ Role do admin atualizado:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
