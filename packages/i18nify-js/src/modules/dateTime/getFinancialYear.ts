import { withErrorBoundary } from '../../common/errorBoundary';
import { DateInput } from './types';
import { convertToStandardDate } from './utils';

export type FYLabelFormat = 'short' | 'long' | 'fy';

export interface GetFinancialYearOptions {
  labelFormat?: FYLabelFormat;
}

interface FYConfig {
  startMonth: number;
  labelFormat: FYLabelFormat;
}

// FY start month (1-indexed) and default label format per country.
const FY_CONFIG: Record<string, FYConfig> = {
  // April 1 → March 31  → "2024-25"
  IN: { startMonth: 4, labelFormat: 'short' },
  JP: { startMonth: 4, labelFormat: 'short' },
  GB: { startMonth: 4, labelFormat: 'short' },
  CA: { startMonth: 4, labelFormat: 'short' },
  NZ: { startMonth: 4, labelFormat: 'short' },
  SG: { startMonth: 4, labelFormat: 'short' },
  ZA: { startMonth: 4, labelFormat: 'short' },
  // July 1 → June 30  → "2024-25"
  AU: { startMonth: 7, labelFormat: 'short' },
  BD: { startMonth: 7, labelFormat: 'short' },
  PK: { startMonth: 7, labelFormat: 'short' },
  // October 1 → September 30  → "FY2025"
  US: { startMonth: 10, labelFormat: 'fy' },
};

const SUPPORTED_COUNTRIES = Object.keys(FY_CONFIG).join(', ');

const buildLabel = (
  fyStartYear: number,
  fyEndYear: number,
  format: FYLabelFormat,
): string => {
  switch (format) {
    case 'short':
      return `${fyStartYear}-${String(fyEndYear).slice(-2)}`;
    case 'long':
      return `${fyStartYear}-${fyEndYear}`;
    case 'fy':
      return `FY${fyEndYear}`;
  }
};

const getFinancialYear = (
  date: DateInput,
  countryCode: string,
  options: GetFinancialYearOptions = {},
): string => {
  if (date === null || date === undefined || date === '')
    throw new Error(
      `Parameter 'date' is invalid! The received value was: ${date}.`,
    );
  if (!countryCode)
    throw new Error(
      `Parameter 'countryCode' is invalid! The received value was: ${countryCode}.`,
    );

  const config = FY_CONFIG[countryCode.toUpperCase()];
  if (!config)
    throw new Error(
      `Country code "${countryCode}" is not supported for financial year calculation. Supported countries: ${SUPPORTED_COUNTRIES}.`,
    );

  const d = convertToStandardDate(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // convert to 1-indexed

  const fyStartYear = month >= config.startMonth ? year : year - 1;
  const fyEndYear = fyStartYear + 1;
  const labelFormat = options.labelFormat ?? config.labelFormat;

  return buildLabel(fyStartYear, fyEndYear, labelFormat);
};

export default withErrorBoundary<typeof getFinancialYear>(getFinancialYear);
