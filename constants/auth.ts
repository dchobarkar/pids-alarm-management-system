/** bcrypt salt rounds for password hashing. */
export const SALT_ROUNDS = 10;

/** Minimum length for user passwords. */
export const MIN_PASSWORD_LENGTH = 8;

/** Regex for valid email format. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Default password for seeded users. Change in production. */
export const DEFAULT_PASSWORD = "Password@123";

/** JWT session max age in seconds (8 hours). Rolling session; refreshed while user is active. */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

/** How often (seconds) to refresh the session token while user is active (30 minutes). */
export const SESSION_UPDATE_AGE_SECONDS = 30 * 60;

/** Sign-in page path (NextAuth pages config). */
export const AUTH_SIGN_IN_PATH = "/auth/signin";

/** Auth error page path (e.g. access denied, session required). */
export const AUTH_ERROR_PATH = "/auth/error";
