import { withErrorBoundary } from '../../common/errorBoundary';

/**
 * Asynchronously retrieves the SVG content for a country's flag based on the country code.
 * It dynamically imports the SVG content from a specific path that relies on the country code.
 * If the specified SVG does not exist, it logs an error message and rethrows the error for further handling.
 *
 * @param countryCode The ISO country code (e.g., 'US', 'GB') for which to retrieve the flag SVG.
 * @returns {Promise<string>} A promise that resolves to the SVG content of the flag as a string.
 * @throws Will throw an error if the SVG file for the specified country code cannot be found.
 */
const getFlagByCountry = async (countryCode: string): Promise<string> => {
  try {
    // Dynamically import the SVG based on the country code. The path is constructed to match the naming convention of the SVG files.
    // The countryCode is transformed to uppercase to align with the expected file naming convention.
    const { default: countryFlagSvgContent } = await import(
      `./data/countryFlagSvgs/${countryCode.toUpperCase()}.ts`
    );

    // Return the SVG content directly if the import succeeds.
    return countryFlagSvgContent;
  } catch (error) {
    // Log an error message for debugging purposes if the SVG cannot be found.
    console.error(`Couldn't find svg for ${countryCode}`);

    // Rethrow the error to allow for further handling by the caller.
    throw error;
  }
};

export default withErrorBoundary<typeof getFlagByCountry>(getFlagByCountry);
