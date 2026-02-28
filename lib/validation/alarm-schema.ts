import { z } from "zod";

import { ALARM_TYPE_VALUES, CRITICALITY_VALUES } from "@/constants/alarm";

/** Zod enum for alarm type — single source of truth: @/constants/alarm ALARM_TYPE_VALUES. */
const alarmTypeSchema = z.enum(ALARM_TYPE_VALUES);
/** Zod enum for criticality — single source of truth: @/constants/alarm CRITICALITY_VALUES. */
const criticalitySchema = z.enum(CRITICALITY_VALUES);

/** Chainage value: positive number, max 3 decimal places. */
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

/** Zod schema for creating an alarm (lat/long, chainage, type, criticality, incident time). */
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
  alarmType: alarmTypeSchema,
  criticality: criticalitySchema,
  incidentTime: z
    .date()
    .refine(
      (d) => d.getTime() <= Date.now(),
      "Incident time cannot be in the future",
    ),
});
