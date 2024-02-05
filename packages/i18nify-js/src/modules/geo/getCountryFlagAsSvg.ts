import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Retrieves the SVG string for a given country code using dynamic import.
 * SVGs are loaded on demand.
 *
 * @param countryCode The country code of the flag to retrieve.
 * @returns A promise that resolves to the SVG string for the given country code.
 */
const getCountryFlagAsSvg = async (countryCode: string): Promise<string> => {
  const code = countryCode.toUpperCase();

  try {
    const svgModule = await import(`./data/${code}.svg`);
    return svgModule.default;
  } catch (error) {
    throw new Error(`Error loading the SVG for ${countryCode}: ${error}`);
  }
};

export default withErrorBoundary<typeof getCountryFlagAsSvg>(
  getCountryFlagAsSvg,
);
