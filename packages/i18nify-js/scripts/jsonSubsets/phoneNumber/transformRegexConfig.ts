/**
 * Creates a smaller json regex configuration from parent i18nify-data. 
 * 
 * @example
 * {"IN": {
      "dial_code": "+91",
      "format": "xxxx xxxxxx",
      "regex": "^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$"
      }
    }
    transforms to 
    { "IN": "^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$" }
 * 
 */
module.exports = () => {
  const DATA = require('#/i18nify-data/phone-number/country-code-to-phone-number/data.json');

  const countryData = DATA.country_tele_information;
  const regexData = Object.keys(DATA.country_tele_information).reduce(
    (acc: any, curr) => {
      acc[curr] = countryData[curr].regex;
      return acc;
    },
    {},
  );

  return {
    data: regexData,
    subsetFilePath: './src/modules/phoneNumber/data/phoneRegexMapper.json',
  };
};
