import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import { readdirSync } from 'fs';
import { basename, extname, join } from 'path';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const COMMON_PLUGINS = [
  typescript(),
  resolve(),
  commonjs(),
  json(),
  alias({
    entries: [
      {
        find: '#/i18nify-data',
        replacement: path.resolve(__dirname, '../../i18nify-data'),
      },
    ],
  }),
];

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
    plugins: [
      ...COMMON_PLUGINS,
      copy({
        targets: [
          { src: '../../i18nify-data/assets/flags', dest: './lib/assets' },
        ],
      }),
    ],
  },
  // ESM (ES6 module) minified build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/esm/index.min.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [...COMMON_PLUGINS, terser()],
  },
  // Universal Module Definition (UMD) build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/umd/index.js',
      format: 'umd',
      sourcemap: true,
      name: 'i18nify',
    },
    plugins: [...COMMON_PLUGINS],
  },
  // Universal Module Definition (UMD) minified build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/umd/index.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'i18nify',
    },
    plugins: [...COMMON_PLUGINS, terser()],
  },
  // CommonJS (CJS) build
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/cjs/index.js',
      format: 'cjs',
    },
    plugins: [...COMMON_PLUGINS],
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
