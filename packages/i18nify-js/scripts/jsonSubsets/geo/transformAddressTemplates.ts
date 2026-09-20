/**
 * Creates a `code -> { country_name, address_template }` map from the country
 * metadata for the countries that define an address template, so that the geo
 * module does not bundle the full 600 KB metadata file.
 */

export default () => {
  const DATA = require('#/i18nify-data/country/metadata/data.json');

  const metadata = DATA.metadata_information;

  const addressTemplates = Object.keys(metadata).reduce(
    (
      acc: Record<string, { country_name: string; address_template: unknown }>,
      code: string,
    ) => {
      if (metadata[code].address_template) {
        acc[code] = {
          country_name: metadata[code].country_name,
          address_template: metadata[code].address_template,
        };
      }
      return acc;
    },
    {},
  );

  return {
    data: addressTemplates,
    subsetFilePath: './src/modules/geo/data/addressTemplates.json',
  };
};
