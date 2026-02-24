import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "operator@pids.local" },
    update: {},
    create: {
      name: "Operator User",
      email: "operator@pids.local",
      passwordHash: password,
      role: "OPERATOR",
      chainageStart: 0,
      chainageEnd: 100,
    },
  });

  await prisma.user.upsert({
    where: { email: "supervisor@pids.local" },
    update: {},
    create: {
      name: "Supervisor User",
      email: "supervisor@pids.local",
      passwordHash: password,
      role: "SUPERVISOR",
      chainageStart: 10,
      chainageEnd: 20,
    },
  });

  await prisma.user.upsert({
    where: { email: "rmp@pids.local" },
    update: {},
    create: {
      name: "RMP User",
      email: "rmp@pids.local",
      passwordHash: password,
      role: "RMP",
      chainageStart: 10,
      chainageEnd: 20,
    },
  });

  await prisma.user.upsert({
    where: { email: "er@pids.local" },
    update: {},
    create: {
      name: "ER User",
      email: "er@pids.local",
      passwordHash: password,
      role: "ER",
      chainageStart: 15,
      chainageEnd: 25,
    },
  });

  await prisma.user.upsert({
    where: { email: "qrvs@pids.local" },
    update: {},
    create: {
      name: "QRV Supervisor",
      email: "qrvs@pids.local",
      passwordHash: password,
      role: "QRV_SUPERVISOR",
      chainageStart: 0,
      chainageEnd: 100,
    },
  });

  console.log("Seed completed. Default users created:");
  console.log("- operator@pids.local / password123 (OPERATOR)");
  console.log("- supervisor@pids.local / password123 (SUPERVISOR, chainage 10-20)");
  console.log("- rmp@pids.local / password123 (RMP, chainage 10-20)");
  console.log("- er@pids.local / password123 (ER, chainage 15-25)");
  console.log("- qrvs@pids.local / password123 (QRV_SUPERVISOR)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
