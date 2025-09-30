const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Verificando usuário admin...");

  const admin = await prisma.user.findUnique({
    where: { email: "admin@crcfarois.com" },
  });

  if (admin) {
    console.log("✅ Usuário admin encontrado:");
    console.log({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    });
  } else {
    console.log("❌ Usuário admin não encontrado!");
  }

  // Verificar todos os usuários
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("\n📋 Todos os usuários:");
  allUsers.forEach((user) => {
    console.log(`- ${user.email} (${user.role}) - ${user.name}`);
  });
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
