export type RoutingCodeType =
  | 'IFSC'
  | 'SWIFT'
  | 'BIC'
  | 'ROUTING_NUMBER'
  | 'ABA'
  | 'SORT_CODE'
  | 'BSB'
  | 'IBAN'
  | 'CLABE'
  | 'CNAPS'
  | 'TRANSIT'
  | 'MICR';

export interface RoutingCodeLabel {
  label: string;
  full_name: string;
  description: string;
  country?: string;
}

export interface PaymentNetworkResult {
  networks: string[];
  primary: string;
}

// From mandate/types.ts
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

// From paymentTranslations/types.ts
export type PaymentTranslationsCodeType = 'bn' | 'gu' | 'hi' | 'kn' | 'mr' | 'ta' | 'te';

export interface PaymentTranslationsStrings {
  language_name: string;
  script: string;
  pay_now: string;
  amount: string;
  cancel: string;
  confirm: string;
  payment_successful: string;
  payment_failed: string;
  processing: string;
  total: string;
  retry: string;
  enter_amount: string;
  card_number: string;
  card_expiry: string;
  cvv: string;
  name_on_card: string;
  upi_id: string;
  net_banking: string;
  wallet: string;
  transaction_id: string;
  back: string;
  error_try_again: string;
  order_id: string;
  receipt: string;
}

export interface PaymentTranslationsType {
  code: PaymentTranslationsCodeType;
  strings: PaymentTranslationsStrings;
}

// From masking/types.ts
export type MaskCardOptions = {
  maskChar?: string;
  visibleCount?: number;
  groupSize?: number;
  groupSeparator?: string;
};
