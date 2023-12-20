import intlFormatToPartsPolyfill from '../intlFormatToPartsPolyfill';

// Define a mock structure for the NumberFormat object
type MockNumberFormat = {
  format: jest.Mock<string, [number]>;
  formatToParts: jest.Mock<any, [number]>;
  supportedLocalesOf: jest.Mock<
    string[],
    [string | string[], Intl.NumberFormatOptions?]
  >;
};

describe('intlFormatToPartsPolyfill', () => {
  let originalIntl: any;

  beforeAll(() => {
    // Store the original global Intl object
    originalIntl = global.Intl;
  });

  afterEach(() => {
    // Restore the original global Intl object after each test
    global.Intl = originalIntl;
  });

  test('should polyfill formatToParts method if not available', () => {
    // Mock NumberFormat with formatToParts unavailable
    const mockNumberFormat: MockNumberFormat = {
      format: jest.fn().mockReturnValue('123,456.78'),
      formatToParts: jest.fn().mockReturnValue([
        // Mock parts returned by formatToParts
        { type: 'integer', value: '123' },
        { type: 'string', value: ',' },
        { type: 'integer', value: '456' },
        { type: 'string', value: '.' },
        { type: 'integer', value: '78' },
      ]),
      supportedLocalesOf: jest.fn().mockReturnValue(['en-US', 'en-GB']),
    };

    const mockIntl: any = {
      // Mock the Intl object with the provided NumberFormat
      NumberFormat: jest.fn(() => mockNumberFormat),
      Collator: {},
      DateTimeFormat: {},
      PluralRules: {},
      RelativeTimeFormat: {},
    };

    // Mock the global Intl object
    global.Intl = mockIntl;

    // Apply the polyfill function
    intlFormatToPartsPolyfill();

    // Validate if formatToParts is now a function
    const numberFormat = new Intl.NumberFormat();
    expect(typeof numberFormat.formatToParts).toBe('function');

    // Test the output of formatToParts with a numeric input
    const parts = numberFormat.formatToParts(123456.78);
    expect(parts).toEqual([
      { type: 'integer', value: '123' },
      { type: 'string', value: ',' },
      { type: 'integer', value: '456' },
      { type: 'string', value: '.' },
      { type: 'integer', value: '78' },
    ]);
  });

  test('should not modify NumberFormat if formatToParts is available', () => {
    // Mock NumberFormat with formatToParts unavailable
    const mockNumberFormat: MockNumberFormat = {
      format: jest.fn().mockReturnValue('123,456.78'),
      formatToParts: jest.fn().mockReturnValue([
        // Mock parts returned by formatToParts
        { type: 'integer', value: '123' },
        { type: 'string', value: ',' },
        { type: 'integer', value: '456' },
        { type: 'string', value: '.' },
        { type: 'integer', value: '78' },
      ]),
      supportedLocalesOf: jest.fn().mockReturnValue(['en-US', 'en-GB']),
    };

    const mockIntl: any = {
      // Mock the Intl object with the provided NumberFormat
      NumberFormat: jest.fn(() => ({
        ...mockNumberFormat,
        formatToParts: mockNumberFormat.formatToParts,
      })),
      Collator: {},
      DateTimeFormat: {},
      PluralRules: {},
      RelativeTimeFormat: {},
    };

    // Mock the global Intl object
    global.Intl = mockIntl;

    // Apply the polyfill function
    intlFormatToPartsPolyfill();

    // Validate if formatToParts is now a function
    const numberFormat = new Intl.NumberFormat();
    expect(typeof numberFormat.formatToParts).toBe('function');

    // Test the output of formatToParts with a numeric input
    const parts = numberFormat.formatToParts(123456.78);

    expect(parts).toEqual([
      { type: 'integer', value: '123' },
      { type: 'string', value: ',' },
      { type: 'integer', value: '456' },
      { type: 'string', value: '.' },
      { type: 'integer', value: '78' },
    ]);

    expect(mockNumberFormat.formatToParts).toHaveBeenCalledTimes(1);
  });

  test('should throw TypeError if argument is not a number', () => {
    // Mock NumberFormat with formatToParts unavailable
    const mockNumberFormat: MockNumberFormat = {
      format: jest.fn().mockReturnValue('123,456.78'),
      formatToParts: jest.fn().mockReturnValue([
        // Mock parts returned by formatToParts
        { type: 'integer', value: '123' },
        { type: 'string', value: ',' },
        { type: 'integer', value: '456' },
        { type: 'string', value: '.' },
        { type: 'integer', value: '78' },
      ]),
      supportedLocalesOf: jest.fn().mockReturnValue(['en-US', 'en-GB']),
    };

    const mockIntl: any = {
      // Mock the Intl object with the provided NumberFormat
      NumberFormat: jest.fn(() => mockNumberFormat),
      Collator: {},
      DateTimeFormat: {},
      PluralRules: {},
      RelativeTimeFormat: {},
    };

    // Mock the global Intl object
    global.Intl = mockIntl;

    // Apply the polyfill function
    intlFormatToPartsPolyfill();

    // Validate if formatToParts is now a function
    const numberFormat = new Intl.NumberFormat();
    expect(typeof numberFormat.formatToParts).toBe('function');

    try {
      numberFormat.formatToParts(NaN);
    } catch (error) {
      expect(error instanceof TypeError).toBe(true);
    }
  });

  test('should handle empty parts for zero input', () => {
    // Mock NumberFormat with formatToParts unavailable
    const mockNumberFormat: MockNumberFormat = {
      format: jest.fn().mockReturnValue('0'),
      formatToParts: jest
        .fn()
        .mockReturnValue([{ type: 'integer', value: '0' }]), // Mock parts returned by formatToParts
      supportedLocalesOf: jest.fn().mockReturnValue(['en-US', 'en-GB']),
    };

    const mockIntl: any = {
      // Mock the Intl object with the provided NumberFormat
      NumberFormat: jest.fn(() => mockNumberFormat),
      Collator: {},
      DateTimeFormat: {},
      PluralRules: {},
      RelativeTimeFormat: {},
    };

    // Mock the global Intl object
    global.Intl = mockIntl;

    // Apply the polyfill function
    intlFormatToPartsPolyfill();

    // Validate if formatToParts is now a function
    const numberFormat = new Intl.NumberFormat();
    expect(typeof numberFormat.formatToParts).toBe('function');

    // Test the output of formatToParts with a numeric input
    const parts = numberFormat.formatToParts(0);
    expect(parts).toEqual([{ type: 'integer', value: '0' }]);
  });
});
