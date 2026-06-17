import { withErrorBoundary } from '../../common/errorBoundary';
import { DEFAULT_MASK_CHAR, DEFAULT_VISIBLE_DIGITS } from './constants';
import type { MaskPhoneOptions } from './types';

const maskPhoneNumber = (phone: string, options?: MaskPhoneOptions): string => {
  if (!phone || typeof phone !== 'string') {
    throw new Error('maskPhoneNumber: phone must be a non-empty string.');
  }

  const maskChar = options?.maskChar ?? DEFAULT_MASK_CHAR;
  const visibleCount = options?.visibleCount ?? DEFAULT_VISIBLE_DIGITS;

  const trimmed = phone.trim();
  // Preserve leading '+' (international prefix indicator)
  const hasPlus = trimmed.startsWith('+');
  const rest = hasPlus ? trimmed.slice(1) : trimmed;

  // Count total digits (excluding '+')
  const digitCount = (rest.match(/\d/g) ?? []).length;
  const maskFrom = Math.max(0, digitCount - visibleCount);

  let digitsSeen = 0;
  const masked = rest
    .split('')
    .map((ch) => {
      if (/\d/.test(ch)) {
        return digitsSeen++ < maskFrom ? maskChar : ch;
      }
      return ch; // preserve separators (spaces, hyphens, dots, parens, etc.)
    })
    .join('');

  return (hasPlus ? '+' : '') + masked;
};

export default withErrorBoundary<typeof maskPhoneNumber>(maskPhoneNumber);
