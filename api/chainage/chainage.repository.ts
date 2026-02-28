import { prisma } from "@/api/db";

/** Find chainage where startKm <= chainageValue <= endKm. Returns null if none. */
export const findChainageByValue = (chainageValue: number) =>
  prisma.chainage.findFirst({
    where: {
      startKm: { lte: chainageValue },
      endKm: { gte: chainageValue },
    },
  });

/** List all chainages ordered by startKm. */
export const findChainages = () =>
  prisma.chainage.findMany({
    orderBy: { startKm: "asc" },
  });

/** List chainages with their users (for mapping page). */
export const findChainagesWithUsers = () =>
  prisma.chainage.findMany({
    orderBy: { startKm: "asc" },
    include: {
      users: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

/** Create a chainage. */
export const createChainage = (data: {
  label: string;
  startKm: number;
  endKm: number;
  latitude?: number | null;
  longitude?: number | null;
}) =>
  prisma.chainage.create({
    data: {
      label: data.label.trim(),
      startKm: data.startKm,
      endKm: data.endKm,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    },
  });

/** Update chainage by id. */
export const updateChainage = (
  id: string,
  data: {
    label: string;
    startKm: number;
    endKm: number;
    latitude?: number | null;
    longitude?: number | null;
  },
) =>
  prisma.chainage.update({
    where: { id },
    data: {
      label: data.label.trim(),
      startKm: data.startKm,
      endKm: data.endKm,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
    },
  });

/** Delete chainage by id. */
export const deleteChainage = (id: string) =>
  prisma.chainage.delete({ where: { id } });
