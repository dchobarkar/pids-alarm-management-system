import type { Role } from "@/lib/generated/prisma";

import bcrypt from "bcrypt";

import { MIN_PASSWORD_LENGTH, SALT_ROUNDS } from "@/constants/auth";
import { EMAIL_REGEX } from "@/constants/auth";
import {
  findUserByEmail,
  findUserById,
  createUser as createUserRepo,
  updateUser as updateUserRepo,
  deleteUser as deleteUserRepo,
} from "@/api/user/user.repository";

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string | null;
  supervisorId?: string | null;
};

export type UpdateUserInput = {
  name: string;
  role: Role;
  phone?: string | null;
  supervisorId?: string | null;
  newPassword?: string | null;
};

type Result = { success: true } | { success: false; error: string };

/** Create user: validate, check email unique, hash password, create. */
export const createUser = async (data: CreateUserInput): Promise<Result> => {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();

  if (!name || !email || !data.password || !data.role) {
    return {
      success: false,
      error: "Name, email, password and role are required.",
    };
  }
  if (data.password.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  const existing = await findUserByEmail(email);
  if (existing)
    return { success: false, error: "A user with this email already exists." };

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  await createUserRepo({
    name,
    email,
    password: hashed,
    role: data.role,
    phone: data.phone?.trim() || null,
    supervisorId: data.supervisorId || null,
  });
  return { success: true };
};

/** Update user (name, role, supervisor, phone; optional new password). Email is not changed. */
export const updateUser = async (
  userId: string,
  data: UpdateUserInput,
): Promise<Result> => {
  const existing = await findUserById(userId);
  if (!existing) return { success: false, error: "User not found." };

  const name = data.name?.trim();
  if (!name || !data.role) {
    return { success: false, error: "Name and role are required." };
  }

  const updateData: Parameters<typeof updateUserRepo>[1] = {
    name,
    email: existing.email,
    role: data.role,
    phone: data.phone?.trim() ?? null,
    supervisorId: data.supervisorId ?? null,
  };
  if (data.newPassword && data.newPassword.length >= MIN_PASSWORD_LENGTH) {
    updateData.password = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
  }
  await updateUserRepo(userId, updateData);
  return { success: true };
};

/** Change only the user's password. */
export const changePassword = async (
  userId: string,
  newPassword: string,
): Promise<Result> => {
  const existing = await findUserById(userId);
  if (!existing) return { success: false, error: "User not found." };
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUserRepo(userId, {
    name: existing.name,
    email: existing.email,
    role: existing.role,
    phone: existing.phone,
    supervisorId: existing.supervisorId,
    password: hashed,
  });
  return { success: true };
};

/** Delete user by id. Fails if user has related records (e.g. alarms, assignments). */
export const deleteUser = async (userId: string): Promise<Result> => {
  const existing = await findUserById(userId);
  if (!existing) return { success: false, error: "User not found." };
  try {
    await deleteUserRepo(userId);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete user.";
    return {
      success: false,
      error: message.includes("Foreign key")
        ? "Cannot delete user: they have related records (alarms, assignments, etc.). Remove or reassign those first."
        : message,
    };
  }
};
