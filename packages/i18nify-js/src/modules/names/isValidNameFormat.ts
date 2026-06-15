import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Validates the format of a personal name against i18nify name rules.
 *
 * A name has a valid format when it:
 * - Is at least 2 characters long (after trimming whitespace).
 * - Is at most 100 characters long.
 * - Contains only Unicode letters, spaces, hyphens (-), apostrophes ('), or periods (.).
 * - Contains at least one Unicode letter.
 *
 * This is a structural/charset check. For garbage-input detection (blocklists,
 * sequential/repeating characters), use `isValidName` from the nameValidation module.
 *
 * @param {string} name - The name to validate
 * @returns {boolean} True if the name's format is valid, false otherwise
 *
 * @example
 * isValidNameFormat('John Smith');    // true
 * isValidNameFormat("O'Brien");       // true
 * isValidNameFormat('Mary-Jane');     // true
 * isValidNameFormat('John2');         // false — digits not allowed
 * isValidNameFormat('A');             // false — too short
 */
const isValidNameFormat = (name: string): boolean => {
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

export default withErrorBoundary<typeof isValidNameFormat>(isValidNameFormat);
