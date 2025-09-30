import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar usuário administrador principal
  const hashedPasswordAdmin = await bcrypt.hash("CRC@2024", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@crc.ind.br" },
    update: {
      password: hashedPasswordAdmin,
    },
    create: {
      email: "admin@crc.ind.br",
      name: "Administrador CRC",
      password: hashedPasswordAdmin,
      role: "ADMIN",
    },
  });

  console.log("✅ Usuário admin criado:", {
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  // Criar admin secundário (opcional)
  const hashedPasswordSecundario = await bcrypt.hash("admin123", 10);

  const adminSecundario = await prisma.user.upsert({
    where: { email: "admin@crcfarois.com" },
    update: {
      password: hashedPasswordSecundario,
    },
    create: {
      email: "admin@crcfarois.com",
      name: "Admin Secundário",
      password: hashedPasswordSecundario,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin secundário criado:", {
    email: adminSecundario.email,
    name: adminSecundario.name,
    role: adminSecundario.role,
  });

  console.log("\n📧 CREDENCIAIS DE ACESSO:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👤 Admin Principal:");
  console.log("   Email: admin@crc.ind.br");
  console.log("   Senha: CRC@2024");
  console.log("\n👤 Admin Secundário:");
  console.log("   Email: admin@crcfarois.com");
  console.log("   Senha: admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
