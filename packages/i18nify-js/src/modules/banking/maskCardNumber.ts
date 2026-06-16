import { withErrorBoundary } from '../../common/errorBoundary';
import {
  DEFAULT_CARD_GROUP_SEPARATOR,
  DEFAULT_CARD_GROUP_SIZE,
  DEFAULT_MASK_CHAR,
  DEFAULT_VISIBLE_DIGITS,
} from './constants';
import type { MaskCardOptions } from './types';

const maskCardNumber = (
  cardNumber: string,
  options?: MaskCardOptions,
): string => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    throw new Error('maskCardNumber: cardNumber must be a non-empty string.');
  }

  const maskChar = options?.maskChar ?? DEFAULT_MASK_CHAR;
  const visibleCount = options?.visibleCount ?? DEFAULT_VISIBLE_DIGITS;
  // groupSize: 0 explicitly disables grouping; undefined uses the default
  const groupSize =
    options?.groupSize != null ? options.groupSize : DEFAULT_CARD_GROUP_SIZE;
  const groupSeparator =
    options?.groupSeparator ?? DEFAULT_CARD_GROUP_SEPARATOR;

  const digits = cardNumber.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(digits)) {
    throw new Error(
      'maskCardNumber: cardNumber may only contain digits, spaces, or hyphens.',
    );
  }

  const maskLen = Math.max(0, digits.length - visibleCount);
  const masked = maskChar.repeat(maskLen) + digits.slice(maskLen);

  if (groupSize === 0) return masked;

  const groups: string[] = [];
  for (let i = 0; i < masked.length; i += groupSize) {
    groups.push(masked.slice(i, i + groupSize));
  }
  return groups.join(groupSeparator);
};

export default withErrorBoundary<typeof maskCardNumber>(maskCardNumber);
