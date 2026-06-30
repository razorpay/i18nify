import { withErrorBoundary } from '../../common/errorBoundary';
import { BusinessCategory } from './types';
import { getBusinessEntityData } from './data';

/**
 * Returns all top-level business categories.
 *
 * @returns {Promise<BusinessCategory[]>} Array of business categories
 *
 * @example
 * const categories = await getBusinessCategories();
 * // [{ code: 'CORPORATION', name: 'Corporation', description: '...' }, ...]
 */
const getBusinessCategories = async (): Promise<BusinessCategory[]> => {
  const data = await getBusinessEntityData().catch((err) => {
    throw new Error(
      `An error occurred while fetching business entity data. The error details are: ${err.message}.`,
    );
  });
  return data.business_entity_information.categories;
};

export default withErrorBoundary<typeof getBusinessCategories>(
  getBusinessCategories,
);
