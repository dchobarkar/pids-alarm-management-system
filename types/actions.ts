export type CloseAlarmResult =
  | { success: true }
  | { success: false; error: string };

export type CreateAlarmResult =
  | { success: true; alarmId: string }
  | { success: false; error: string };

export type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export type SubmitVerificationResult =
  | { success: true }
  | { success: false; error: string };

export type EscalateAlarmResult =
  | { success: true }
  | { success: false; error: string };

export type ReassignAlarmResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export type AssignAlarmResult =
  | { success: true }
  | { success: false; error: string };

export type SelfAssignAlarmResult =
  | { success: true }
  | { success: false; error: string };

export type AcceptAssignmentResult =
  | { success: true }
  | { success: false; error: string };

export type OperatorDecisionResult =
  | { success: true }
  | { success: false; error: string };
