export const FLAG_4X3_BASE_PATH =
  'https://unpkg.com/@razorpay/i18nify-js/lib/assets/flags';
export const FLAG_BASE_PATH = 'https://flagcdn.com';

import { getVersionedDataPath, VersionMapping } from './versionConfig';

export const I18NIFY_DATA_SOURCE =
  'https://raw.githubusercontent.com/razorpay/i18nify/master';

export async function getVersionedDataSource(
  dataType: keyof VersionMapping,
): Promise<string> {
  try {
    const versionedPath = await getVersionedDataPath(dataType);
    return `${I18NIFY_DATA_SOURCE}${versionedPath.startsWith('/') ? versionedPath : `/${versionedPath}`}`;
  } catch (error) {
    console.error('Error getting versioned data source:', error);
    throw error;
  }
}

export const I18NIFY_DATA_SUPPORTED_COUNTRIES = ['IN', 'MY', 'SG', 'US'];
