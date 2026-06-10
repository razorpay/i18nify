import PAYMENT_TRANSLATIONS_INFO from './data/paymentTranslationsConfig.json';

export type PaymentTranslationsCodeType = keyof typeof PAYMENT_TRANSLATIONS_INFO;

export interface PaymentStrings {
  pay_now: string;
  cancel: string;
  amount: string;
  card_number: string;
  cvv: string;
  expiry_date: string;
  name_on_card: string;
  upi_id: string;
  bank: string;
  processing: string;
  payment_successful: string;
  payment_failed: string;
  retry: string;
  mobile_number: string;
  otp: string;
  enter_otp: string;
  resend_otp: string;
  wallet: string;
  net_banking: string;
  select_bank: string;
  enter_amount: string;
  minimum_amount: string;
  maximum_amount: string;
  transaction_id: string;
  order_id: string;
  back: string;
  next: string;
  confirm: string;
  done: string;
  save: string;
  error_occurred: string;
  try_again: string;
}

export interface PaymentTranslationsType {
  language_name: string;
  native_name: string;
  strings: PaymentStrings;
}
