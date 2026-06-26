import { withErrorBoundary } from '../../common/errorBoundary';
import PAYMENT_TRANSLATIONS_INFO from '#/i18nify-data/payment-translations/data.json';
import type {
  PaymentTranslationsCodeType,
  PaymentTranslationsStrings,
} from './types';

const getPaymentTranslationsList = (): Record<
  PaymentTranslationsCodeType,
  PaymentTranslationsStrings
> =>
  PAYMENT_TRANSLATIONS_INFO as Record<
    PaymentTranslationsCodeType,
    PaymentTranslationsStrings
  >;

export default withErrorBoundary<typeof getPaymentTranslationsList>(
  getPaymentTranslationsList,
);
