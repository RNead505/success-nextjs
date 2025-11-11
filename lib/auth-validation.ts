/**
 * Authentication validation utilities for SUCCESS Magazine
 * Enforces @success.com domain restriction and password policies
 */

export const ALLOWED_DOMAIN = '@success.com';
export const DEFAULT_PASSWORD = 'SUCCESS123!';

/**
 * Validates if an email belongs to the SUCCESS Magazine domain
 */
export function isSuccessEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
}

/**
 * Validates password strength
 * Requirements: min 8 chars, uppercase, lowercase, number
 */
export function isStrongPassword(password: string): boolean {
  if (!password || password.length < 8) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Checks if password is the default password
 */
export function isDefaultPassword(password: string): boolean {
  return password === DEFAULT_PASSWORD;
}

/**
 * Validates that new password meets requirements and is not default
 */
export function validateNewPassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (isDefaultPassword(password)) {
    return { valid: false, error: 'You cannot use the default password. Please choose a new password.' };
  }

  if (!isStrongPassword(password)) {
    return {
      valid: false,
      error: 'Password must be at least 8 characters and include uppercase, lowercase, and number'
    };
  }

  return { valid: true };
}

/**
 * Error messages for domain validation
 */
export const AUTH_ERRORS = {
  INVALID_DOMAIN: 'Access restricted to SUCCESS Magazine staff (@success.com emails only)',
  WEAK_PASSWORD: 'Password must be at least 8 characters and include uppercase, lowercase, and number',
  DEFAULT_PASSWORD: 'You cannot use the default password. Please choose a new password.',
  PASSWORD_CHANGE_REQUIRED: 'For security, you must change your password before accessing the admin',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect'
};
