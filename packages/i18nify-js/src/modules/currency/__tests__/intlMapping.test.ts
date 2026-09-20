import { INTL_MAPPING } from '../constants';
import CURRENCY_INFO from '../data/currencyConfig.json';

describe('INTL_MAPPING', () => {
  it('maps every override to the curated symbol from i18nify-data', () => {
    for (const [code, mapping] of Object.entries(INTL_MAPPING)) {
      const curated = CURRENCY_INFO[code as keyof typeof CURRENCY_INFO].symbol;
      for (const replacement of Object.values(mapping)) {
        expect({ code, replacement }).toEqual({ code, replacement: curated });
      }
    }
  });
});
