import type { PaymentTranslationsCodeType, PaymentTranslationsType } from './types';
import PAYMENT_TRANSLATIONS_INFO from './data/paymentTranslationsConfig.json';

export const getPaymentTranslationsInfo = (
  code: PaymentTranslationsCodeType,
): PaymentTranslationsType | null =>
  (PAYMENT_TRANSLATIONS_INFO as Record<string, PaymentTranslationsType>)[code] ?? null;
