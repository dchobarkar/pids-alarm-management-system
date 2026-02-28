type GetEnvOptions = {
  /** Fallback keys to try if the primary key is not set. */
  alternateKeys?: string[];
  /** If true, log a console.warn when the value is missing (skipped when NODE_ENV === "test"). */
  warnIfMissing?: boolean;
  /** Custom message for the missing-variable warning. */
  warnMessage?: string;
};

/**
 * Returns the value of the first defined env var among primaryKey and alternateKeys.
 * Optionally warns when missing (except in test). Use for optional or soft-required vars.
 */
export const getEnv = (
  primaryKey: string,
  options: GetEnvOptions = {},
): string | undefined => {
  const { alternateKeys = [], warnIfMissing = false, warnMessage } = options;

  const keys = [primaryKey, ...alternateKeys];
  const value = keys
    .map((k) => process.env[k])
    .find((v) => v != null && v !== "");

  if (value == null && warnIfMissing && process.env.NODE_ENV !== "test") {
    const keyList = keys.join(" or ");
    const msg = warnMessage ?? `${keyList} is not set.`;
    console.warn(`[env] ${msg}`);
  }

  return value;
};

/**
 * Returns the env value or throws if missing. Use when the app cannot run without the var.
 */
export const getRequiredEnv = (
  primaryKey: string,
  options: Omit<GetEnvOptions, "warnIfMissing"> & { message?: string } = {},
): string => {
  const value = getEnv(primaryKey, {
    ...options,
    warnIfMissing: false,
  });

  if (value == null || value === "") {
    const keyList = [primaryKey, ...(options.alternateKeys ?? [])].join(" or ");
    throw new Error(
      options.message ?? `Missing required env: ${keyList}. Set it in .env`,
    );
  }

  return value;
};
