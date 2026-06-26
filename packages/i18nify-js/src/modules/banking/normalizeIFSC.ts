import { withErrorBoundary } from '../../common/errorBoundary';

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const normalizeIFSC = (ifsc: string): string => {
  if (!ifsc || typeof ifsc !== 'string')
    throw new Error('IFSC must be a non-empty string.');

  const normalised = ifsc.trim().toUpperCase();

  if (!IFSC_REGEX.test(normalised))
    throw new Error(
      `Invalid IFSC format: "${ifsc}". Expected 4 letters + '0' + 6 alphanumeric characters (e.g. SBIN0001234).`,
    );

  return normalised;
};

export default withErrorBoundary<typeof normalizeIFSC>(normalizeIFSC);
