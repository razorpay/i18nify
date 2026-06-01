import { BusinessEntityData } from './types';
import { I18NIFY_DATA_SOURCE } from '../shared';

export const getBusinessEntityData = async (): Promise<BusinessEntityData> => {
  const res = await fetch(`${I18NIFY_DATA_SOURCE}/business_entity/data.json`);
  if (!res.ok) {
    throw new Error(`Failed to load business entity data: HTTP ${res.status}`);
  }
  return (await res.json()) as BusinessEntityData;
};
