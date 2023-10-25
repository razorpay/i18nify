import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

const modules = [
  {
    input: "src/modules/currency/index.ts",
    name: "currency",
  },
  {
    input: "src/modules/phoneNumber/index.ts",
    name: "phoneNumber",
  },
];

const moduleBundles = modules.map((_module) => ({
  input: _module.input,
  output: {
    file: `lib/esm/${_module.name}/index.js`,
    format: "es",
    sourcemap: true,
  },
  plugins: [typescript(), resolve(), commonjs()],
}));

export default [
  // ESM (ES6 module) build
  ...moduleBundles,
  {
    input: "src/index.ts",
    output: {
      file: "lib/esm/index.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "lib/esm/index.min.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [typescript(), resolve(), commonjs(), terser()],
  },
  // Universal Module Definition (UMD) build
  {
    input: "src/index.ts",
    output: {
      file: "lib/umd/index.js",
      format: "umd",
      sourcemap: true,
      name: "i18nify",
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
  // Universal Module Definition (UMD) minified build
  {
    input: "src/index.ts",
    output: {
      file: "lib/umd/index.min.js",
      format: "umd",
      sourcemap: true,
      name: "i18nify",
    },
    plugins: [typescript(), resolve(), commonjs(), terser()],
  },
  // CommonJS (CJS) build
  {
    input: "src/index.ts",
    output: {
      file: "lib/cjs/index.js",
      format: "cjs",
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
  // Declaration types
  {
    input: "src/index.ts",
    output: {
      file: "lib/types/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
