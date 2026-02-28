"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/api/db";

export async function createChainage(formData: FormData) {
  const label = formData.get("label") as string;
  const startKm = Number(formData.get("startKm"));
  const endKm = Number(formData.get("endKm"));
  const latitude = formData.get("latitude")
    ? Number(formData.get("latitude"))
    : null;
  const longitude = formData.get("longitude")
    ? Number(formData.get("longitude"))
    : null;

  if (!label?.trim()) return { error: "Label is required." };
  if (Number.isNaN(startKm) || Number.isNaN(endKm))
    return { error: "Start KM and End KM must be numbers." };
  if (startKm >= endKm) return { error: "Start KM must be less than End KM." };

  await prisma.chainage.create({
    data: {
      label: label.trim(),
      startKm,
      endKm,
      latitude,
      longitude,
    },
  });
  revalidatePath("/operator/chainages");
  return { success: true };
}

export async function updateChainage(formData: FormData) {
  const id = formData.get("id") as string;
  const label = formData.get("label") as string;
  const startKm = Number(formData.get("startKm"));
  const endKm = Number(formData.get("endKm"));
  const latitude = formData.get("latitude")
    ? Number(formData.get("latitude"))
    : null;
  const longitude = formData.get("longitude")
    ? Number(formData.get("longitude"))
    : null;

  if (!id || !label?.trim()) return { error: "ID and label are required." };
  if (Number.isNaN(startKm) || Number.isNaN(endKm))
    return { error: "Start KM and End KM must be numbers." };
  if (startKm >= endKm) return { error: "Start KM must be less than End KM." };

  await prisma.chainage.update({
    where: { id },
    data: { label: label.trim(), startKm, endKm, latitude, longitude },
  });
  revalidatePath("/operator/chainages");
  return { success: true };
}

export async function deleteChainage(id: string) {
  if (!id) return { error: "ID required." };
  await prisma.chainage.delete({ where: { id } });
  revalidatePath("/operator/chainages");
  return { success: true };
}
