import loadPolyfills from '../index';
import intlFormatToPartsPolyfill from '../intlFormatToPartsPolyfill';

// Create a manual mock for the module
jest.mock('../intlFormatToPartsPolyfill', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Adjust the Window interface declaration to use a string literal type for 'import'
declare global {
  interface Window {
    import: (specifier: string) => Promise<any>;
  }
}

// Define a merged type to encompass both Window and global
declare const globalThis: Window & typeof global;

// Create a mock implementation for Intl.NumberFormat
class MockNumberFormat {
  format(number: number): string {
    // Simulate the formatting logic
    return number.toLocaleString();
  }

  formatToParts(number: number): Intl.NumberFormatPart[] {
    // Simulate the formatToParts logic
    const formattedString = this.format(number);

    // Mock implementation to split the formatted string into parts
    const parts: Intl.NumberFormatPart[] = formattedString
      .split(',')
      .map((value) => ({ type: 'integer', value }));

    return parts;
  }

  // Simulated supportedLocalesOf static method
  static supportedLocalesOf(locales: string | string[]): string[] {
    // Simulate the behavior of supportedLocalesOf
    return [];
  }
}

describe('loadPolyfills', () => {
  test('should not modify Intl.NumberFormat if formatToParts is already available', async () => {
    // Mock the import function
    const importMock = jest.fn().mockResolvedValue({
      default: jest.fn(),
    });

    // Mock the global "import" function used in loadPolyfills
    (globalThis as any).import = importMock;

    // Call the loadPolyfills function
    await loadPolyfills();

    // Get the prototype of Intl.NumberFormat
    const prototype = Object.getPrototypeOf(new Intl.NumberFormat());

    // Retrieve the formatToParts method
    const formatToPartsMethod = prototype.formatToParts;

    // Check if formatToParts exists and hasn't been replaced by the mock implementation
    const isFormatToPartsAvailable =
      typeof formatToPartsMethod === 'function' &&
      formatToPartsMethod !== MockNumberFormat.prototype.formatToParts;

    // Expect formatToParts to be available and not equal to the mock implementation
    expect(isFormatToPartsAvailable).toBe(true);

    // Check if the function was called
    expect(intlFormatToPartsPolyfill).not.toHaveBeenCalled();
  });

  test('should define formatToParts on Intl.NumberFormat if not available', async () => {
    // Mock the global Intl object
    (globalThis as any).Intl.NumberFormat.prototype.formatToParts = undefined;

    // Call the loadPolyfills function
    await loadPolyfills();

    // Get the prototype of Intl.NumberFormat
    const prototype = Object.getPrototypeOf(new Intl.NumberFormat());

    // Retrieve the formatToParts method
    const formatToPartsMethod = prototype.formatToParts;

    // Check if formatToParts doesn't exists and has been replaced by the mock implementation
    const isFormatToPartsAvailable =
      typeof formatToPartsMethod === 'function' &&
      formatToPartsMethod !== MockNumberFormat.prototype.formatToParts;

    // Expect formatToParts to be available and  equal to the mock implementation
    expect(isFormatToPartsAvailable).toBe(false);

    // Check if the function was called
    expect(intlFormatToPartsPolyfill).toHaveBeenCalled();
  });
});
