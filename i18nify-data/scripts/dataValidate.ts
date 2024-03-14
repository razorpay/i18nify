import fs from 'fs';
import Ajv from 'ajv';

/*
  This validation script is to validate the data file with respective schema files

  The validation part is same for all the files, but fetching the file paths is different for files in
  data/country-zipcode folder and the remaining folder.

  Assumptions:
   - All the folder's except data/country-zipcode folder have one data.json & schema.json files
   - In data/country-zipcode folder, we have different files for different countries like IN.json, US.json,...
   and have only one common schema.json file for all the country data files


  Validation-script
  - Fetching file paths
      - for data/country-zipcode folder
          - get the path till the version (eg: data/country-zipcode/version_1.0.0)
          - Add all the country data files and the common schema file in the new version folder, to the list of validation files
              (eg: {data/country-zipcode/version_1.0.0/IN.json, data/country-zipcode/version_1.0.0/schema.json},
                    {data/country-zipcode/version_1.0.0/US.json, data/country-zipcode/version_1.0.0/schema.json})
      - for remaining folders
          - get the path till the version (eg: data/country-data-info/version_1.0.0)
          - All the data.json & schema.json files in the new version folder, to the list of validation files
            (eg:{data/country/version_1.0.0/data.json, data/country/version_1.0.0/schema.json})
  - Validating the files
      - Reading the data and scheme files
      - Validating with ajv

  - Sending the status of each data and schema files validation
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

function getFilesFromPath(filePath: string, fileName: string): Files {
  const ind = filePath.indexOf(fileName);
  const dir = filePath.slice(0, ind);
  const schema_file_path = dir + 'schema.json';
  const data_file_path = dir + 'data.json';
  return {
    schema_file: schema_file_path,
    data_file: data_file_path,
  };
}

// Getting the country Data file along with the Scheme file from Country-zipcode folder
function getCountryZipcodesFilePaths(filePath: string, country: string): Files {
  return {
    schema_file: filePath + 'schema.json',
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
      if (!isInterfaceInArray(validation_files, valid_files)) {
        validation_files.push(valid_files);
      }
    } else if (path.includes('data.json')) {
      const valid_files = getFilesFromPath(path, 'data.json');
      if (!isInterfaceInArray(validation_files, valid_files)) {
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
      if (!isInterfaceInArray(validation_files, valid_files)) {
        validation_files.push(valid_files);
      }
    }
  }
}

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
          ' follow the Schema from ' +
          validation_files[i].schema_file +
          ' file',
      );
    }
  } catch (error: any) {
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
