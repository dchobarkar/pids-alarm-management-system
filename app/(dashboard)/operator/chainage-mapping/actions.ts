"use server";

import { revalidatePath } from "next/cache";

import { deleteChainageUser } from "@/api/chainage-user/chainage-user.repository";

export const removeMapping = async (chainageUserId: string) => {
  if (!chainageUserId) return { error: "ID required." };
  await deleteChainageUser(chainageUserId);
  revalidatePath("/operator/chainage-mapping");
  return { success: true };
};
