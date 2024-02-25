import fs from 'fs';
import Ajv from 'ajv';

// const path = require("path")
// const Ajv = require("ajv")

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
      console.error('❌ Schema & Data Mismatch Error:', error.message);
    } else {
      console.error('❌ An unexpected error occurred:', error.message);
    }
  }
}
