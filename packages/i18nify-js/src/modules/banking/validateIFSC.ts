import { withErrorBoundary } from '../../common/errorBoundary';

// 4 alpha (bank) + '0' (reserved) + 6 alphanumeric (branch) = 11 chars
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const validateIFSC = (ifsc: string): boolean => {
  if (!ifsc || typeof ifsc !== 'string')
    throw new Error('IFSC must be a non-empty string.');

  return IFSC_REGEX.test(ifsc.trim().toUpperCase());
};

export default withErrorBoundary<typeof validateIFSC>(validateIFSC);
