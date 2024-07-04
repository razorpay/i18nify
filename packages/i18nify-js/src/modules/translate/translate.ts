import { withErrorBoundary } from '../../common/errorBoundary';

// Cache to store loaded translations
const translationsCache: Record<string, Record<string, string>> = {};

/**
 * Dynamically loads the translations for the specified locale.
 * @param locale - The locale/country code for the translation.
 * @returns A promise that resolves to the translations object.
 */
async function loadTranslations(
  locale: string,
): Promise<Record<string, string>> {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }

  try {
    const translations = await import(
      `./i18n_bundles/translations/${locale}.json`
    );
    translationsCache[locale] = translations;
    return translations;
  } catch (error) {
    console.error(`Could not load translations for locale: ${locale}`, error);
    return {};
  }
}

/**
 * Translates the given text into the specified locale.
 * If a translation is not found, returns the original text.
 *
 * @param text - The text to be translated.
 * @param locale - The locale/country code for the translation.
 * @returns A promise that resolves to the translated text or the original text if no translation is found.
 */
async function translate(text: string, locale: string): Promise<string> {
  const translations = await loadTranslations(locale);

  if (translations && translations[text]) {
    return translations[text];
  }

  return text;
}

export default withErrorBoundary<typeof translate>(translate);
