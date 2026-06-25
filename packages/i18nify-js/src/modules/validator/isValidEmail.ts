import { withErrorBoundary } from '../../common/errorBoundary';
import { EMAIL_REGEX, EMAIL_REGEX_REQUIRE_TLD } from './constants';
import type { EmailValidationOptions } from './types';

const isValidEmail = (
  email: string,
  options?: EmailValidationOptions,
): boolean => {
  if (typeof email !== 'string' || email.trim() === '')
    throw new Error('email must be a non-empty string.');

  const pattern = options?.allowNoTld ? EMAIL_REGEX : EMAIL_REGEX_REQUIRE_TLD;
  return pattern.test(email.trim());
};

export default withErrorBoundary<typeof isValidEmail>(isValidEmail);
