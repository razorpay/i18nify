const fs = require('fs');
const path = require('path');

/**
 * Converts all file names in a directory to uppercase.
 * @param {string} directoryPath - The path to the directory containing the files.
 */
function convertFileNamesToUpperCase(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.error(`Error reading the directory: ${err.message}`);
        }

        files.forEach(file => {
            const oldPath = path.join(directoryPath, file);
            const filename = file.split('.')[0].toUpperCase();
            const ext = file.split('.')[1];
            const newPath = path.join(directoryPath, `${filename}.${ext}`);

            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error(`Error renaming file ${file}: ${err.message}`);
                } else {
                    console.log(`${file} was renamed to ${file.toUpperCase()}`);
                }
            });
        });
    });
}

// Usage:
const directoryPath =  'packages/i18nify-js/src/modules/geo/data'; // Replace with your directory path
convertFileNamesToUpperCase(directoryPath);
