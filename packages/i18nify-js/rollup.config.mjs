import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import { readdirSync } from 'fs';
import { basename, extname, join } from 'path';

// Function to get modules dynamically from a directory
const getModules = (directory) => {
  const moduleFiles = readdirSync(directory);

  return moduleFiles
    .filter((file) => !file.startsWith('.')) // Exclude internal hidden files
    .map((file) => {
      const moduleName = basename(file, extname(file));
      const filePath = join(directory, file, '/index.ts');

      return {
        input: filePath,
        name: moduleName,
      };
    });
};

const MODULES_DIR = 'src/modules';

// Get modules dynamically from the specified directory
const modules = getModules(MODULES_DIR);

/**
 * Generates input objects in below format
 * {
 *  currency/index: 'src/modules/currency/index.ts',
 *  core/index: 'src/modules/core/index.ts',
 *  phoneNumber/index: 'src/modules/phoneNumber/index.ts',
 *  ... etc
 * }
 */
const moduleInputs = modules.reduce((acc, curr) => {
  acc = {
    ...acc,
    [`${curr.name}/index`]: curr.input,
  };
  return acc;
}, {});

// Create declaration files for each module
const declarationTypes = modules.map((_module) => ({
  input: _module.input,
  output: {
    file: `lib/esm/${_module.name}/index.d.ts`,
    format: 'es',
  },
  plugins: [dts()],
}));

export default [
  // ESM (ES6 module) build
  {
    input: {
      index: 'src/index.ts',
      ...moduleInputs,
    },
    output: {
      dir: 'lib/esm',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs(), dynamicImportVars()],
  },
  // ESM (ES6 module) minified build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/esm/index.min.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs(), terser(), dynamicImportVars()],
  },
  // Universal Module Definition (UMD) build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/umd/index.js',
      format: 'umd',
      sourcemap: true,
      name: 'i18nify',
      inlineDynamicImports: true,
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
  // Universal Module Definition (UMD) minified build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/umd/index.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'i18nify',
      inlineDynamicImports: true,
    },
    plugins: [typescript(), resolve(), commonjs(), terser()],
  },
  // CommonJS (CJS) build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/cjs/index.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
  // Declaration types (.d.ts) for modules
  ...declarationTypes,
  // Single Declaration type file for all modules
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/types/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
