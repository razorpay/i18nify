import { withErrorBoundary } from '../../common/errorBoundary';
import { MandateFrequencyCode, MandateFrequencyLabel } from './types';

// Display labels for recurring mandate frequency codes.
// `days` is the approximate number of days between recurrences (undefined for AS_PRESENTED).
// Lookup is case-insensitive. BI_WEEKLY is an alias for FORTNIGHTLY;
// SEMI_ANNUAL for HALF_YEARLY; ANNUAL for YEARLY.
const FREQUENCY_LABEL_MAP: Readonly<Record<string, MandateFrequencyLabel>> = {
  DAILY: {
    label: 'Daily',
    description: 'Recurring every day',
    days: 1,
  },
  WEEKLY: {
    label: 'Weekly',
    description: 'Recurring every week',
    days: 7,
  },
  FORTNIGHTLY: {
    label: 'Fortnightly',
    description: 'Recurring every two weeks',
    days: 14,
  },
  BI_WEEKLY: {
    label: 'Bi-Weekly',
    description: 'Recurring every two weeks',
    days: 14,
  },
  MONTHLY: {
    label: 'Monthly',
    description: 'Recurring every month',
    days: 30,
  },
  BI_MONTHLY: {
    label: 'Bi-Monthly',
    description: 'Recurring every two months',
    days: 60,
  },
  QUARTERLY: {
    label: 'Quarterly',
    description: 'Recurring every three months',
    days: 90,
  },
  HALF_YEARLY: {
    label: 'Half-Yearly',
    description: 'Recurring every six months',
    days: 180,
  },
  SEMI_ANNUAL: {
    label: 'Semi-Annual',
    description: 'Recurring every six months',
    days: 180,
  },
  YEARLY: {
    label: 'Yearly',
    description: 'Recurring every year',
    days: 365,
  },
  ANNUAL: {
    label: 'Annual',
    description: 'Recurring every year',
    days: 365,
  },
  AS_PRESENTED: {
    label: 'As Presented',
    description: 'Collected as and when presented by the merchant',
  },
};

const getMandateFrequencyLabel = (
  frequencyCode: MandateFrequencyCode | string,
): MandateFrequencyLabel => {
  if (!frequencyCode)
    throw new Error(
      `Parameter 'frequencyCode' is invalid! The received value was: ${frequencyCode}.`,
    );

  const definition =
    FREQUENCY_LABEL_MAP[(frequencyCode as string).toUpperCase()];
  if (!definition)
    throw new Error(
      `Frequency code "${frequencyCode}" is not supported. ` +
        `Supported codes: ${Object.keys(FREQUENCY_LABEL_MAP).join(', ')}.`,
    );

  return definition;
};

export default withErrorBoundary<typeof getMandateFrequencyLabel>(
  getMandateFrequencyLabel,
);
