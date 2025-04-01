const config = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+test.[jt]s?(x)'],
  collectCoverageFrom: ['**/*.{ts,js}', '!coverage/**/*.{ts,tsx,js,jsx}'],
  coveragePathIgnorePatterns: [
    'blackbox',
    '.spec.ts',
    'modules/shared/index.ts$',
    'packages/i18nify-js/src/index.ts$',
    'modules/types/index.ts$',
  ],
  coverageThreshold: {
    './src/': {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  rootDir: 'src',
  moduleNameMapper: {
    '^#/i18nify-data/(.*)$': '<rootDir>/../../../i18nify-data/$1',
  },
};

export default config;
