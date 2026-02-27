"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/constants/auth";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const phone = (formData.get("phone") as string) || null;
  const supervisorId = (formData.get("supervisorId") as string) || null;

  if (!name?.trim() || !email?.trim() || !password || !role) {
    return { error: "Name, email, password and role are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.trim() },
  });
  if (existing) return { error: "A user with this email already exists." };

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role,
      phone: phone?.trim() || null,
      supervisorId: supervisorId || null,
    },
  });
  revalidatePath("/operator/users");
  return { success: true };
}

export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;
  const phone = (formData.get("phone") as string) || null;
  const supervisorId = (formData.get("supervisorId") as string) || null;
  const newPassword = formData.get("newPassword") as string | null;

  if (!id || !name?.trim() || !email?.trim() || !role) {
    return { error: "ID, name, email and role are required." };
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };

  const emailConflict = await prisma.user.findFirst({
    where: { email: email.trim().toLowerCase(), NOT: { id } },
  });
  if (emailConflict) return { error: "A user with this email already exists." };

  const data: Parameters<typeof prisma.user.update>[0]["data"] = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    phone: phone?.trim() || null,
    supervisorId: supervisorId || null,
  };
  if (newPassword && newPassword.length >= 8) {
    data.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  }

  await prisma.user.update({ where: { id }, data });
  revalidatePath("/operator/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  if (!id) return { error: "ID required." };
  await prisma.user.delete({ where: { id } });
  revalidatePath("/operator/users");
  return { success: true };
}
