import fs from 'fs';
import path from 'path';
import { withErrorBoundary } from '../../common/errorBoundary';
import { SvgCollection } from './types';



const getListOfAllFlags = async (): Promise<SvgCollection> => {
  const directoryPath = 'packages/i18nify-js/src/modules/geo/data';
  
  // Create an empty object to store the country codes and their corresponding SVGs
  const svgs: SvgCollection = {};

  // Read the contents of the directory
  const files = fs.readdirSync(directoryPath);

  // Filter out non-.mjs files
  const mjsFiles = files.filter((file) => path.extname(file) === '.mjs');

  for (const file of mjsFiles) {
    try {
      // Extract the country code from the file name
      const countryCode = file.split('.')[0].toUpperCase();

      // Dynamically import the SVG module
      const svgModule = await import(`./data/${countryCode}.mjs`);

      // Assign the SVG to the country code key in the 'svgs' object
      svgs[countryCode] = svgModule.default;
    } catch (error) {
      console.error(`Error loading SVG from file ${file}: ${error}`);
    }
  }

  return svgs;
};

export default withErrorBoundary<typeof getListOfAllFlags>(getListOfAllFlags);
