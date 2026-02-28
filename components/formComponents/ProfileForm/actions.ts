"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/db";

/**
 * Update current user's profile (name, phone). Email is read-only.
 */
export async function updateProfile(formData: FormData): Promise<ActionResult> {
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

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone },
  });

  revalidatePath("/profile");
  return { success: true };
}
