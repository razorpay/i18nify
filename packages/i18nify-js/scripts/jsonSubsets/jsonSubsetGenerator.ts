import * as fs from 'fs';
import * as path from 'path';
import { TransformFunction } from './types';

// Generic function to create subset files for any modules large geo data json files
export const createModuleSubsetFile = async <TInput, TOutput>(
  data: TInput,
  subsetFilePath: string,
  transformFunction: TransformFunction<TInput, TOutput>,
): Promise<void> => {
  const subsetData: TOutput = transformFunction(data);

  if (fs.existsSync(subsetFilePath)) {
    await fs.promises.unlink(subsetFilePath);
  }

  const dirPath = path.dirname(subsetFilePath);
  await fs.promises.mkdir(dirPath, { recursive: true });

  await fs.promises.writeFile(
    subsetFilePath,
    JSON.stringify(subsetData, null, 2),
    'utf8',
  );
  console.log(`${path.basename(subsetFilePath)} created successfully.`);
};
