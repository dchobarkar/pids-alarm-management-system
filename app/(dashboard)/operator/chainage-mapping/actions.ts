"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

export async function assignChainages(formData: FormData) {
  const userId = formData.get("userId") as string;
  const chainageIds = formData.getAll("chainageIds") as string[];

  if (!userId) return { error: "Select a user." };
  if (!chainageIds.length) return { error: "Select at least one chainage." };

  await prisma.chainageUser.createMany({
    data: chainageIds.map((chainageId) => ({ userId, chainageId })),
    skipDuplicates: true,
  });
  revalidatePath("/operator/chainage-mapping");
  return { success: true };
}

export async function removeMapping(chainageUserId: string) {
  if (!chainageUserId) return { error: "ID required." };
  await prisma.chainageUser.delete({ where: { id: chainageUserId } });
  revalidatePath("/operator/chainage-mapping");
  return { success: true };
}
