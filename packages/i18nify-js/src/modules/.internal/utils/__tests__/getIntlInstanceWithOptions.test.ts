import { getIntlInstanceWithOptions } from '..';

// Mock getLocale to return empty string
jest.mock('..', () => {
  const actual = jest.requireActual('..');
  return {
    ...actual,
    getLocale: jest.fn().mockImplementation((options) => {
      if (options?.locale) {
        return options.locale;
      }
      return undefined;
    }),
  };
});

describe('getIntlInstanceWithOptions', () => {
  let originalNavigator: any;

  beforeEach(() => {
    // Store original navigator
    originalNavigator = { ...window.navigator };

    // Reset any mocks before each test
    jest.resetModules();
    jest.clearAllMocks();
    // Restore Intl object if it was deleted
    if (!window.Intl) {
      window.Intl = require('intl');
    }
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  it('should return a valid Intl.NumberFormat object', () => {
    const intlProps = getIntlInstanceWithOptions({ locale: 'en-US' });
    expect(intlProps).toBeInstanceOf(Intl.NumberFormat);
  });

  it('should use the provided locale', () => {
    const locale = 'fr-FR';
    const intlProps = getIntlInstanceWithOptions({ locale });
    expect(intlProps.resolvedOptions().locale).toBe(locale);
  });

  it('should handle currency options', () => {
    const currency = 'EUR';
    const intlProps = getIntlInstanceWithOptions({ currency, locale: 'en-US' });
    const resolvedOptions = intlProps.resolvedOptions();
    expect(resolvedOptions.style).toBe('currency');
    expect(resolvedOptions.currency).toBe(currency);
  });

  it('should handle intlOptions parameter', () => {
    const intlOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    const intlProps = getIntlInstanceWithOptions({
      intlOptions,
      locale: 'en-US',
    });
    const resolvedOptions = intlProps.resolvedOptions();
    expect(resolvedOptions.minimumFractionDigits).toBe(2);
    expect(resolvedOptions.maximumFractionDigits).toBe(2);
  });

  it('should handle currency from intlOptions', () => {
    const intlOptions = {
      currency: 'USD',
    };
    const intlProps = getIntlInstanceWithOptions({
      intlOptions,
      locale: 'en-US',
    });
    const resolvedOptions = intlProps.resolvedOptions();
    expect(resolvedOptions.style).toBe('currency');
    expect(resolvedOptions.currency).toBe('USD');
  });

  it('should throw an error if locale is falsy', () => {
    // Mock navigator to return empty values
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        language: '',
        languages: [],
      },
      writable: true,
    });

    expect(() => getIntlInstanceWithOptions()).toThrow(
      'The provided locale value is invalid. The received value was: undefined. Please ensure you pass a correct locale string for proper formatting.',
    );
  });

  it('should throw an error if Intl is not supported', () => {
    delete (window as any).Intl;
    expect(() => getIntlInstanceWithOptions()).toThrow('Intl is not defined');
  });
});
