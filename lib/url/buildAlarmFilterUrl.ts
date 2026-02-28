import type { AlarmsSearchParams } from "@/types/alarm";

/**
 * Builds the alarm list URL with optional filter overrides.
 * Preserves existing params and merges overrides (empty string clears a param).
 */
export const buildAlarmFilterUrl = (
  basePath: string,
  params: AlarmsSearchParams,
  overrides: Partial<AlarmsSearchParams> = {},
): string => {
  const merged = { ...params, ...overrides };
  const searchParams = new URLSearchParams();
  (Object.entries(merged) as [keyof AlarmsSearchParams, string][]).forEach(
    ([key, value]) => {
      if (value != null && value !== "") searchParams.set(key, String(value));
    },
  );
  const qs = searchParams.toString();

  return qs ? `${basePath}?${qs}` : basePath;
};
