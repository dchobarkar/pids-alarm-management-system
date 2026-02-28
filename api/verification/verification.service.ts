import type { VerificationWithVerifier } from "@/types/verification";
import { assertAlarmNotClosed } from "@/lib/alarm-state-machine/guards";
import { findAlarmById } from "@/api/alarm/alarm.repository";
import { createVerification as createVerificationRepo } from "@/api/verification/verification.repository";

/** Create verification after asserting alarm is not closed. */
export const createVerification = async (params: {
  alarmId: string;
  verifiedById: string;
  latitude: number;
  longitude: number;
  distance: number;
  geoMismatch: boolean;
  remarks?: string | null;
}): Promise<VerificationWithVerifier> => {
  const alarm = await findAlarmById(params.alarmId);
  if (alarm) assertAlarmNotClosed(alarm.status);
  const v = await createVerificationRepo(params);
  return v as VerificationWithVerifier;
};
