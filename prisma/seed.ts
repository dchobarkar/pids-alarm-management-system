import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  Role,
  AlarmType,
  Criticality,
  AlarmStatus,
  AssignmentStatus,
} from "../lib/generated/prisma";

const DEFAULT_PASSWORD = "Password@123";
const SALT_ROUNDS = 10;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding PIDS database...");

  // --------------------------------------------------
  // CLEANUP (idempotent: clear seed data so re-run works)
  // --------------------------------------------------
  await prisma.alarmLog.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.alarmAssignment.deleteMany({});
  await prisma.alarm.deleteMany({});
  await prisma.chainageUser.deleteMany({});
  await prisma.chainage.deleteMany({});
  await prisma.user.deleteMany({});

  // --------------------------------------------------
  // USERS
  // --------------------------------------------------

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const operator = await prisma.user.create({
    data: {
      name: "PIDS Operator",
      email: "operator@pids.com",
      password: hashedPassword,
      role: Role.OPERATOR,
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      name: "Supervisor 1",
      email: "supervisor1@pids.com",
      password: hashedPassword,
      role: Role.SUPERVISOR,
    },
  });

  const rmp1 = await prisma.user.create({
    data: {
      name: "RMP Alpha",
      email: "rmp1@pids.com",
      password: hashedPassword,
      role: Role.RMP,
      supervisorId: supervisor.id,
    },
  });

  const rmp2 = await prisma.user.create({
    data: {
      name: "RMP Beta",
      email: "rmp2@pids.com",
      password: hashedPassword,
      role: Role.RMP,
      supervisorId: supervisor.id,
    },
  });

  const er = await prisma.user.create({
    data: {
      name: "Emergency Responder",
      email: "er@pids.com",
      password: hashedPassword,
      role: Role.ER,
      supervisorId: supervisor.id,
    },
  });

  // --------------------------------------------------
  // CHAINAGES
  // --------------------------------------------------

  const chainage1 = await prisma.chainage.create({
    data: {
      label: "0-10",
      startKm: 0,
      endKm: 10,
      latitude: 19.076,
      longitude: 72.8777,
    },
  });

  const chainage2 = await prisma.chainage.create({
    data: {
      label: "11-20",
      startKm: 11,
      endKm: 20,
      latitude: 19.2183,
      longitude: 72.9781,
    },
  });

  // Map users to chainages

  await prisma.chainageUser.createMany({
    data: [
      { userId: supervisor.id, chainageId: chainage1.id },
      { userId: rmp1.id, chainageId: chainage1.id },
      { userId: rmp2.id, chainageId: chainage1.id },
      { userId: er.id, chainageId: chainage2.id },
    ],
  });

  // --------------------------------------------------
  // ALARMS
  // --------------------------------------------------

  const alarm1 = await prisma.alarm.create({
    data: {
      latitude: 19.08,
      longitude: 72.88,
      chainageValue: 5.234,
      chainageId: chainage1.id,
      alarmType: AlarmType.VIBRATION,
      criticality: Criticality.HIGH,
      incidentTime: new Date(),
      createdById: operator.id,
      status: AlarmStatus.ASSIGNED,
    },
  });

  const alarm2 = await prisma.alarm.create({
    data: {
      latitude: 19.09,
      longitude: 72.89,
      chainageValue: 7.891,
      chainageId: chainage1.id,
      alarmType: AlarmType.DIGGING,
      criticality: Criticality.CRITICAL,
      incidentTime: new Date(),
      createdById: operator.id,
      status: AlarmStatus.VERIFIED,
    },
  });

  // --------------------------------------------------
  // ASSIGNMENTS
  // --------------------------------------------------

  await prisma.alarmAssignment.create({
    data: {
      alarmId: alarm1.id,
      rmpId: rmp1.id,
      supervisorId: supervisor.id,
      status: AssignmentStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
  });

  await prisma.alarmAssignment.create({
    data: {
      alarmId: alarm2.id,
      rmpId: rmp2.id,
      supervisorId: supervisor.id,
      status: AssignmentStatus.COMPLETED,
      acceptedAt: new Date(),
      completedAt: new Date(),
    },
  });

  // --------------------------------------------------
  // VERIFICATIONS
  // --------------------------------------------------

  await prisma.verification.create({
    data: {
      alarmId: alarm2.id,
      verifiedById: rmp2.id,
      latitude: 19.0905,
      longitude: 72.8902,
      distance: 35, // meters
      remarks: "Digging activity confirmed near pipeline",
    },
  });

  // --------------------------------------------------
  // EVIDENCE
  // --------------------------------------------------

  await prisma.evidence.create({
    data: {
      alarmId: alarm2.id,
      uploadedById: rmp2.id,
      fileUrl: "/uploads/alarms/alarm2/photo1.jpg",
      fileType: "image",
    },
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
