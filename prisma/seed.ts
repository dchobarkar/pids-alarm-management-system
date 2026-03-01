import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

import { DEFAULT_PASSWORD, SALT_ROUNDS } from "../constants/auth";
import {
  SEED_USERS,
  SEED_CHAINAGES,
  SEED_CHAINAGE_USERS,
  SEED_ALARMS,
  SEED_ASSIGNMENTS,
  SEED_VERIFICATIONS,
  SEED_EVIDENCE,
} from "../constants/seed-data";
import {
  PrismaClient,
  Role,
  AlarmType,
  Criticality,
  AlarmStatus,
  AssignmentStatus,
} from "../lib/generated/prisma";

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
    const alarmId = alarmIds[a.alarmIndex];
    const rmpId = userIdByEmail[a.rmpEmail];
    const supervisorId = a.supervisorEmail
      ? userIdByEmail[a.supervisorEmail]
      : null;
    await prisma.alarmAssignment.create({
      data: {
        alarmId,
        rmpId,
        supervisorId,
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
