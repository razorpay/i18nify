import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Validates a personal name against i18nify name rules.
 *
 * A valid name must:
 * - Be at least 2 characters long (after trimming whitespace).
 * - Be at most 100 characters long.
 * - Contain only Unicode letters, spaces, hyphens (-), apostrophes ('), or periods (.).
 * - Contain at least one Unicode letter.
 *
 * @param {string} name - The name to validate
 * @returns {boolean} True if the name is valid, false otherwise
 *
 * @example
 * isValidName('John Smith');    // true
 * isValidName("O'Brien");       // true
 * isValidName('Mary-Jane');     // true
 * isValidName('John2');         // false — digits not allowed
 * isValidName('A');             // false — too short
 */
const isValidName = (name: string): boolean => {
  const trimmed = (name ?? '').trim();

  const MIN_LENGTH = 2;
  const MAX_LENGTH = 100;

  if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
    return false;
  }

  // Must contain at least one Unicode letter and only allowed characters.
  // \p{M} includes combining marks (e.g., Devanagari vowel signs, Arabic diacritics)
  // which are integral parts of correctly-spelled names in many scripts.
  // Literal space is used (not \s) to exclude tabs and newlines.
  const allowedPattern = /^[\p{L}\p{M} '\-.]+$/u;
  const hasLetter = /\p{L}/u.test(trimmed);

  return allowedPattern.test(trimmed) && hasLetter;
};

export default withErrorBoundary<typeof isValidName>(isValidName);
