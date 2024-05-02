import { getIntlInstanceWithOptions, getLocale } from '..';
import { setState } from '../../../core';

describe('getIntlInstanceWithOptions', () => {
  it('should return a valid Intl.NumberFormat object', () => {
    const intlProps = getIntlInstanceWithOptions();
    expect(intlProps).toBeInstanceOf(Intl.NumberFormat);
  });

  it('should use the provided locale', () => {
    const locale = 'fr-FR';
    const intlProps = getIntlInstanceWithOptions({ locale });
    expect(intlProps.resolvedOptions().locale).toBe(locale);
  });

  it('should use the browser locale if no locale is provided', () => {
    setState({ locale: '' });
    const intlProps = getIntlInstanceWithOptions();
    const browserLocale = getLocale();
    expect(intlProps.resolvedOptions().locale).toBe(browserLocale);
  });

  it('should handle currency options', () => {
    const currency = 'EUR';
    const intlProps = getIntlInstanceWithOptions({ currency });
    const resolvedOptions = intlProps.resolvedOptions();
    expect(resolvedOptions.style).toBe('currency');
    expect(resolvedOptions.currency).toBe(currency);
  });

  it('should throw an error if Intl is not supported', () => {
    delete (window as any).Intl;
    expect(() => getIntlInstanceWithOptions()).toThrow('Intl is not defined');
  });
});
