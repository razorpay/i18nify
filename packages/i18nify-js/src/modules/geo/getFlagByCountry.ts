import fs from 'fs';
import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Retrieves the SVG string for a given country code using dynamic import.
 * SVGs are loaded on demand.
 *
 * @param countryCode The country code of the flag to retrieve.
 * @returns A promise that resolves to the SVG string for the given country code.
 */
const getFlagByCountry = async (countryCode: string) => {
  const code = countryCode.toUpperCase();

  const filePath = `packages/i18nify-js/src/modules/geo/data/countryFlagSvgs/${code}.svg`;

  try {
    const svgContent = fs.readFileSync(filePath, 'utf8');
    return svgContent;
  } catch (error) {
    console.error(`Couldn't find svg for ${countryCode}`);
    throw error;
  }
};

export default withErrorBoundary<typeof getFlagByCountry>(
  getFlagByCountry,
);
