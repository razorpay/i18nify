import { withErrorBoundary } from '../../common/errorBoundary';
import { BusinessEntityType } from './types';
import { getBusinessEntityData } from './data';

/**
 * Returns the legal entity types available for a given ISO 3166-1 alpha-2 country code.
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (e.g., "IN", "US")
 * @returns {Promise<BusinessEntityType[]>} Array of entity types for the country
 *
 * @throws {Error} When countryCode is empty or unsupported
 *
 * @example
 * const types = await getBusinessEntityType('IN');
 * // [{ code: '2DVA', name: 'Cooperative Society', abbreviation: '', transliterated_name: 'Cooperative Society', language: 'en' }, ...]
 */
const getBusinessEntityType = async (
  countryCode: string,
): Promise<BusinessEntityType[]> => {
  const cc = countryCode?.trim().toUpperCase();
  if (!cc) {
    throw new Error('countryCode must not be empty');
  }

  const data = await getBusinessEntityData().catch((err) => {
    throw new Error(
      `An error occurred while fetching business entity data. The error details are: ${err.message}.`,
    );
  });

  const types = data.business_entity_information.entity_types[cc];
  if (!types) {
    throw new Error(`No entity types found for country code: "${cc}"`);
  }
  return types;
};

export default withErrorBoundary<typeof getBusinessEntityType>(
  getBusinessEntityType,
);
