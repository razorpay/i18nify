import { withErrorBoundary } from '../../common/errorBoundary';
import ADDRESS_INFO from './data/addressConfig.json';
import type { AddressCodeType } from './types';

const getAddressList = (): Record<AddressCodeType, (typeof ADDRESS_INFO)[AddressCodeType]> =>
  ADDRESS_INFO as Record<AddressCodeType, (typeof ADDRESS_INFO)[AddressCodeType]>;

export default withErrorBoundary<typeof getAddressList>(getAddressList);
