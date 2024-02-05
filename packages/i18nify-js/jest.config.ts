const config = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+test.[jt]s?(x)'],
  collectCoverageFrom: ['**/*.{ts,js}', '!coverage/**/*.{ts,tsx,js,jsx}'],
  coveragePathIgnorePatterns: ['blackbox', '.spec.ts', '.mjs'],
  coverageThreshold: {
    './src/': {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  rootDir: 'src',
};

export default config;
