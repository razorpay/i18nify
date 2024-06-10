import { INTL_MAPPING } from '../constants';
import { ByParts } from '../types';
import { configureIntlFromI18nifyData } from '../utils';
import { getMockParts } from './mocks/configureIntlFromI18nifyData';

describe('configureIntlFromI18nifyData', () => {
  Object.keys(INTL_MAPPING).forEach((currencyCode) => {
    const mapping = INTL_MAPPING[currencyCode as keyof typeof INTL_MAPPING];
    const symbolKey = Object.keys(mapping)[0] as keyof typeof mapping;
    const mockParts = getMockParts(symbolKey as string);
    const expectedParts = [
      { type: 'currency', value: mapping[symbolKey] },
      { type: 'integer', value: '1000' },
      { type: 'decimal', value: '.' },
      { type: 'fraction', value: '00' },
    ];

    it(`should replace the currency symbol with the value from INTL_MAPPING for ${currencyCode}`, () => {
      const result = configureIntlFromI18nifyData(mockParts, currencyCode);
      expect(result).toEqual(expectedParts);
    });
  });

  it('should not modify parts if currency code is not in INTL_MAPPING', () => {
    const currencyCode = 'XYZ';
    const mockParts = getMockParts('$');
    const result = configureIntlFromI18nifyData(mockParts, currencyCode);
    expect(result).toEqual(mockParts);
  });

  it('should not modify parts if there is no matching value in INTL_MAPPING', () => {
    const mockPartsWithDifferentCurrencySymbol: ByParts['rawParts'] = [
      { type: 'currency', value: '€' },
      { type: 'integer', value: '1000' },
      { type: 'decimal', value: '.' },
      { type: 'fraction', value: '00' },
    ];

    const currencyCode = 'SGD';
    const result = configureIntlFromI18nifyData(
      mockPartsWithDifferentCurrencySymbol,
      currencyCode,
    );
    expect(result).toEqual(mockPartsWithDifferentCurrencySymbol);
  });
});
