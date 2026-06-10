import type { PaymentTranslationsCodeType, PaymentTranslationsStrings } from './types';
import PAYMENT_TRANSLATIONS_INFO from './data/paymentTranslationsConfig.json';

export const getPaymentTranslationsInfo = (code: PaymentTranslationsCodeType): PaymentTranslationsStrings | null =>
  (PAYMENT_TRANSLATIONS_INFO as Record<string, PaymentTranslationsStrings>)[code] ?? null;
