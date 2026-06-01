import { NamesData } from './types';
import { I18NIFY_DATA_SOURCE } from '../shared';

export const getNamesData = async (): Promise<NamesData> => {
  const res = await fetch(`${I18NIFY_DATA_SOURCE}/names/data.json`);
  if (!res.ok) {
    throw new Error(`Failed to load names data: HTTP ${res.status}`);
  }
  return (await res.json()) as NamesData;
};
