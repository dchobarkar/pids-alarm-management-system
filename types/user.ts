import type { Prisma } from "@/lib/generated/prisma";

export type UserWithSupervisor = Prisma.UserGetPayload<{
  include: { supervisor: { select: { id: true; name: true; email: true } } };
}>;
