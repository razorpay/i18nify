const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');

/*
  This validation script validates data files against their respective proto schema files.
*/

export interface ProtoConfig {
  protoPath: string;
  dataPattern: 'single' | 'multiple' | 'explicit';
  rootMessageName: string;
  files?: ValidationFileConfig[];
}

export interface ValidationFileConfig {
  dataFile: string;
  protoPath: string;
  rootMessageName: string;
}

// Configuration for each data package
export const PACKAGE_CONFIGS: Record<string, ProtoConfig> = {
  bankcodes: {
    protoPath: 'i18nify-data/bankcodes/proto/bankcodes.proto',
    dataPattern: 'multiple',
    rootMessageName: 'BankCodes',
  },
  currency: {
    protoPath: 'i18nify-data/currency/proto/currency.proto',
    dataPattern: 'single',
    rootMessageName: 'CurrencyData',
  },
  'country/metadata': {
    protoPath: 'i18nify-data/country/metadata/proto/country_metadata.proto',
    dataPattern: 'single',
    rootMessageName: 'CountryMetadataData',
  },
  'country/subdivisions': {
    protoPath:
      'i18nify-data/country/subdivisions/proto/country_subdivisions.proto',
    dataPattern: 'multiple',
    rootMessageName: 'CountrySubdivisions',
  },
  'phone-number/country-code-to-phone-number': {
    protoPath:
      'i18nify-data/phone-number/country-code-to-phone-number/proto/country_phone_info.proto',
    dataPattern: 'single',
    rootMessageName: 'CountryPhoneData',
  },
  'phone-number/dial-code-to-country': {
    protoPath:
      'i18nify-data/phone-number/dial-code-to-country/proto/dial_code_to_country.proto',
    dataPattern: 'single',
    rootMessageName: 'DialCodeToCountryData',
  },
  business_entity: {
    protoPath: 'i18nify-data/business_entity/proto/categories_data.proto',
    dataPattern: 'explicit',
    rootMessageName: 'CategoriesData',
    files: [
      {
        dataFile: 'i18nify-data/business_entity/categories_data.json',
        protoPath: 'i18nify-data/business_entity/proto/categories_data.proto',
        rootMessageName: 'CategoriesData',
      },
      {
        dataFile: 'i18nify-data/business_entity/entity_types_data.json',
        protoPath: 'i18nify-data/business_entity/proto/entity_types_data.proto',
        rootMessageName: 'EntityTypesData',
      },
    ],
  },
};

export function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function getDataFiles(
  packagePath: string,
  pattern: 'single' | 'multiple',
  baseDir: string = 'i18nify-data',
): string[] {
  const dir = path.join(baseDir, packagePath);

  if (pattern === 'single') {
    const dataFile = path.join(dir, 'data.json');
    return fileExists(dataFile) ? [dataFile] : [];
  }

  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.endsWith('.json') && entry !== 'schema.json') {
        files.push(path.join(dir, entry));
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

export function getValidationTargets(
  packageName: string,
  config: ProtoConfig,
): ValidationFileConfig[] {
  if (config.dataPattern === 'explicit') {
    return config.files || [];
  }

  return getDataFiles(packageName, config.dataPattern).map((dataFile) => ({
    dataFile,
    protoPath: config.protoPath,
    rootMessageName: config.rootMessageName,
  }));
}

export async function validateWithProto(
  protoPath: string,
  rootMessageName: string,
  dataFile: string,
): Promise<{ valid: boolean; error?: string }> {
  try {
    const root = await protobuf.load(protoPath);
    const MessageType = root.lookupType(rootMessageName);
    const jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    const errMsg = MessageType.verify(jsonData);

    if (errMsg) {
      return { valid: false, error: errMsg };
    }
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

export function getPackagesToValidate(
  changedFiles: string[],
  configs: Record<string, ProtoConfig> = PACKAGE_CONFIGS,
): Set<string> {
  const packagesToValidate = new Set<string>();

  for (const file of changedFiles) {
    for (const packageName of Object.keys(configs)) {
      const packageDir = `i18nify-data/${packageName}`;
      if (file.startsWith(packageDir)) {
        packagesToValidate.add(packageName);
        break;
      }
    }
  }

  return packagesToValidate;
}

// Main function - only runs when executed directly
async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide a file path as a command line argument.');
    process.exit(1);
  }

  const filePath: string = process.argv[2];
  const fileString = fs.readFileSync(filePath, 'utf8');
  const changedFiles = fileString.split('\n').filter((f: string) => f.trim());

  const packagesToValidate = getPackagesToValidate(changedFiles);

  if (packagesToValidate.size === 0) {
    console.log('ℹ️  No data packages changed, skipping validation');
    process.exit(0);
  }

  console.log(`📦 Validating ${packagesToValidate.size} package(s)...\n`);

  let hasErrors = false;

  for (const packageName of packagesToValidate) {
    const config = PACKAGE_CONFIGS[packageName];

    const validationTargets = getValidationTargets(packageName, config);

    if (validationTargets.length === 0) {
      console.log(`⚠️  ${packageName}: No data files found`);
      continue;
    }

    for (const target of validationTargets) {
      if (!fileExists(target.protoPath)) {
        console.log(
          `⚠️  ${packageName}: No proto file found at ${target.protoPath}`,
        );
        continue;
      }

      const result = await validateWithProto(
        target.protoPath,
        target.rootMessageName,
        target.dataFile,
      );

      if (result.valid) {
        console.log(
          `✅ ${target.dataFile} validates against ${target.protoPath}`,
        );
      } else {
        hasErrors = true;
        console.error(
          `❌ ${target.dataFile} validation failed: ${result.error}`,
        );
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log('\n✨ All validations passed!');
}

// Only run main when executed directly (not when imported)
if (require.main === module) {
  main().catch((error) => {
    console.error('Validation error:', error);
    process.exit(1);
  });
}
