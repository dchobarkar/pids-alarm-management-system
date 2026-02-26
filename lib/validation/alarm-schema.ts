import { z } from "zod";

const chainageValueSchema = z
  .number()
  .positive("Chainage value must be positive")
  .refine(
    (val) => {
      const str = String(val);
      const decimalPart = str.split(".")[1];
      return !decimalPart || decimalPart.length <= 3;
    },
    { message: "Max 3 decimal places" },
  );

export const createAlarmSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  chainageValue: chainageValueSchema,
  alarmType: z.enum([
    "VIBRATION",
    "DIGGING",
    "INTRUSION",
    "TAMPERING",
    "UNKNOWN",
  ]),
  criticality: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  incidentTime: z
    .date()
    .refine(
      (d) => d.getTime() <= Date.now(),
      "Incident time cannot be in the future",
    ),
});

export type CreateAlarmInput = z.infer<typeof createAlarmSchema>;
