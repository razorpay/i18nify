import { LIST_OF_ALL_COUNTRIES } from './data/listOfAllCountries';

export function isCountryValid(_countryCode: string): boolean {
  const countryCode = _countryCode.toUpperCase();
  // @ts-expect-error countryCode here can be a random string
  return LIST_OF_ALL_COUNTRIES.includes(countryCode);
}
