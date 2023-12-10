export const getLocale = (): string => {
  // Check if running in a non-browser environment (e.g., Node.js or older browsers).
  if (typeof navigator === 'undefined') {
    return 'en-IN';
  }

  // Check if the browser supports the Intl object and user language preferences.
  if (
    window.Intl &&
    typeof window.Intl === 'object' &&
    (window.navigator.languages || window.navigator.language)
  ) {
    const userLocales = window.navigator.languages || [
      window.navigator.language,
    ];
    return userLocales[0];
  }

  // Fallback to a supported locale or the default locale.
  return 'en-IN';
};
