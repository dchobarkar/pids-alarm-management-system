"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { canManageUsers } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { Decimal } from "@prisma/client/runtime/library";
import type { Role } from "@prisma/client";

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !canManageUsers(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const chainageStart = parseFloat(formData.get("chainageStart") as string);
  const chainageEnd = parseFloat(formData.get("chainageEnd") as string);

  if (!name || !email || !password || !role) {
    return { error: "Missing required fields" };
  }

  const validRoles: Role[] = [
    "OPERATOR",
    "SUPERVISOR",
    "NIGHT_SUPERVISOR",
    "RMP",
    "ER",
    "QRV_SUPERVISOR",
  ];
  if (!validRoles.includes(role)) {
    return { error: "Invalid role" };
  }

  if (isNaN(chainageStart) || isNaN(chainageEnd) || chainageStart > chainageEnd) {
    return { error: "Invalid chainage range" };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) {
    return { error: "Email already in use" };
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      chainageStart: new Decimal(chainageStart),
      chainageEnd: new Decimal(chainageEnd),
    },
  });

  await createAuditLog("USER_CREATED", "User", user.id, session.user.id, {
    email: user.email,
    role: user.role,
  });

  revalidatePath("/users");
  return { success: true, userId: user.id };
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !canManageUsers(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const role = formData.get("role") as Role;
  const chainageStart = parseFloat(formData.get("chainageStart") as string);
  const chainageEnd = parseFloat(formData.get("chainageEnd") as string);
  const password = formData.get("password") as string;

  const validRoles: Role[] = [
    "OPERATOR",
    "SUPERVISOR",
    "NIGHT_SUPERVISOR",
    "RMP",
    "ER",
    "QRV_SUPERVISOR",
  ];
  if (!validRoles.includes(role)) {
    return { error: "Invalid role" };
  }

  if (isNaN(chainageStart) || isNaN(chainageEnd) || chainageStart > chainageEnd) {
    return { error: "Invalid chainage range" };
  }

  const updateData: Parameters<typeof prisma.user.update>[0]["data"] = {
    name,
    role,
    chainageStart: new Decimal(chainageStart),
    chainageEnd: new Decimal(chainageEnd),
  };

  if (password && password.length >= 8) {
    updateData.passwordHash = await hash(password, 12);
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  await createAuditLog("USER_UPDATED", "User", userId, session.user.id);

  revalidatePath("/users");
  return { success: true };
}
