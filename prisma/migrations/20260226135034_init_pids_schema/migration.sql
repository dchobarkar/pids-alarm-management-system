-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OPERATOR', 'SUPERVISOR', 'NIGHT_SUPERVISOR', 'RMP', 'ER', 'QRV_SUPERVISOR');

-- CreateEnum
CREATE TYPE "AlarmType" AS ENUM ('VIBRATION', 'DIGGING', 'INTRUSION', 'TAMPERING', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Criticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlarmStatus" AS ENUM ('CREATED', 'UNASSIGNED', 'ASSIGNED', 'IN_PROGRESS', 'VERIFIED', 'FALSE_ALARM', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL,
    "supervisorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chainage" (
    "id" TEXT NOT NULL,
    "startKm" DOUBLE PRECISION NOT NULL,
    "endKm" DOUBLE PRECISION NOT NULL,
    "label" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chainage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainageUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chainageId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChainageUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "chainageValue" DOUBLE PRECISION NOT NULL,
    "chainageId" TEXT NOT NULL,
    "alarmType" "AlarmType" NOT NULL,
    "criticality" "Criticality" NOT NULL,
    "incidentTime" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "status" "AlarmStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlarmAssignment" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "rmpId" TEXT NOT NULL,
    "supervisorId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "AlarmAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "verifiedById" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlarmLog" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlarmLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ChainageUser_userId_idx" ON "ChainageUser"("userId");

-- CreateIndex
CREATE INDEX "ChainageUser_chainageId_idx" ON "ChainageUser"("chainageId");

-- CreateIndex
CREATE UNIQUE INDEX "ChainageUser_userId_chainageId_key" ON "ChainageUser"("userId", "chainageId");

-- CreateIndex
CREATE INDEX "Alarm_chainageId_idx" ON "Alarm"("chainageId");

-- CreateIndex
CREATE INDEX "Alarm_status_idx" ON "Alarm"("status");

-- CreateIndex
CREATE INDEX "Alarm_createdById_idx" ON "Alarm"("createdById");

-- CreateIndex
CREATE INDEX "AlarmAssignment_alarmId_idx" ON "AlarmAssignment"("alarmId");

-- CreateIndex
CREATE INDEX "AlarmAssignment_rmpId_idx" ON "AlarmAssignment"("rmpId");

-- CreateIndex
CREATE INDEX "Verification_alarmId_idx" ON "Verification"("alarmId");

-- CreateIndex
CREATE INDEX "Evidence_alarmId_idx" ON "Evidence"("alarmId");

-- CreateIndex
CREATE INDEX "AlarmLog_alarmId_idx" ON "AlarmLog"("alarmId");

-- CreateIndex
CREATE INDEX "AlarmLog_actorId_idx" ON "AlarmLog"("actorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainageUser" ADD CONSTRAINT "ChainageUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChainageUser" ADD CONSTRAINT "ChainageUser_chainageId_fkey" FOREIGN KEY ("chainageId") REFERENCES "Chainage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_chainageId_fkey" FOREIGN KEY ("chainageId") REFERENCES "Chainage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmAssignment" ADD CONSTRAINT "AlarmAssignment_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmAssignment" ADD CONSTRAINT "AlarmAssignment_rmpId_fkey" FOREIGN KEY ("rmpId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmAssignment" ADD CONSTRAINT "AlarmAssignment_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmLog" ADD CONSTRAINT "AlarmLog_alarmId_fkey" FOREIGN KEY ("alarmId") REFERENCES "Alarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmLog" ADD CONSTRAINT "AlarmLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
