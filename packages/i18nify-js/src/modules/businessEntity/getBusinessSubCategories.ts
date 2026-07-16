import { withErrorBoundary } from '../../common/errorBoundary';
import { BusinessSubCategory } from './types';
import { getBusinessEntityData } from './data';

/**
 * Returns sub-categories for a given business category code.
 *
 * @param {string} categoryCode - The business category code (e.g., "CORPORATION")
 * @returns {Promise<BusinessSubCategory[]>} Array of sub-categories
 *
 * @throws {Error} When categoryCode is empty or unknown
 *
 * @example
 * const subs = await getBusinessSubCategories('CORPORATION');
 * // [{ code: 'C_CORPORATION', name: 'C Corporation', description: '...' }, ...]
 */
const getBusinessSubCategories = async (
  categoryCode: string,
): Promise<BusinessSubCategory[]> => {
  const code = categoryCode?.trim().toUpperCase();
  if (!code) {
    throw new Error('categoryCode must not be empty');
  }

  const data = await getBusinessEntityData().catch((err) => {
    throw new Error(
      `An error occurred while fetching business entity data. The error details are: ${err.message}.`,
    );
  });

  const subs = data.business_entity_information.sub_categories[code];
  if (!subs) {
    throw new Error(`Unknown category code: "${code}"`);
  }
  return subs;
};

export default withErrorBoundary<typeof getBusinessSubCategories>(
  getBusinessSubCategories,
);
