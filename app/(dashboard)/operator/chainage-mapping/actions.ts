"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/api/db";

export async function removeMapping(chainageUserId: string) {
  if (!chainageUserId) return { error: "ID required." };
  await prisma.chainageUser.delete({ where: { id: chainageUserId } });
  revalidatePath("/operator/chainage-mapping");
  return { success: true };
}
