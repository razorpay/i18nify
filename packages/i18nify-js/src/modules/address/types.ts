import ADDRESS_INFO from './data/addressConfig.json';

export type AddressCodeType = keyof typeof ADDRESS_INFO;

export interface AddressType {
  code: AddressCodeType;
  name: string;
}
