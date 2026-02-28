"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { getSession } from "@/lib/auth/get-session";
import { updateUserProfile } from "@/api/user/user-repository";

/** Update current user's profile (name, phone). Email is read-only. */
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
