import type { Prisma } from "@/lib/generated/prisma";

/** User with supervisor relation (id, name, email). Used for assignee/supervisor context. */
export type UserWithSupervisor = Prisma.UserGetPayload<{
  include: { supervisor: { select: { id: true; name: true; email: true } } };
}>;

/** User with chainage mappings (chainageId only). Used for role-based alarm scoping (e.g. Supervisor/RMP). */
export type UserWithChainages = Prisma.UserGetPayload<{
  include: { chainages: { select: { chainageId: true } } };
}>;
