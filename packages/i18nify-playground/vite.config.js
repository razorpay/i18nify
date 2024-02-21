import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import checker from 'vite-plugin-checker';
import copy from 'rollup-plugin-copy';

// ----------------------------------------------------------------------

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    copy({
      targets: [{ src: 'CNAME', dest: 'dist/' }],
      hook: 'writeBundle', // notice here
    }),
  ],
  // checker({
  //   eslint: {
  //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
  //   },
  // }),
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 3030,
  },
  preview: {
    port: 3030,
  },
});
