import { withErrorBoundary } from '../../common/errorBoundary';
import type { IsValidNameOptions, NameValidationResult } from './types';
import { getNameValidationRules } from './data';
import {
  getNameValidationConfig,
  hasRepeatingChars,
  hasSequentialChars,
  isAlphaDominant,
  isBlocklisted,
} from './helpers';

/**
 * Validates a human name against common placeholder and garbage-input patterns.
 */
const isValidName = (
  name: string,
  options?: IsValidNameOptions,
): NameValidationResult => {
  if (!name || typeof name !== 'string') {
    throw new Error('name must be a non-empty string.');
  }

  const trimmed = name.trim();

  if (trimmed === '') {
    throw new Error('name must be a non-empty string.');
  }

  const config = getNameValidationConfig(options);

  const { min_length: minLength, max_length: maxLength } =
    getNameValidationRules();
  const nameLength = Array.from(trimmed).length;

  if (nameLength < minLength) {
    return { isValid: false, reason: 'too_short' };
  }

  if (nameLength > maxLength) {
    return { isValid: false, reason: 'too_long' };
  }

  const normalized = trimmed.toLowerCase();

  if (isBlocklisted(normalized, config.blocklist)) {
    return { isValid: false, reason: 'blocklisted' };
  }

  if (hasSequentialChars(normalized, config.sequentialThreshold)) {
    return { isValid: false, reason: 'sequential_chars' };
  }

  if (hasRepeatingChars(normalized, config.repeatingThreshold)) {
    return { isValid: false, reason: 'repeating_chars' };
  }

  if (!isAlphaDominant(normalized, config.alphaDominanceThreshold)) {
    return { isValid: false, reason: 'non_alpha_dominant' };
  }

  return { isValid: true };
};

export default withErrorBoundary<typeof isValidName>(isValidName);
