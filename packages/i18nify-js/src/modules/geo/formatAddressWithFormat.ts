import { withErrorBoundary } from '../../common/errorBoundary';
import { getAddressInfo } from './getAddressInfo';
import { AddressCodeType, AddressType, AddressComponents } from './types';

/**
 * Formats an address using the country-specific template from i18nify-data.
 *
 * The template contains {placeholder} tokens (e.g., `{name}`, `{city}`,
 * `{zip}`) that are substituted with the values in `components`. After
 * substitution, lines that are blank or contain only whitespace are removed
 * so optional fields do not leave empty rows in the result.
 *
 * The logic mirrors the Go FormatAddressWithFormat implementation in the
 * i18nify-go geo module — both produce identical output for the same input.
 *
 * @param {AddressCodeType} countryCode - ISO 3166-1 alpha-2 country code.
 * @param {AddressComponents} components - Address field values to substitute.
 * @returns {string} Formatted address string with lines joined by `\n`.
 * @throws {Error} If the country code is not found in the address data.
 *
 * @example
 * formatAddressWithFormat('US', {
 *   name: 'John Doe',
 *   street_address: '1600 Amphitheatre Pkwy',
 *   city: 'Mountain View',
 *   state: 'CA',
 *   zip: '94043',
 * });
 * // → "John Doe\n1600 Amphitheatre Pkwy\nMountain View, CA 94043"
 *
 * @example
 * formatAddressWithFormat('IN', {
 *   name: 'Rahul Sharma',
 *   organization: 'Razorpay',
 *   street_address: 'SJR Cyber, 22, Laskar Hosur Rd',
 *   city: 'Bengaluru',
 *   state: 'Karnataka',
 *   zip: '560102',
 * });
 */
const formatAddressWithFormat = (
  countryCode: string,
  components: AddressComponents,
): string => {
  // Cast to AddressCodeType for the address module's typed lookup.
  const addressInfo = getAddressInfo(
    countryCode as AddressCodeType,
  ) as AddressType | null;

  if (!addressInfo) {
    throw new Error(
      `formatAddressWithFormat: address format for country code "${countryCode}" not found.`,
    );
  }

  const template: string = addressInfo.template;

  const substituted = template
    .replace(/{name}/g, components.name || '')
    .replace(/{organization}/g, components.organization || '')
    .replace(/{street_address}/g, components.street_address || '')
    .replace(/{city}/g, components.city || '')
    .replace(/{state}/g, components.state || '')
    .replace(/{zip}/g, components.zip || '')
    .replace(/{district}/g, components.district || '')
    .replace(/{sorting_code}/g, components.sorting_code || '');

  return substituted
    .split('\n')
    .map(function (line) {
      return line.trim();
    })
    .filter(function (line) {
      return line.length > 0;
    })
    .join('\n');
};

export default withErrorBoundary<typeof formatAddressWithFormat>(
  formatAddressWithFormat,
);
