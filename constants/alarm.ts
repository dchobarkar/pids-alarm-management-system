export const ALARM_TYPE_VALUES = [
  "VIBRATION",
  "DIGGING",
  "INTRUSION",
  "TAMPERING",
  "UNKNOWN",
] as const;
export const CRITICALITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

/** Status values shown in operator/supervisor alarm list filters. */
export const ALARM_LIST_FILTER_STATUSES = [
  "UNASSIGNED",
  "ASSIGNED",
  "ESCALATED",
  "CLOSED",
] as const;
export type AlarmTypeValue = (typeof ALARM_TYPE_VALUES)[number];
export type CriticalityValue = (typeof CRITICALITY_VALUES)[number];

/** Display labels for alarm types. */
const ALARM_TYPE_LABELS: Record<AlarmTypeValue, string> = {
  VIBRATION: "Vibration",
  DIGGING: "Digging",
  INTRUSION: "Intrusion",
  TAMPERING: "Tampering",
  UNKNOWN: "Unknown",
};
/** Display labels for criticality. */
const CRITICALITY_LABELS: Record<CriticalityValue, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};
/** Options for alarm type select (value + label). */
export const ALARM_TYPE_OPTIONS = ALARM_TYPE_VALUES.map((value) => ({
  value,
  label: ALARM_TYPE_LABELS[value],
}));
/** Options for criticality select (value + label). */
export const CRITICALITY_OPTIONS = CRITICALITY_VALUES.map((value) => ({
  value,
  label: CRITICALITY_LABELS[value],
}));
