import type { AddressCodeType, AddressType, CountryMetaType } from './types';
import ADDRESS_TEMPLATES from './data/addressTemplates.json';

// Generated subset of the country metadata (scripts/jsonSubsets). Only read
// inside the function: a module-level property access would keep the data in
// every bundle that imports anything from the geo module.
const addressTemplates = ADDRESS_TEMPLATES as unknown as Record<
  string,
  Pick<CountryMetaType, 'country_name' | 'address_template'>
>;

export const getAddressInfo = (code: AddressCodeType): AddressType | null => {
  const countryInfo = addressTemplates[code];

  if (!countryInfo?.address_template) {
    return null;
  }

  return {
    country_name: countryInfo.country_name,
    address_template: countryInfo.address_template,
  };
};
