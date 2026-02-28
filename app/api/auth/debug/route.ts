import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/api/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );
  }

  const checks: Record<string, unknown> = {
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email: "operator@pids.com" },
    });
    checks.userExists = !!user;
    if (user?.password) {
      checks.passwordHashOk = await bcrypt.compare(
        "Password@123",
        user.password,
      );
    }
  } catch (e) {
    checks.dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(checks);
}
