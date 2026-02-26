-- AlterTable: add password with temporary default for existing rows, then drop default
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'placeholder';
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;
