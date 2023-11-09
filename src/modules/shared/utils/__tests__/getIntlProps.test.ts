import { getIntlProps } from '../getIntlProps';

describe('getIntlProps', () => {
  it('should return a valid Intl.NumberFormat object', () => {
    const intlProps = getIntlProps();
    expect(intlProps).toBeInstanceOf(Intl.NumberFormat);
  });

  it('should use the provided locale', () => {
    const locale = 'fr-FR';
    const intlProps = getIntlProps({ locale });
    expect(intlProps.resolvedOptions().locale).toBe(locale);
  });

  it('should use the browser locale if no locale is provided', () => {
    const intlProps = getIntlProps();
    const browserLocale = navigator.languages
      ? navigator.languages[0]
      : navigator.language;
    expect(intlProps.resolvedOptions().locale).toBe(browserLocale);
  });

  it('should handle currency options', () => {
    const currency = 'EUR';
    const intlProps = getIntlProps({ currency });
    const resolvedOptions = intlProps.resolvedOptions();
    expect(resolvedOptions.style).toBe('currency');
    expect(resolvedOptions.currency).toBe(currency);
  });

  it('should throw an error if Intl is not supported', () => {
    // Mocking the browser environment to trigger the error
    delete window.Intl;
    expect(() => getIntlProps()).toThrow('Intl is not defined');
  });
});
