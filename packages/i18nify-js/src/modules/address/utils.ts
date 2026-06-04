import type { AddressCodeType } from './types';
import ADDRESS_INFO from './data/addressConfig.json';

export const getAddressInfo = (code: AddressCodeType) =>
  (ADDRESS_INFO as Record<string, unknown>)[code] ?? null;
