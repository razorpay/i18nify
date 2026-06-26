import {
  BusinessEntityData,
  CategoriesFileData,
  EntityTypesFileData,
} from './types';
import { I18NIFY_DATA_SOURCE } from '../shared';

export const getBusinessEntityData = async (): Promise<BusinessEntityData> => {
  const [categoriesRes, entityTypesRes] = await Promise.all([
    fetch(`${I18NIFY_DATA_SOURCE}/business_entity/categories_data.json`),
    fetch(`${I18NIFY_DATA_SOURCE}/business_entity/entity_types_data.json`),
  ]);

  if (!categoriesRes.ok) {
    throw new Error(
      `Failed to load business entity categories data: HTTP ${categoriesRes.status}`,
    );
  }
  if (!entityTypesRes.ok) {
    throw new Error(
      `Failed to load business entity types data: HTTP ${entityTypesRes.status}`,
    );
  }

  const [categoriesData, entityTypesData] = (await Promise.all([
    categoriesRes.json(),
    entityTypesRes.json(),
  ])) as [CategoriesFileData, EntityTypesFileData];

  return {
    business_entity_information: {
      categories: categoriesData.categories,
      sub_categories: categoriesData.sub_categories,
      entity_types: entityTypesData.entity_types,
    },
  };
};
