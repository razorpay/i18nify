import type { AddressCodeType, AddressType } from './types';
import rawData from '#/i18nify-data/address/data.json';

const addressData = (rawData as unknown as { address_format_information: Record<string, AddressType> })
  .address_format_information;

export const getAddressInfo = (code: AddressCodeType): AddressType | null =>
  addressData[code] ?? null;
