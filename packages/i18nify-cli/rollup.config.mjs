import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    banner: '#!/usr/bin/env node',
    sourcemap: true,
  },
  plugins: [
    typescript({ compilerOptions: { module: 'esnext' } }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    json(),
    terser(),
  ],
};
