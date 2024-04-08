/**
 * Creates a smaller json formatter configuration from parent i18nify-data. 
 * 
 * @example
 * {"IN": {
      "dial_code": "+91",
      "format": "xxxx xxxxxx",
      "regex": "^(?:(?:\\+|0{0,2})91\\s*[-]?\\s*|[0]?)?[6789]\\d{9}$"
      }
    }
    transforms to 
    { "IN": "xxxx xxxxxx" }
 * 
 */
module.exports = () => {
  const DATA = require('#/i18nify-data/phone-number/country-code-to-phone-number/data.json');

  const countryData = DATA.country_tele_information;
  const formatterData = Object.keys(DATA.country_tele_information).reduce(
    (acc: any, curr) => {
      acc[curr] = countryData[curr].format;
      return acc;
    },
    {},
  );

  return {
    data: formatterData,
    subsetFilePath: './src/modules/phoneNumber/data/phoneFormatterMapper.json',
  };
};
