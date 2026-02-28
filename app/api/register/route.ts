import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/constants/auth";
import { findUserByEmail, createUser } from "@/api/user/user-repository";
import { Role } from "@/lib/generated/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as
      | { name?: string; email?: string; password?: string }
      | null;

    const name = body?.name?.trim() ?? "";
    const email = body?.email?.trim().toLowerCase() ?? "";
    const password = body?.password ?? "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    await createUser({
      name,
      email,
      password: hashed,
      role: Role.OPERATOR,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[register] Failed to register user", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}

