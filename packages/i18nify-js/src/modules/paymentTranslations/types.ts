import PAYMENT_TRANSLATIONS_INFO from './data/paymentTranslationsConfig.json';

export type PaymentTranslationsCodeType =
  keyof typeof PAYMENT_TRANSLATIONS_INFO;

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
