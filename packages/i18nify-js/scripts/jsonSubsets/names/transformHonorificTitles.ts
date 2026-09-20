/**
 * Creates a `code -> { default_locale, locales: { locale: { honorific_titles } } }`
 * map from the country metadata, keeping only locales that define honorific
 * titles, so that the names module does not bundle the full metadata file.
 */

export default () => {
  const DATA = require('#/i18nify-data/country/metadata/data.json');

  const metadata = DATA.metadata_information;

  const honorificTitles = Object.keys(metadata).reduce(
    (acc: Record<string, unknown>, code: string) => {
      const locales = metadata[code].locales ?? {};
      const withTitles = Object.keys(locales).reduce(
        (localeAcc: Record<string, unknown>, locale: string) => {
          const titles = locales[locale]?.honorific_titles;
          if (titles && titles.length > 0) {
            localeAcc[locale] = { honorific_titles: titles };
          }
          return localeAcc;
        },
        {},
      );
      if (Object.keys(withTitles).length > 0) {
        acc[code] = {
          default_locale: metadata[code].default_locale,
          locales: withTitles,
        };
      }
      return acc;
    },
    {},
  );

  return {
    data: honorificTitles,
    subsetFilePath: './src/modules/names/data/honorificTitles.json',
  };
};
