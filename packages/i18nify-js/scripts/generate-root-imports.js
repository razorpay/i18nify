/**
 * This script generates sub-module files at the root level.
 * For eg, For module currency, it will create i18nify-js/currency.js with below snippet
 * export * from './lib/esm/currency';
 *
 * If we already have exports in package.json for sub-modules then why do we need it ?
 * While exports specified in package.json work well for web-based projects, the React Native bundler fails to recognize them
 * and requires additional configuration to enable recognition. Refer this issue => https://github.com/razorpay/blade/issues/2036
 * As a result, we are generating additional files for sub-module imports to function correctly in React Native platform.
 *
 */
const fs = require('fs');
const path = require('path');

// Currently, we will have to manuually add every new module that we create
const EXPORT_MODULES = ['currency', 'phoneNumber', 'core', 'types'];
const BUILD_DIRECTORY = 'lib';

try {
  EXPORT_MODULES.forEach((exportCategory) => {
    const exportCategoryContentWeb = `export * from './${BUILD_DIRECTORY}/esm/${exportCategory}';\n`;
    const exportCategoryFileWeb = path.resolve(
      __dirname,
      `../${exportCategory}.js`,
    );
    fs.writeFileSync(exportCategoryFileWeb, exportCategoryContentWeb);
  });
  console.log(
    '\n',
    `Generated root imports for ${EXPORT_MODULES.join(', ')}`,
    '\n',
  );
} catch (error) {
  console.log('\n', `error while generating root imports`, '\n', error, '\n');
}
