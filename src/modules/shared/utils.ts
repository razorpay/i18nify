import { COUNTRY_LOCALES } from "./data/countryLocales";

export const getLocale = (): string => {
    // Define a list of supported locales.
  const supportedLocales = Object.values(COUNTRY_LOCALES);

  // Check if running in a non-browser environment (e.g., Node.js or older browsers).
  if (typeof navigator === 'undefined') {
    return 'en-US';
  }

  // Check if the browser supports the Intl object and user language preferences.
  if (window.Intl && typeof window.Intl === 'object') {
    const userLocales = window.navigator.languages || [window.navigator.language || window.navigator.userLanguage];

    for (const locale of userLocales) {
      const normalizedLocale = supportedLocales.find(supportedLocale =>
        locale.toLowerCase().startsWith(supportedLocale.toLowerCase())
      );

      if (normalizedLocale) {
        return normalizedLocale;
      }
    }
  }

  // Fallback to the user's primary language if available.
  if (navigator.language) {
    const userLanguage = navigator.language;
    const primaryLanguage = userLanguage.split('-')[0];
    if (supportedLocales.includes(primaryLanguage)) {
      return primaryLanguage;
    }
  }

  // Fallback to a supported locale or the default locale.
  return 'en-US';

}