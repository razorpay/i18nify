// const fs = require('fs');
// const path = require('path');

// const a = async () => {
// //     const directoryPath = 'packages/i18nify-js/src/modules/geo/data';
// //     const svgs = {};

// //   // Read the contents of the directory
// //   const files = fs.readdirSync(directoryPath);
// //   const mjsFiles = files.filter((file) => path.extname(file) === '.svg');

// //   for (const file of mjsFiles) {
// //     try {
// //       // Extract the country code from the file name
// //       const countryCode = file.split('.')[0].toUpperCase();

// //       // Dynamically import the SVG module
// //       const svgModule = await import(`./data/${countryCode}.mjs`);

// //       // Assign the SVG to the country code key in the 'svgs' object
// //       svgs[countryCode] = svgModule;
// //     } catch (error) {
// //       console.error(`Error loading SVG from file ${file}: ${error}`);
// //     }
// //   }
// //   return svgs;

// try {
//     const svgContent = fs.readFileSync('packages/i18nify-js/src/modules/geo/data/AD.svg', 'utf8');
//     return svgContent;
// } catch (error) {
//     console.error(`Error reading the SVG file: ${error}`);
//     throw error;
// }
// };

// console.log(a());

const fs = require('fs');
const path = require('path');

/**
 * Reads all SVG files from a given directory and returns an object with country codes as keys and SVG content as values.
 * @param {string} directoryPath - The path to the directory containing the SVG files.
 * @returns {Promise<Object>} A promise that resolves to an object containing the country codes and SVG content.
 */
async function loadSvgFiles() {
    const directoryPath = 'packages/i18nify-js/src/modules/geo/data';

    try {
        const files = fs.readdirSync(directoryPath);
        const svgObject = {};

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
}

loadSvgFiles().then(data => {console.log(data)})
