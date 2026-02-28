"use server";

import { revalidatePath } from "next/cache";

import { createChainageUsers } from "@/api/chainage-user/chainage-user.repository";

export const assignChainages = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const chainageIds = formData.getAll("chainageIds") as string[];

  if (!userId) return { error: "Select a user." };
  if (!chainageIds.length) return { error: "Select at least one chainage." };

  await createChainageUsers(
    chainageIds.map((chainageId) => ({ userId, chainageId })),
  );
  revalidatePath("/operator/chainage-mapping");
  return { success: true };
};

