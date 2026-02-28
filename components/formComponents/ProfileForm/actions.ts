"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { getSession } from "@/lib/auth/get-session";
import {
  findUserByIdWithSupervisor,
  updateUserProfile,
} from "@/api/user/user.repository";
import { changePassword } from "@/api/user/user.service";
import type { UserWithSupervisor } from "@/types/user";

/** Get current user's full profile (for profile page using session). */
export const getProfileForCurrentUser = async (): Promise<{
  user: UserWithSupervisor | null;
  error?: string;
}> => {
  const session = await getSession();
  if (!session?.user?.id) {
    return { user: null, error: "Not signed in." };
  }
  const user = await findUserByIdWithSupervisor(session.user.id);
  return { user };
};

/** Update current user's profile (name, phone only). */
export const updateProfile = async (
  formData: FormData,
): Promise<ActionResult> => {
  const session = await getSession();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be signed in to update your profile.",
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!name || name.length < 1) {
    return { success: false, error: "Name is required." };
  }

  await updateUserProfile(session.user.id, { name, phone });

  revalidatePath("/profile");
  return { success: true };
};

/** Change current user's password. */
export const changePasswordProfile = async (
  newPassword: string,
): Promise<ActionResult> => {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in." };
  }
  const result = await changePassword(session.user.id, newPassword);
  if (!result.success) return { success: false, error: result.error };
  revalidatePath("/profile");
  return { success: true };
};
