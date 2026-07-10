import { withErrorBoundary } from '../../common/errorBoundary';
import { getAddressInfo } from './getAddressInfo';
import { AddressCodeType, AddressType, AddressComponents } from './types';

/**
 * Formats address components using the country-specific template from country metadata.
 * Empty component fields substitute as blank strings; lines that become empty
 * after substitution are removed from the output.
 */
const formatAddressByCountry = (
  countryCode: string,
  components: AddressComponents,
): string => {
  const trimmed = countryCode.trim();
  if (trimmed === '') {
    throw new Error('formatAddressByCountry: country code must not be empty.');
  }
  const code = trimmed.toUpperCase() as AddressCodeType;

  const addressInfo = getAddressInfo(code) as AddressType | null;

  if (!addressInfo) {
    throw new Error(
      `formatAddressByCountry: address format for country code "${code}" not found.`,
    );
  }

  // Replace each {placeholder} token in the template with the matching component value.
  const substituted = addressInfo.address_template
    .replace(/{name}/g, components.name ?? '')
    .replace(/{organization}/g, components.organization ?? '')
    .replace(/{street_address}/g, components.street_address ?? '')
    .replace(/{city}/g, components.city ?? '')
    .replace(/{state}/g, components.state ?? '')
    .replace(/{zip}/g, components.zip ?? '')
    .replace(/{district}/g, components.district ?? '')
    .replace(/{sorting_code}/g, components.sorting_code ?? '');

  // Split into lines and drop any that are blank — happens when optional fields are empty.
  return substituted
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

export default withErrorBoundary<typeof formatAddressByCountry>(
  formatAddressByCountry,
);
