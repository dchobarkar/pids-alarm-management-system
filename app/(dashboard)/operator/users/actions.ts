"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/constants/auth";
import {
  findUserByEmail,
  findUserById,
  findUserByEmailExcludingId,
  createUser,
  updateUser,
  deleteUser as deleteUserRepo,
} from "@/api/user/user-repository";
import { Role } from "@/lib/generated/prisma";

export const createUserAction = async (formData: FormData) => {
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

  const existing = await findUserByEmail(email);
  if (existing) return { error: "A user with this email already exists." };

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  await createUser({
    name,
    email,
    password: hashed,
    role,
    phone,
    supervisorId,
  });
  revalidatePath("/operator/users");
  return { success: true };
};

export const updateUserAction = async (formData: FormData) => {
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

  const existing = await findUserById(id);
  if (!existing) return { error: "User not found." };

  const emailConflict = await findUserByEmailExcludingId(email, id);
  if (emailConflict) return { error: "A user with this email already exists." };

  const password = newPassword && newPassword.length >= 8
    ? await bcrypt.hash(newPassword, SALT_ROUNDS)
    : undefined;

  await updateUser(id, {
    name,
    email,
    role,
    phone,
    supervisorId,
    password,
  });
  revalidatePath("/operator/users");
  return { success: true };
};

export const deleteUserAction = async (id: string) => {
  if (!id) return { error: "ID required." };
  await deleteUserRepo(id);
  revalidatePath("/operator/users");
  return { success: true };
};
