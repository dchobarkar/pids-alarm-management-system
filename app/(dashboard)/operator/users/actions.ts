"use server";

import { revalidatePath } from "next/cache";

import { Role } from "@/lib/generated/prisma";
import {
  createUser as createUserService,
  updateUser as updateUserService,
  changePassword as changePasswordService,
  deleteUser as deleteUserService,
} from "@/api/user/user.service";
import { requireRole } from "@/lib/auth/role-guard";
import { PATHS } from "@/constants/paths";

const revalidateUsers = () => {
  revalidatePath(PATHS.operatorUsers);
};

export const createUserAction = async (formData: FormData) => {
  await requireRole(Role.OPERATOR);

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const supervisorId = (formData.get("supervisorId") as string) || null;

  const result = await createUserService({
    name: name ?? "",
    email: email ?? "",
    password: password ?? "",
    role: role!,
    phone,
    supervisorId,
  });

  if (!result.success) return { error: result.error };
  revalidateUsers();

  return { success: true };
};

export const updateUserAction = async (formData: FormData) => {
  await requireRole(Role.OPERATOR);

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const role = formData.get("role") as Role;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const supervisorId = (formData.get("supervisorId") as string) || null;
  const newPassword = (formData.get("newPassword") as string) || null;

  const result = await updateUserService(id, {
    name: name ?? "",
    role: role!,
    phone,
    supervisorId,
    newPassword: newPassword && newPassword.length > 0 ? newPassword : null,
  });

  if (!result.success) return { error: result.error };
  revalidateUsers();
  revalidatePath(`${PATHS.operatorUsers}/${id}`);

  return { success: true };
};

export const changePasswordAction = async (
  userId: string,
  newPassword: string,
) => {
  await requireRole(Role.OPERATOR);

  const result = await changePasswordService(userId, newPassword);
  if (!result.success) return { error: result.error };
  revalidateUsers();
  revalidatePath(`${PATHS.operatorUsers}/${userId}`);

  return { success: true } as const;
};

export const deleteUserAction = async (id: string) => {
  await requireRole(Role.OPERATOR);

  const result = await deleteUserService(id);
  if (!result.success) return { error: result.error };
  revalidateUsers();

  return { success: true } as const;
};
