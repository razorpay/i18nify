import { withErrorBoundary } from '../../common/errorBoundary';
import { PaymentNetworkResult } from './types';

// Curated currency → payment network mapping.
// primary: the most widely used retail/instant network for each currency.
// networks: all commonly used networks ordered from most to least prevalent.
// Sources: BIS CPMI Red Book 2024; central bank / payment scheme operator publications.
const PAYMENT_NETWORK_MAP: Readonly<Record<string, PaymentNetworkResult>> = {
  // Americas
  USD: { networks: ['ACH', 'Fedwire', 'CHIPS'], primary: 'ACH' },
  CAD: { networks: ['EFT', 'Lynx'], primary: 'EFT' },
  BRL: { networks: ['Pix', 'TED'], primary: 'Pix' },
  MXN: { networks: ['SPEI'], primary: 'SPEI' },

  // Europe
  GBP: {
    networks: ['Faster Payments', 'CHAPS', 'BACS'],
    primary: 'Faster Payments',
  },
  EUR: { networks: ['SEPA', 'TARGET2', 'SEPA Instant'], primary: 'SEPA' },
  CHF: { networks: ['SIC', 'SEPA'], primary: 'SIC' },
  NOK: { networks: ['NICS'], primary: 'NICS' },
  SEK: { networks: ['Bankgirot', 'Swish'], primary: 'Bankgirot' },
  DKK: { networks: ['Straks', 'NETS'], primary: 'Straks' },
  PLN: { networks: ['BLIK', 'ELIXIR', 'SORBNET'], primary: 'BLIK' },
  CZK: { networks: ['CERTIS'], primary: 'CERTIS' },
  RON: { networks: ['ReGIS', 'SENT'], primary: 'ReGIS' },
  HUF: { networks: ['GIRO', 'VIBER'], primary: 'GIRO' },
  TRY: { networks: ['FAST', 'EFT'], primary: 'FAST' },

  // Asia Pacific
  INR: { networks: ['UPI', 'IMPS', 'NEFT', 'RTGS'], primary: 'UPI' },
  AUD: { networks: ['NPP', 'BECS'], primary: 'NPP' },
  NZD: { networks: ['BECS', 'ESAS'], primary: 'BECS' },
  SGD: { networks: ['FAST', 'MEPS+'], primary: 'FAST' },
  MYR: { networks: ['DuitNow', 'IBG'], primary: 'DuitNow' },
  JPY: { networks: ['Zengin', 'BOJ-NET'], primary: 'Zengin' },
  HKD: { networks: ['FPS', 'CHATS'], primary: 'FPS' },
  CNY: { networks: ['CNAPS', 'CIPS'], primary: 'CNAPS' },
  KRW: { networks: ['KFTC', 'EFT'], primary: 'KFTC' },
  TWD: { networks: ['CIFS'], primary: 'CIFS' },
  IDR: { networks: ['BI-FAST', 'BI-RTGS'], primary: 'BI-FAST' },
  THB: { networks: ['PromptPay', 'BAHTNET'], primary: 'PromptPay' },
  PHP: { networks: ['InstaPay', 'PESONet'], primary: 'InstaPay' },
  VND: { networks: ['NAPAS'], primary: 'NAPAS' },
  PKR: { networks: ['Raast', 'RTGS'], primary: 'Raast' },
  BDT: { networks: ['BEFTN', 'BD-RTGS'], primary: 'BEFTN' },
  LKR: { networks: ['LankaPay', 'SLIPS'], primary: 'LankaPay' },

  // Middle East
  AED: { networks: ['UAEFTS', 'IPP'], primary: 'UAEFTS' },
  SAR: { networks: ['SARIE'], primary: 'SARIE' },
  QAR: { networks: ['QATCH'], primary: 'QATCH' },
  BHD: { networks: ['Fawri+', 'RTGS'], primary: 'Fawri+' },
  OMR: { networks: ['BFTS', 'RTGS'], primary: 'BFTS' },

  // Africa
  ZAR: { networks: ['RTC', 'SAMOS'], primary: 'RTC' },
  KES: { networks: ['PesaLink', 'RTGS'], primary: 'PesaLink' },
  NGN: { networks: ['NIP', 'RTGS'], primary: 'NIP' },
  GHS: { networks: ['GhIPSS'], primary: 'GhIPSS' },
  EGP: { networks: ['ACH', 'RTGS'], primary: 'ACH' },
};

const getPaymentNetwork = (currencyCode: string): PaymentNetworkResult => {
  if (!currencyCode)
    throw new Error(
      `Parameter 'currencyCode' is invalid! The received value was: ${currencyCode}.`,
    );

  const result = PAYMENT_NETWORK_MAP[currencyCode.toUpperCase()];
  if (!result)
    throw new Error(
      `Currency code "${currencyCode}" is not supported for payment network lookup. ` +
        `Supported currencies: ${Object.keys(PAYMENT_NETWORK_MAP).join(', ')}.`,
    );

  return result;
};

export default withErrorBoundary<typeof getPaymentNetwork>(getPaymentNetwork);
