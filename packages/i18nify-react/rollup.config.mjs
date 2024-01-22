import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";

export default [
  {
    input: "src/index.ts",
    output: [
      // ESM build
      {
        file: "lib/esm/index.js",
        format: "es",
        sourcemap: true,
      },
      // CommonJS (CJS) build
      {
        file: "lib/cjs/index.js",
        format: "cjs",
      },
    ],
    plugins: [external(), typescript(), resolve(), commonjs()],
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
