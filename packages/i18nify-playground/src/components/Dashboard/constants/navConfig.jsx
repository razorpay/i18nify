import { LANGUAGES } from 'src/context/constants';

export const getNavConfig = (selectedLanguage = LANGUAGES.JS) => {
  const prefix = `i18nify-${selectedLanguage.toLowerCase()}`;
  return [
    {
      title: `Overview`,
      path: `/${prefix}`,
    },
    {
      title: `Currency & Number`,
      path: `/${prefix}/number`,
      children: [
        { title: `formatNumber`, path: `/${prefix}/number/formatNumber` },
        {
          title: `formatNumberByParts`,
          path: `/${prefix}/number/formatNumberByParts`,
        },
        { title: `getCurrencyList`, path: `/${prefix}/number/getCurrencyList` },
        {
          title: `getCurrencySymbol`,
          path: `/${prefix}/number/getCurrencySymbol`,
        },
        {
          title: `convertToMajorUnit`,
          path: `/${prefix}/number/convertToMajorUnit`,
        },
        {
          title: `convertToMinorUnit`,
          path: `/${prefix}/number/convertToMinorUnit`,
        },
      ],
    },
    {
      title: `Phone`,
      path: `/${prefix}/phone`,
      children: [
        {
          title: `isValidPhoneNumber`,
          path: `/${prefix}/phone/isValidPhoneNumber`,
        },
        {
          title: `formatPhoneNumber`,
          path: `/${prefix}/phone/formatPhoneNumber`,
        },
        {
          title: `parsePhoneNumber`,
          path: `/${prefix}/phone/parsePhoneNumber`,
        },
        { title: `getDialCodes`, path: `/${prefix}/phone/getDialCodes` },
        {
          title: `getDialCodeByCountryCode`,
          path: `/${prefix}/phone/getDialCodeByCountryCode`,
        },
        {
          title: `getMaskedPhoneNumber`,
          path: `/${prefix}/phone/getMaskedPhoneNumber`,
        },
      ],
    },
    {
      title: `Date`,
      path: `/${prefix}/date`,
      children: [
        { title: `formatDateTime`, path: `/${prefix}/date/formatDateTime` },
        { title: `getRelativeTime`, path: `/${prefix}/date/getRelativeTime` },
        { title: `getWeekdays`, path: `/${prefix}/date/getWeekdays` },
        { title: `parseDateTime`, path: `/${prefix}/date/parseDateTime` },
      ],
    },
    {
      title: `Geo`,
      path: `/${prefix}/geo`,
      children: [
        { title: `getFlagOfCountry`, path: `/${prefix}/geo/getFlagOfCountry` },
        {
          title: `getFlagsForAllCountries`,
          path: `/${prefix}/geo/getFlagsForAllCountries`,
        },
        { title: `getAllCountries`, path: `/${prefix}/geo/getAllCountries` },
        { title: `getStates`, path: `/${prefix}/geo/getStates` },
        { title: `getCities`, path: `/${prefix}/geo/getCities` },
        { title: `getZipcodes`, path: `/${prefix}/geo/getZipcodes` },
      ],
    },
    {
      title: `Salutation`,
      path: `/salutation`,
    },
    {
      title: `Localisation`,
      path: `/localisation`,
    },
    {
      title: `Bank codes`,
      path: `/${prefix}/banking`,
      children: [
        {
          title: `getBankCodes`,
          path: `/${prefix}/banking/getListOfBanks`,
        },
      ],
    },
  ];
};
