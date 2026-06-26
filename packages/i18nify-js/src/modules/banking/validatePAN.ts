import { withErrorBoundary } from '../../common/errorBoundary';

// 4th character (index 3) encodes entity type: P=individual, C=company, H=HUF,
// F=firm, A=AOP, T=trust, B=BOI, L=local authority, J=juridical person, G=govt.
const PAN_REGEX = /^[A-Z]{3}[PCFHABLJTG][A-Z][0-9]{4}[A-Z]$/;

const validatePAN = (pan: string): boolean => {
  if (!pan || typeof pan !== 'string')
    throw new Error('PAN must be a non-empty string.');

  return PAN_REGEX.test(pan.trim().toUpperCase());
};

export default withErrorBoundary<typeof validatePAN>(validatePAN);
