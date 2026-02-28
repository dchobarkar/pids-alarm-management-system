/** Error branch of a server action result. */
export type ActionError = { success: false; error: string };

/** Success result with no extra payload. Use for most server actions. */
export type ActionResult = { success: true } | ActionError;

/** Success result with extra data (e.g. { alarmId: string }). Use for create/return-id actions. */
export type ActionResultWithData<T extends Record<string, unknown>> =
  | ({ success: true } & T)
  | ActionError;
