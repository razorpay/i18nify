import { withErrorBoundary } from '../../common/errorBoundary';
import PAYMENT_TRANSLATIONS_INFO from './data/paymentTranslationsConfig.json';
import type { PaymentTranslationsCodeType } from './types';

const getPaymentTranslationsList = (): Record<
  PaymentTranslationsCodeType,
  (typeof PAYMENT_TRANSLATIONS_INFO)[PaymentTranslationsCodeType]
> =>
  PAYMENT_TRANSLATIONS_INFO as Record<
    PaymentTranslationsCodeType,
    (typeof PAYMENT_TRANSLATIONS_INFO)[PaymentTranslationsCodeType]
  >;

export default withErrorBoundary<typeof getPaymentTranslationsList>(
  getPaymentTranslationsList,
);
