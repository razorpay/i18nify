import { version } from '../../../package.json';

export interface VersionMapping {
  country: string;
  bankcodes: string;
  currency: string;
  'phone-number': string;
}

interface VersionConfig {
  version: string;
  description: string;
  mappings: Record<string, VersionMapping>;
}

export async function getVersionedDataPath(
  dataType: keyof VersionMapping,
): Promise<string> {
  try {
    const versionMapResponse = await fetch(
      'https://raw.githubusercontent.com/razorpay/i18nify/master/i18nify-data/version-mapping.json',
    );
    const versionMap: VersionConfig = await versionMapResponse.json();

    const currentVersion = version;
    const versionMapping = versionMap.mappings[currentVersion];

    if (!versionMapping) {
      throw new Error(`Version ${currentVersion} not found in version mapping`);
    }

    return `/i18nify-data/${dataType}/${versionMapping[dataType]}`;
  } catch (error) {
    console.error('Error fetching version mapping:', error);
    throw error;
  }
}
