/** Input shape for creating an alarm. Must match createAlarmSchema in lib/validation/alarm-schema. */
export type CreateAlarmInput = {
  latitude: number;
  longitude: number;
  chainageValue: number;
  alarmType: "VIBRATION" | "DIGGING" | "INTRUSION" | "TAMPERING" | "UNKNOWN";
  criticality: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  incidentTime: Date;
};
