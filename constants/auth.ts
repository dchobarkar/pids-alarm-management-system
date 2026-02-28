/** bcrypt salt rounds for password hashing. */
export const SALT_ROUNDS = 10;

/** Minimum length for user passwords. */
export const MIN_PASSWORD_LENGTH = 8;

/** Regex for valid email format. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Default password for seeded users. Change in production. */
export const DEFAULT_PASSWORD = "Password@123";
