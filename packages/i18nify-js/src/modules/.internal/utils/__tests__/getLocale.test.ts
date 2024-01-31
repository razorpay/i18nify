import { getLocale } from '../getLocale';

const mockNavigator = (navigator: string): void => {
  Object.defineProperty(window, 'navigator', {
    value: navigator,
    writable: true,
  });
};

const mockNavigatorLanguage = (navigatorLanguage: string): void => {
  Object.defineProperty(window.navigator, 'language', {
    value: navigatorLanguage,
    writable: true,
  });
};

const mockNavigatorLanguages = (navigatorLanguages: string[]): void => {
  Object.defineProperty(window.navigator, 'languages', {
    value: navigatorLanguages,
    writable: true,
  });
};

describe('getLocale', () => {
  it('should return user locale in browser environment', () => {
    // Mocking browser environment with user language preference
    mockNavigatorLanguage('');
    mockNavigatorLanguages(['fr-FR', 'es-ES']);
    expect(getLocale()).toBe('fr-FR');
  });

  it('returns default locale when Intl object is not supported', () => {
    // Simulate browser environment without Intl object support
    mockNavigatorLanguage('fr-FR');
    mockNavigatorLanguages(['fr-FR', 'es-US']);
    (global as any).Intl = undefined;

    const result = getLocale();

    expect(result).toBe('en-IN');
  });

  it('returns default locale when user language preferences are not available', () => {
    // Simulate browser environment without user language preferences
    mockNavigatorLanguage('');
    mockNavigatorLanguages(['']);

    const result = getLocale();

    expect(result).toBe('en-IN');
  });

  it('should return "en-IN" for non-browser environment', () => {
    // Mocking a non-browser environment
    mockNavigator('');
    expect(getLocale()).toBe('en-IN');
  });
});
