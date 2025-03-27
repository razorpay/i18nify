import { LOCALS_LIST } from 'src/components/LocalDropdown/constants';

export const getNumberSupportedLocals = () => {
  const supportedNumberLocales = Intl.NumberFormat.supportedLocalesOf(
    LOCALS_LIST.map((language) => language.locales.flat()).flat(),
  );

  return supportedNumberLocales;
};

export const getDateTimeSupportedLocals = () => {
  const supportedDateLocales = Intl.DateTimeFormat.supportedLocalesOf(
    LOCALS_LIST.map((language) => language.locales.flat()).flat(),
  );

  return supportedDateLocales;
};

export const getSupportedLocalsObjectStructure = (locales) => {
  const supportedLocalsObjectStructure = LOCALS_LIST.map((language) => {
    const supportedLocales = language.locales.filter((locale) =>
      locales.includes(locale),
    );

    if (supportedLocales.length > 0) {
      return {
        language: language.language,
        locales: supportedLocales,
      };
    }
    return null;
  }).filter((item) => item !== null);
  return supportedLocalsObjectStructure;
};
