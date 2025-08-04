// prisma/seed.ts
import { PrismaClient } from "@/generated/prisma"; // Use your output path
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (existingUser) {
    console.log("Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", user);
}

main()
  .catch((e) => console.error("❌ Error seeding:", e))
  .finally(() => prisma.$disconnect());
