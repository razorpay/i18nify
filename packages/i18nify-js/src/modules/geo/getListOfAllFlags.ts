import fs from 'fs';
import path from 'path';
import { withErrorBoundary } from '../../common/errorBoundary';
import { SvgObject } from './types';

/**
 * Reads all SVG files from a given directory and returns an object with country codes as keys and SVG content as values.
 * @returns {Promise<Object>} A promise that resolves to an object containing the country codes and SVG content.
 */
const getListOfAllFlags = async (): Promise<SvgObject> => {
  const directoryPath = 'packages/i18nify-js/src/modules/geo/data/countryFlagSvgs';

  try {
    const files = fs.readdirSync(directoryPath);
    const svgObject: SvgObject = {};

    for (const file of files) {
      if (path.extname(file) === '.svg') {
        const countryCode = path.basename(file, '.svg');
        const filePath = path.join(directoryPath, file);
        const svgContent = fs.readFileSync(filePath, 'utf8');
        svgObject[countryCode.toUpperCase()] = svgContent;
      }
    }

    return svgObject;
  } catch (error) {
    console.error(`Error loading SVG files: ${error}`);
    throw error;
  }
};

export default withErrorBoundary<typeof getListOfAllFlags>(getListOfAllFlags);
