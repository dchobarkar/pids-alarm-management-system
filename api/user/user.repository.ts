import type { Role } from "@/lib/generated/prisma";
import { prisma } from "@/api/db";

/** Find user by email (e.g. for auth). Returns null if not found. */
export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

/** Find user by id. Returns null if not found. */
export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id } });

/** Find user profile fields (name, email, phone) for profile page. */
export const findUserProfileById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, phone: true },
  });

/** Find user by id with chainage mappings (for loadScopedAlarms). */
export const findUserByIdWithChainages = (id: string) =>
  prisma.user.findUniqueOrThrow({
    where: { id },
    include: { chainages: { select: { chainageId: true } } },
  });

/** List all users ordered by name, with optional supervisor relation. */
export const findUsers = (options?: { includeSupervisor?: boolean }) =>
  prisma.user.findMany({
    orderBy: { name: "asc" },
    include: options?.includeSupervisor
      ? { supervisor: { select: { id: true, name: true, email: true } } }
      : undefined,
  });

/** List users with only id, name, email, role (e.g. for chainage mapping dropdown). */
export const findUsersForSelect = () =>
  prisma.user.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true },
  });

/** List users with given roles (e.g. supervisors for dropdown). */
export const findUsersByRoles = (roles: Role[]) =>
  prisma.user.findMany({
    where: { role: { in: roles } },
    orderBy: { name: "asc" },
  });

/** List users by ids (e.g. RMPs in a chainage). Includes role for filtering. */
export const findUsersByIds = (ids: string[]) =>
  prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, supervisorId: true, role: true },
    orderBy: [{ supervisorId: "asc" }, { name: "asc" }],
  });

/** Check if email is taken by another user (for update). */
export const findUserByEmailExcludingId = (email: string, excludeId: string) =>
  prisma.user.findFirst({
    where: {
      email: email.trim().toLowerCase(),
      NOT: { id: excludeId },
    },
  });

/** Create a user. Caller must hash password. */
export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string | null;
  supervisorId?: string | null;
}) =>
  prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role,
      phone: data.phone?.trim() || null,
      supervisorId: data.supervisorId || null,
    },
  });

/** Update current user profile (name, phone). Used by profile form. */
export const updateUserProfile = (
  id: string,
  data: { name: string; phone: string | null },
) =>
  prisma.user.update({
    where: { id },
    data: { name: data.name.trim(), phone: data.phone?.trim() || null },
  });

/** Update user by id. Password optional. */
export const updateUser = (
  id: string,
  data: {
    name: string;
    email: string;
    role: Role;
    phone?: string | null;
    supervisorId?: string | null;
    password?: string;
  },
) =>
  prisma.user.update({
    where: { id },
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      phone: data.phone?.trim() || null,
      supervisorId: data.supervisorId || null,
      ...(data.password != null ? { password: data.password } : {}),
    },
  });

/** Delete user by id. */
export const deleteUser = (id: string) => prisma.user.delete({ where: { id } });
