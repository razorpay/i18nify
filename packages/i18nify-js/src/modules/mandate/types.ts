export type MandateFrequencyCode =
  | 'DAILY'
  | 'WEEKLY'
  | 'FORTNIGHTLY'
  | 'BI_WEEKLY'
  | 'MONTHLY'
  | 'BI_MONTHLY'
  | 'QUARTERLY'
  | 'HALF_YEARLY'
  | 'SEMI_ANNUAL'
  | 'YEARLY'
  | 'ANNUAL'
  | 'AS_PRESENTED';

export interface MandateFrequencyLabel {
  label: string;
  description: string;
  days?: number; // approximate days between recurrences; undefined for variable-frequency codes
}
