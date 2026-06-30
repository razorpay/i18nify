import {
  BusinessEntityData,
  CategoriesFileData,
  EntityTypesFileData,
} from './types';
import { I18NIFY_DATA_SOURCE } from '../shared';

export const getBusinessEntityData = async (): Promise<BusinessEntityData> => {
  const [categoriesRes, entityTypesRes] = await Promise.all([
    fetch(`${I18NIFY_DATA_SOURCE}/business_entity/categories/data.json`),
    fetch(`${I18NIFY_DATA_SOURCE}/business_entity/entity_types/data.json`),
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

  // Stored data wraps each map value in an { items: [...] } object (required so
  // the JSON validates against the proto3 schema). Unwrap back to plain arrays.
  const unwrapItems = <T>(
    grouped: Record<string, { items: T[] }>,
  ): Record<string, T[]> =>
    Object.keys(grouped || {}).reduce<Record<string, T[]>>((acc, key) => {
      acc[key] = (grouped[key] && grouped[key].items) || [];
      return acc;
    }, {});

  return {
    business_entity_information: {
      categories: categoriesData.categories,
      sub_categories: unwrapItems(categoriesData.sub_categories),
      entity_types: unwrapItems(entityTypesData.entity_types),
    },
  };
};
