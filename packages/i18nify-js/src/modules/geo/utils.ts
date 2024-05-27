import { COUNTRY_LIST_FOR_ALL_FLAGS } from './data/countryListForAllFlags';

export function isCountryValidForFlags(_countryCode: string): boolean {
  const countryCode = _countryCode.toUpperCase();
  // @ts-expect-error countryCode here can be a random string
  return COUNTRY_LIST_FOR_ALL_FLAGS.includes(countryCode);
}
