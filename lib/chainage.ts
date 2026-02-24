import { prisma } from "./db";
import type { Role } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Get users who can see an alarm based on chainage routing logic.
 * When Operator creates an alarm:
 * 1. Read alarm.chainage
 * 2. Fetch users where chainageStart <= alarm.chainage <= chainageEnd
 * 3. Filter roles: RMP, ER, Supervisor, Night Supervisor
 */
export async function getUsersForChainage(chainage: number) {
  const chainageDecimal = new Decimal(chainage);

  const users = await prisma.user.findMany({
    where: {
      chainageStart: { lte: chainageDecimal },
      chainageEnd: { gte: chainageDecimal },
      role: {
        in: ["RMP", "ER", "SUPERVISOR", "NIGHT_SUPERVISOR"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      chainageStart: true,
      chainageEnd: true,
    },
  });

  return users;
}

/**
 * Check if a user can see an alarm based on their chainage
 */
export function isAlarmInUserChainage(
  alarmChainage: number,
  userChainageStart: number,
  userChainageEnd: number
): boolean {
  return alarmChainage >= userChainageStart && alarmChainage <= userChainageEnd;
}
