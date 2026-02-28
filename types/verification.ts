import type { Prisma } from "@/lib/generated/prisma";

/** Verification record with verifier (verifiedBy) included. Returned by createVerification / getVerificationsByAlarm. */
export type VerificationWithVerifier = Prisma.VerificationGetPayload<{
  include: {
    verifiedBy: { select: { id: true; name: true } };
  };
}>;

/** Alarm with chainage, createdBy, latest verification, and evidences. Used for operator review queue (IN_PROGRESS + has verification). */
export type AlarmPendingReview = Prisma.AlarmGetPayload<{
  include: {
    chainage: true;
    createdBy: { select: { id: true; name: true } };
    verifications: {
      orderBy: { verifiedAt: "desc" };
      take: 1;
      include: { verifiedBy: { select: { id: true; name: true } } };
    };
    evidences: true;
  };
}>;
