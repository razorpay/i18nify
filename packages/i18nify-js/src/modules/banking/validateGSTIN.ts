import { withErrorBoundary } from '../../common/errorBoundary';

// Valid state/UT codes per the GST Act (01–38, 97 = Other Territory, 99 = Centre).
const VALID_STATE_CODES = new Set([
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '26',
  '27',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '97',
  '99',
]);

// SS + PAN(5A+4N+1A) + entity(1-9/A-Z) + 'Z' + checksum(0-9/A-Z) = 15 chars
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const validateGSTIN = (gstin: string): boolean => {
  if (!gstin || typeof gstin !== 'string')
    throw new Error('GSTIN must be a non-empty string.');

  const normalised = gstin.trim().toUpperCase();
  if (!GSTIN_REGEX.test(normalised)) return false;

  return VALID_STATE_CODES.has(normalised.slice(0, 2));
};

export default withErrorBoundary<typeof validateGSTIN>(validateGSTIN);
