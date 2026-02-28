import { prisma } from "@/api/db";

/** List chainage-user rows for a chainage (e.g. RMPs in alarm's chainage). */
export const findChainageUsersByChainageId = (chainageId: string) =>
  prisma.chainageUser.findMany({
    where: { chainageId },
    select: { userId: true },
  });

/** Find one chainage-user by userId and chainageId (e.g. is RMP in this chainage?). */
export const findChainageUserByUserAndChainage = (
  userId: string,
  chainageId: string,
) =>
  prisma.chainageUser.findFirst({
    where: { chainageId, userId },
  });

/** List all chainage-user mappings with user and chainage details (for mapping page). */
export const findChainageUsersWithDetails = () =>
  prisma.chainageUser.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      chainage: {
        select: { id: true, label: true, startKm: true, endKm: true },
      },
    },
  });

/** Create multiple user–chainage mappings. */
export const createChainageUsers = (
  data: { userId: string; chainageId: string }[],
) =>
  prisma.chainageUser.createMany({
    data,
    skipDuplicates: true,
  });

/** Delete one chainage-user mapping by id. */
export const deleteChainageUser = (id: string) =>
  prisma.chainageUser.delete({ where: { id } });
