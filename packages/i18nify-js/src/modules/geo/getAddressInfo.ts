import type { AddressCodeType, AddressType, CountryMetaType } from './types';
import rawData from '#/i18nify-data/country/metadata/data.json';

const countryMetadata = (
  rawData as unknown as {
    metadata_information: Record<string, CountryMetaType>;
  }
).metadata_information;

export const getAddressInfo = (code: AddressCodeType): AddressType | null => {
  const countryInfo = countryMetadata[code];

  if (!countryInfo?.address_template) {
    return null;
  }

  return {
    country_name: countryInfo.country_name,
    address_template: countryInfo.address_template,
  };
};
