const fs = require('fs');
const path = require('path');
const protobuf = require('protobufjs');

/*
  This validation script validates data files against their respective proto schema files.

  The script:
  1. Finds all proto files in i18nify-data directories
  2. For each proto file, finds the corresponding data files
  3. Validates the JSON data against the proto schema structure

  Directory structure expected:
  - i18nify-data/{package}/proto/*.proto - proto schema files
  - i18nify-data/{package}/data.json OR i18nify-data/{package}/*.json - data files
*/

interface ValidationFile {
  proto_file: string;
  data_file: string;
  package_name: string;
}

interface ProtoConfig {
  protoPath: string;
  dataPattern: 'single' | 'multiple';  // single = data.json, multiple = *.json files
  rootMessageName: string;
}

// Configuration for each data package
const PACKAGE_CONFIGS: Record<string, ProtoConfig> = {
  'bankcodes': {
    protoPath: 'i18nify-data/bankcodes/proto/bankcodes.proto',
    dataPattern: 'multiple',
    rootMessageName: 'BankCodes'
  },
  'currency': {
    protoPath: 'i18nify-data/currency/proto/currency.proto',
    dataPattern: 'single',
    rootMessageName: 'CurrencyData'
  },
  'country/metadata': {
    protoPath: 'i18nify-data/country/metadata/proto/country_metadata.proto',
    dataPattern: 'single',
    rootMessageName: 'CountryMetadataData'
  },
  'country/subdivisions': {
    protoPath: 'i18nify-data/country/subdivisions/proto/country_subdivisions.proto',
    dataPattern: 'multiple',
    rootMessageName: 'CountrySubdivisions'
  },
  'phone-number/country-code-to-phone-number': {
    protoPath: 'i18nify-data/phone-number/country-code-to-phone-number/proto/country_phone_info.proto',
    dataPattern: 'single',
    rootMessageName: 'CountryPhoneData'
  },
  'phone-number/dial-code-to-country': {
    protoPath: 'i18nify-data/phone-number/dial-code-to-country/proto/dial_code_to_country.proto',
    dataPattern: 'single',
    rootMessageName: 'DialCodeToCountryData'
  }
};

function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function getDataFiles(packagePath: string, pattern: 'single' | 'multiple'): string[] {
  const baseDir = path.join('i18nify-data', packagePath);
  
  if (pattern === 'single') {
    const dataFile = path.join(baseDir, 'data.json');
    return fileExists(dataFile) ? [dataFile] : [];
  }
  
  // Multiple files - find all JSON files except schema.json
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(baseDir);
    for (const entry of entries) {
      if (entry.endsWith('.json') && entry !== 'schema.json') {
        files.push(path.join(baseDir, entry));
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

async function validateWithProto(
  protoPath: string,
  rootMessageName: string,
  dataFile: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // Load proto definition
    const root = await protobuf.load(protoPath);
    const MessageType = root.lookupType(rootMessageName);
    
    // Read JSON data
    const jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    
    // Verify the message structure
    const errMsg = MessageType.verify(jsonData);
    
    if (errMsg) {
      return { valid: false, error: errMsg };
    }
    
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

async function main() {
  // Read changed files from input
  if (process.argv.length < 3) {
    console.error('Please provide a file path as a command line argument.');
    process.exit(1);
  }
  
  const filePath: string = process.argv[2];
  const fileString = fs.readFileSync(filePath, 'utf8');
  const changedFiles = fileString.split('\n').filter((f: string) => f.trim());
  
  // Determine which packages need validation based on changed files
  const packagesToValidate = new Set<string>();
  
  for (const file of changedFiles) {
    for (const packageName of Object.keys(PACKAGE_CONFIGS)) {
      const packageDir = `i18nify-data/${packageName}`;
      if (file.startsWith(packageDir)) {
        packagesToValidate.add(packageName);
        break;
      }
    }
  }
  
  if (packagesToValidate.size === 0) {
    console.log('ℹ️  No data packages changed, skipping validation');
    process.exit(0);
  }
  
  console.log(`📦 Validating ${packagesToValidate.size} package(s)...\n`);
  
  let hasErrors = false;
  
  for (const packageName of packagesToValidate) {
    const config = PACKAGE_CONFIGS[packageName];
    
    if (!fileExists(config.protoPath)) {
      console.log(`⚠️  ${packageName}: No proto file found at ${config.protoPath}`);
      continue;
    }
    
    const dataFiles = getDataFiles(packageName, config.dataPattern);
    
    if (dataFiles.length === 0) {
      console.log(`⚠️  ${packageName}: No data files found`);
      continue;
    }
    
    for (const dataFile of dataFiles) {
      const result = await validateWithProto(
        config.protoPath,
        config.rootMessageName,
        dataFile
      );
      
      if (result.valid) {
        console.log(`✅ ${dataFile} validates against ${config.protoPath}`);
      } else {
        hasErrors = true;
        console.error(`❌ ${dataFile} validation failed: ${result.error}`);
      }
    }
  }
  
  if (hasErrors) {
    process.exit(1);
  }
  
  console.log('\n✨ All validations passed!');
}

main().catch((error) => {
  console.error('Validation error:', error);
  process.exit(1);
});
