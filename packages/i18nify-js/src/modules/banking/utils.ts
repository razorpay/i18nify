import type {
  PaymentTranslationsCodeType,
  PaymentTranslationsStrings,
} from './types';
import PAYMENT_TRANSLATIONS_INFO from '#/i18nify-data/payment-translations/paymentTranslationsConfig.json';

export const getPaymentTranslationsInfo = (
  code: PaymentTranslationsCodeType,
): PaymentTranslationsStrings | null =>
  (PAYMENT_TRANSLATIONS_INFO as Record<string, PaymentTranslationsStrings>)[
    code
  ] ?? null;
