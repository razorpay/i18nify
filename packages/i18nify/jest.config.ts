const config = {
  collectCoverage: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['**/*.{ts,js}', '!coverage/**/*.{ts,tsx,js,jsx}'],
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
