import { withErrorBoundary } from '../../common/errorBoundary';
import formatAddress from './formatAddress';
import { getAddressInfo } from './getAddressInfo';
import { AddressCodeType, AddressType, AddressComponents } from './types';

/**
 * Formats address components using the country-specific template from country metadata.
 * Empty component fields substitute as blank strings; lines that become empty
 * after substitution are removed from the output.
 */
const formatAddressWithFormat = (
  countryCode: string,
  components: AddressComponents,
): string => {
  const trimmed = countryCode.trim();
  if (trimmed === '') {
    throw new Error('formatAddressWithFormat: country code must not be empty.');
  }
  const code = trimmed.toUpperCase() as AddressCodeType;

  const addressInfo = getAddressInfo(code) as AddressType | null;

  if (!addressInfo) {
    throw new Error(
      `formatAddressWithFormat: address format for country code "${code}" not found.`,
    );
  }

  // Reuse the base formatter so placeholder substitution and blank-line cleanup
  // stay defined in exactly one place for the JS geo module.
  return formatAddress(addressInfo.address_template, components);
};

export default withErrorBoundary<typeof formatAddressWithFormat>(
  formatAddressWithFormat,
);
