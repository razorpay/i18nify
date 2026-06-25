import { withErrorBoundary } from '../../common/errorBoundary';
import {
  DEFAULT_ALPHA_DOMINANCE_THRESHOLD,
  DEFAULT_NAME_BLOCKLIST,
  DEFAULT_REPEATING_THRESHOLD,
  DEFAULT_SEQUENTIAL_THRESHOLD,
} from './constants';
import type { IsValidNameOptions, NameValidationResult } from './types';
import {
  hasRepeatingChars,
  hasSequentialChars,
  isAlphaDominant,
} from './utils';

const isValidName = (
  name: string,
  options?: IsValidNameOptions,
): NameValidationResult => {
  const {
    blocklist,
    allowBlocklistExtension = false,
    sequentialThreshold = DEFAULT_SEQUENTIAL_THRESHOLD,
    repeatingThreshold = DEFAULT_REPEATING_THRESHOLD,
    alphaDominanceThreshold = DEFAULT_ALPHA_DOMINANCE_THRESHOLD,
  } = options ?? {};

  const effectiveBlocklist = blocklist
    ? allowBlocklistExtension
      ? [...DEFAULT_NAME_BLOCKLIST, ...blocklist]
      : blocklist
    : DEFAULT_NAME_BLOCKLIST;

  const normalized = name.trim().toLowerCase();

  if (effectiveBlocklist.includes(normalized)) {
    return { isValid: false, reason: 'blocklisted' };
  }

  if (hasSequentialChars(normalized, sequentialThreshold)) {
    return { isValid: false, reason: 'sequential_chars' };
  }

  if (hasRepeatingChars(normalized, repeatingThreshold)) {
    return { isValid: false, reason: 'repeating_chars' };
  }

  if (!isAlphaDominant(normalized, alphaDominanceThreshold)) {
    return { isValid: false, reason: 'non_alpha_dominant' };
  }

  return { isValid: true };
};

export default withErrorBoundary<typeof isValidName>(isValidName);
