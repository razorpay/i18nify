const fs = require('fs');
const Ajv = require('ajv');

/*
  This validation script validates data files against their respective schema files.

  Note: Some packages have migrated to using proto files as schema definitions.
  For these packages, validation is handled at compile time by the proto compiler.
  This script will skip validation for packages without a schema.json file.

  Assumptions:
   - Packages with schema.json will be validated against it
   - Packages without schema.json (using proto) will be skipped
   - In data/country-zipcode folder, we have different files for different countries
     and have only one common schema.json file for all the country data files
*/

function isInterfaceInArray(arr: Files[], obj: Files): boolean {
  for (const item of arr) {
    if (
      item.schema_file === obj.schema_file &&
      item.data_file === obj.data_file
    ) {
      return true;
    }
  }
  return false;
}

function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function getFilesFromPath(filePath: string, fileName: string): Files | null {
  const ind = filePath.indexOf(fileName);
  const dir = filePath.slice(0, ind);
  const schema_file_path = dir + 'schema.json';
  const data_file_path = dir + 'data.json';
  
  // Skip if schema.json doesn't exist (package uses proto for schema)
  if (!fileExists(schema_file_path)) {
    console.log(`ℹ️  Skipping ${dir} - no schema.json (using proto schema)`);
    return null;
  }
  
  return {
    schema_file: schema_file_path,
    data_file: data_file_path,
  };
}

// Getting the country Data file along with the Scheme file from Country-zipcode folder
function getCountryZipcodesFilePaths(filePath: string, country: string): Files | null {
  const schema_file_path = filePath + 'schema.json';
  
  // Skip if schema.json doesn't exist
  if (!fileExists(schema_file_path)) {
    console.log(`ℹ️  Skipping ${filePath}${country}.json - no schema.json (using proto schema)`);
    return null;
  }
  
  return {
    schema_file: schema_file_path,
    data_file: filePath + country + '.json',
  };
}

class InvalidFilesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'In Valid Files Error';
  }
}

interface Files {
  schema_file: string;
  data_file: string;
}

//Reading File
if (process.argv.length < 3) {
  console.error('Please provide a file path as a command line argument.');
  process.exit(1);
}
const filePath: string = process.argv[2];
const fileString = fs.readFileSync(filePath, 'utf8');
const files = fileString.split('\n');

// Fetching the Files from the paths
const validation_files: Files[] = [];

for (let i = 0; i < files.length; i++) {
  const path = files[i];

  if (!path.includes('data/country-zipcode')) {
    if (path.includes('schema.json')) {
      const valid_files = getFilesFromPath(path, 'schema.json');
      if (valid_files && !isInterfaceInArray(validation_files, valid_files)) {
        validation_files.push(valid_files);
      }
    } else if (path.includes('data.json')) {
      const valid_files = getFilesFromPath(path, 'data.json');
      if (valid_files && !isInterfaceInArray(validation_files, valid_files)) {
        validation_files.push(valid_files);
      }
    }
  } else if (path.includes('data/country-zipcode')) {
    let version_path_ind = path.length - 1;
    while (path[version_path_ind] != '/') {
      version_path_ind = version_path_ind - 1;
    }
    const file_path = path.slice(0, version_path_ind + 1);
    const available_countries = ['IN', 'US', 'MY', 'SG'];
    for (let j = 0; j < available_countries.length; j++) {
      const valid_files = getCountryZipcodesFilePaths(
        file_path,
        available_countries[j],
      );
      if (valid_files && !isInterfaceInArray(validation_files, valid_files)) {
        validation_files.push(valid_files);
      }
    }
  }
}

if (validation_files.length === 0) {
  console.log('ℹ️  No files to validate (all packages use proto schema)');
  process.exit(0);
}

let hasErrors = false;

for (let i = 0; i < validation_files.length; i++) {
  try {
    // Validating the files
    const schema = JSON.parse(
      fs.readFileSync(validation_files[i].schema_file, 'utf-8'),
    );
    const data = JSON.parse(
      fs.readFileSync(validation_files[i].data_file, 'utf-8'),
    );
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
      throw new InvalidFilesError(
        validation_files[i].data_file +
          ' Does not follow the Schema from ' +
          validation_files[i].schema_file +
          ' file',
      );
    } else {
      console.log(
        '✅ ' +
          validation_files[i].data_file +
          ' follows the Schema from ' +
          validation_files[i].schema_file +
          ' file',
      );
    }
  } catch (error: any) {
    hasErrors = true;
    if (error instanceof InvalidFilesError) {
      console.error(
        '❌ ' +
          validation_files[i].schema_file +
          ' & ' +
          validation_files[i].data_file +
          ' Mismatch Error:',
        error.message,
      );
    } else {
      console.error(
        '❌ An unexpected error occurred in ' +
          validation_files[i].schema_file +
          ' or ' +
          validation_files[i].data_file +
          ':',
        error.message,
      );
    }
  }
}

if (hasErrors) {
  process.exit(1);
}
