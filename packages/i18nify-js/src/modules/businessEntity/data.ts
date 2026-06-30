import { BusinessEntityData, BusinessEntityFileData } from './types';
import { I18NIFY_DATA_SOURCE } from '../shared';

export const getBusinessEntityData = async (): Promise<BusinessEntityData> => {
  const res = await fetch(`${I18NIFY_DATA_SOURCE}/business_entity/data.json`);

  if (!res.ok) {
    throw new Error(
      `Failed to load business entity data: HTTP ${res.status}`,
    );
  }

  const fileData = (await res.json()) as BusinessEntityFileData;

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
      categories: fileData.categories,
      sub_categories: unwrapItems(fileData.sub_categories),
      entity_types: unwrapItems(fileData.entity_types),
    },
  };
};
