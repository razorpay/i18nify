import { withErrorBoundary } from '../../common/errorBoundary';
import {
  CARD_MAX_LENGTH,
  CARD_MIN_LENGTH,
  CARD_SEPARATOR_REGEX,
} from './constants';
import type { CardValidationOptions } from './types';

/**
 * Validates a payment card number using the Luhn algorithm (ISO/IEC 7812-1 Annex B).
 * Accepts digits with optional space or hyphen separators (e.g. "4111 1111 1111 1111").
 */
const isValidCardNumber = (
  cardNumber: string,
  options?: CardValidationOptions,
): boolean => {
  if (typeof cardNumber !== 'string' || cardNumber.trim() === '')
    throw new Error('cardNumber must be a non-empty string.');

  const digits = cardNumber.replace(CARD_SEPARATOR_REGEX, '');

  if (!/^\d+$/.test(digits)) return false;

  const { allowedLengths } = options ?? {};
  const len = digits.length;
  if (allowedLengths) {
    if (!allowedLengths.includes(len)) return false;
  } else {
    if (len < CARD_MIN_LENGTH || len > CARD_MAX_LENGTH) return false;
  }

  // Luhn mod-10 check: double every second digit from the right.
  let sum = 0;
  let isEven = false;
  for (let i = len - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

export default withErrorBoundary<typeof isValidCardNumber>(isValidCardNumber);
