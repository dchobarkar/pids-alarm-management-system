import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
  Role,
  AlarmType,
  Criticality,
  AlarmStatus,
  AssignmentStatus,
} from "../lib/generated/prisma";

// -----------------------------------------------------------------------------
// Inline constants (no imports from project files so seed can be copied to deploy)
// -----------------------------------------------------------------------------
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "Password@123";

const SEED_USERS = [
  {
    name: "PIDS Operator",
    email: "operator@pids.com",
    role: "OPERATOR" as const,
  },
  {
    name: "Supervisor 1",
    email: "supervisor1@pids.com",
    role: "SUPERVISOR" as const,
  },
  {
    name: "RMP Alpha",
    email: "rmp1@pids.com",
    role: "RMP" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
  {
    name: "RMP Beta",
    email: "rmp2@pids.com",
    role: "RMP" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
  {
    name: "Emergency Responder",
    email: "er@pids.com",
    role: "ER" as const,
    supervisorEmail: "supervisor1@pids.com",
  },
];

const SEED_CHAINAGES = [
  {
    label: "0-10",
    startKm: 0,
    endKm: 10,
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    label: "11-20",
    startKm: 11,
    endKm: 20,
    latitude: 19.2183,
    longitude: 72.9781,
  },
];

const SEED_CHAINAGE_USERS = [
  { userEmail: "supervisor1@pids.com", chainageLabel: "0-10" },
  { userEmail: "rmp1@pids.com", chainageLabel: "0-10" },
  { userEmail: "rmp2@pids.com", chainageLabel: "0-10" },
  { userEmail: "er@pids.com", chainageLabel: "11-20" },
];

const SEED_ALARMS = [
  {
    latitude: 19.08,
    longitude: 72.88,
    chainageValue: 5.234,
    chainageLabel: "0-10",
    alarmType: "VIBRATION" as const,
    criticality: "HIGH" as const,
    status: "ASSIGNED" as const,
    createdByEmail: "operator@pids.com",
  },
  {
    latitude: 19.09,
    longitude: 72.89,
    chainageValue: 7.891,
    chainageLabel: "0-10",
    alarmType: "DIGGING" as const,
    criticality: "CRITICAL" as const,
    status: "VERIFIED" as const,
    createdByEmail: "operator@pids.com",
  },
];

const SEED_ASSIGNMENTS = [
  {
    alarmIndex: 0,
    rmpEmail: "rmp1@pids.com",
    supervisorEmail: "supervisor1@pids.com",
    status: "ACCEPTED" as const,
    acceptedAt: true,
    completedAt: false,
  },
  {
    alarmIndex: 1,
    rmpEmail: "rmp2@pids.com",
    supervisorEmail: "supervisor1@pids.com",
    status: "COMPLETED" as const,
    acceptedAt: true,
    completedAt: true,
  },
];

const SEED_VERIFICATIONS = [
  {
    alarmIndex: 1,
    verifiedByEmail: "rmp2@pids.com",
    latitude: 19.0905,
    longitude: 72.8902,
    distance: 35,
    remarks: "Digging activity confirmed near pipeline",
    geoMismatch: false,
  },
];

const SEED_EVIDENCE = [
  {
    alarmIndex: 1,
    uploadedByEmail: "rmp2@pids.com",
    fileUrl: "/uploads/alarms/alarm2/photo1.jpg",
    fileType: "image",
  },
];

// -----------------------------------------------------------------------------
// DB connection and seed
// -----------------------------------------------------------------------------
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seed. Set it in .env");
}

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
  const userIdByEmail: Record<string, string> = {};
  for (const u of SEED_USERS) {
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role as Role,
        supervisorId: u.supervisorEmail
          ? (userIdByEmail[u.supervisorEmail] ?? null)
          : null,
      },
    });
    userIdByEmail[u.email] = created.id;
  }

  // --------------------------------------------------
  // CHAINAGES
  // --------------------------------------------------
  const chainageIdByLabel: Record<string, string> = {};
  for (const c of SEED_CHAINAGES) {
    const created = await prisma.chainage.create({
      data: {
        label: c.label,
        startKm: c.startKm,
        endKm: c.endKm,
        latitude: c.latitude,
        longitude: c.longitude,
      },
    });
    chainageIdByLabel[c.label] = created.id;
  }

  // Map users to chainages
  await prisma.chainageUser.createMany({
    data: SEED_CHAINAGE_USERS.map((m) => ({
      userId: userIdByEmail[m.userEmail],
      chainageId: chainageIdByLabel[m.chainageLabel],
    })),
  });

  // --------------------------------------------------
  // ALARMS
  // --------------------------------------------------
  const alarmIds: string[] = [];
  for (const a of SEED_ALARMS) {
    const created = await prisma.alarm.create({
      data: {
        latitude: a.latitude,
        longitude: a.longitude,
        chainageValue: a.chainageValue,
        chainageId: chainageIdByLabel[a.chainageLabel],
        alarmType: a.alarmType as AlarmType,
        criticality: a.criticality as Criticality,
        incidentTime: new Date(),
        createdById: userIdByEmail[a.createdByEmail],
        status: a.status as AlarmStatus,
      },
    });
    alarmIds.push(created.id);
  }

  // --------------------------------------------------
  // ASSIGNMENTS
  // --------------------------------------------------
  for (const a of SEED_ASSIGNMENTS) {
    await prisma.alarmAssignment.create({
      data: {
        alarmId: alarmIds[a.alarmIndex],
        rmpId: userIdByEmail[a.rmpEmail],
        supervisorId: a.supervisorEmail
          ? userIdByEmail[a.supervisorEmail]
          : null,
        status: a.status as AssignmentStatus,
        acceptedAt: a.acceptedAt ? new Date() : null,
        completedAt: a.completedAt ? new Date() : null,
      },
    });
  }

  // --------------------------------------------------
  // VERIFICATIONS
  // --------------------------------------------------
  for (const v of SEED_VERIFICATIONS) {
    await prisma.verification.create({
      data: {
        alarmId: alarmIds[v.alarmIndex],
        verifiedById: userIdByEmail[v.verifiedByEmail],
        latitude: v.latitude,
        longitude: v.longitude,
        distance: v.distance,
        remarks: v.remarks ?? null,
        geoMismatch: v.geoMismatch ?? false,
      },
    });
  }

  // --------------------------------------------------
  // EVIDENCE
  // --------------------------------------------------
  for (const e of SEED_EVIDENCE) {
    await prisma.evidence.create({
      data: {
        alarmId: alarmIds[e.alarmIndex],
        uploadedById: userIdByEmail[e.uploadedByEmail],
        fileUrl: e.fileUrl,
        fileType: e.fileType,
      },
    });
  }

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
