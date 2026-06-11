import { withErrorBoundary } from '../../common/errorBoundary';
import { RoutingCodeLabel, RoutingCodeType } from './types';

// Curated display labels for payment routing code identifiers.
// Sources: ISO 9362 (SWIFT/BIC), ISO 13616 (IBAN), RBI (IFSC),
//          UK PSR (Sort Code), APCA (BSB), ABA (Routing Number),
//          Banco de México (CLABE), PBOC (CNAPS), Payments Canada (Transit).
const ROUTING_LABEL_MAP: Readonly<Record<string, RoutingCodeLabel>> = {
  IFSC: {
    label: 'IFSC',
    full_name: 'Indian Financial System Code',
    description:
      '11-character alphanumeric code issued by the RBI that identifies bank branches in India; required for NEFT, RTGS, and IMPS transfers.',
    country: 'IN',
  },
  SWIFT: {
    label: 'SWIFT Code',
    full_name: 'SWIFT/BIC Code',
    description:
      '8 or 11-character Business Identifier Code (ISO 9362) that uniquely identifies a financial institution for international wire transfers.',
  },
  BIC: {
    label: 'BIC',
    full_name: 'Bank Identifier Code',
    description:
      '8 or 11-character Business Identifier Code (ISO 9362) used for international interbank transactions; also known as SWIFT code.',
  },
  ROUTING_NUMBER: {
    label: 'Routing Number',
    full_name: 'ABA Routing Number',
    description:
      '9-digit transit number assigned by the American Bankers Association that identifies a US financial institution for ACH and wire transfers.',
    country: 'US',
  },
  ABA: {
    label: 'ABA Routing Number',
    full_name: 'ABA Routing Number',
    description:
      '9-digit transit number assigned by the American Bankers Association that identifies a US financial institution for ACH and wire transfers.',
    country: 'US',
  },
  SORT_CODE: {
    label: 'Sort Code',
    full_name: 'UK Sort Code',
    description:
      '6-digit code (XX-XX-XX) assigned by UK banks that identifies the bank and branch for domestic Faster Payments, BACS, and CHAPS transfers.',
    country: 'GB',
  },
  BSB: {
    label: 'BSB Number',
    full_name: 'Bank State Branch Number',
    description:
      '6-digit code assigned by the Australian Payments Network that identifies a bank and branch for domestic direct credit and debit transactions.',
    country: 'AU',
  },
  IBAN: {
    label: 'IBAN',
    full_name: 'International Bank Account Number',
    description:
      'Up to 34-character alphanumeric code (ISO 13616) that internationally identifies a bank account, used across SEPA and 80+ countries.',
  },
  CLABE: {
    label: 'CLABE',
    full_name: 'Standardized Banking Code (CLABE)',
    description:
      '18-digit standardized account number regulated by Banco de México; required for all electronic interbank transfers within Mexico.',
    country: 'MX',
  },
  CNAPS: {
    label: 'CNAPS Code',
    full_name: 'CNAPS Routing Code',
    description:
      "12-digit code assigned by the People's Bank of China that identifies financial institution branches within the China National Advanced Payment System.",
    country: 'CN',
  },
  TRANSIT: {
    label: 'Transit Number',
    full_name: 'Bank Transit Number',
    description:
      '9-digit Canadian bank transit number comprising a 5-digit branch number and 3-digit institution number, used for EFT and direct deposit.',
    country: 'CA',
  },
  MICR: {
    label: 'MICR Code',
    full_name: 'MICR Code',
    description:
      '9-digit code printed on Indian bank cheques using Magnetic Ink Character Recognition technology, used to identify the bank and branch during cheque processing.',
    country: 'IN',
  },
};

const getRoutingLabel = (
  routingCodeType: RoutingCodeType | string,
): RoutingCodeLabel => {
  if (!routingCodeType)
    throw new Error(
      `Parameter 'routingCodeType' is invalid! The received value was: ${routingCodeType}.`,
    );

  const definition =
    ROUTING_LABEL_MAP[(routingCodeType as string).toUpperCase()];
  if (!definition)
    throw new Error(
      `Routing code type "${routingCodeType}" is not supported. ` +
        `Supported types: ${Object.keys(ROUTING_LABEL_MAP).join(', ')}.`,
    );

  return definition;
};

export default withErrorBoundary<typeof getRoutingLabel>(getRoutingLabel);
