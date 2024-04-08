const fs = require('fs');
const path = require('path');

/**
 * Creates a json file with the data and filePath provided.
 */
module.exports = async ({
  data,
  subsetFilePath,
}: {
  data: unknown;
  subsetFilePath: string;
}) => {
  if (fs.existsSync(subsetFilePath)) {
    await fs.promises.unlink(subsetFilePath);
  }

  const dirPath = path.dirname(subsetFilePath);
  await fs.promises.mkdir(dirPath, { recursive: true });

  await fs.promises.writeFile(
    subsetFilePath,
    JSON.stringify(data, null, 2),
    'utf8',
  );
  console.log(`${path.basename(subsetFilePath)} created successfully.`);
};
