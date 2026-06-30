import * as path from 'path';
import {
  fileExists,
  getDataFiles,
  validateWithProto,
  getPackagesToValidate,
  getValidationTargets,
  PACKAGE_CONFIGS,
} from './dataValidate';

const TEST_DIR = path.join(__dirname, '../i18nify-data');
const FIXTURES_DIR = path.join(__dirname, '__fixtures__');

describe('dataValidate', () => {
  describe('fileExists', () => {
    test('returns true for existing file', () => {
      expect(fileExists(path.join(TEST_DIR, 'currency/data.json'))).toBe(true);
    });

    test('returns false for non-existing file', () => {
      expect(fileExists(path.join(TEST_DIR, 'nonexistent.json'))).toBe(false);
    });
  });

  describe('getDataFiles', () => {
    test('returns single data.json for single pattern', () => {
      const files = getDataFiles('currency', 'single', TEST_DIR);
      expect(files).toHaveLength(1);
      expect(files[0]).toContain('data.json');
    });

    test('returns multiple json files for multiple pattern', () => {
      const files = getDataFiles('country/subdivisions', 'multiple', TEST_DIR);
      expect(files.length).toBeGreaterThan(1);
      expect(files.some((f) => f.includes('IN.json'))).toBe(true);
    });

    test('returns empty array for non-existing directory', () => {
      const files = getDataFiles('nonexistent', 'single', TEST_DIR);
      expect(files).toHaveLength(0);
    });
  });

  describe('getPackagesToValidate', () => {
    test('identifies correct packages from changed files', () => {
      const changedFiles = [
        'i18nify-data/currency/data.json',
        'i18nify-data/bankcodes/IN.json',
      ];
      const packages = getPackagesToValidate(changedFiles);
      expect(packages.has('currency')).toBe(true);
      expect(packages.has('bankcodes')).toBe(true);
      expect(packages.size).toBe(2);
    });

    test('returns empty set for unrelated files', () => {
      const changedFiles = ['packages/i18nify-go/main.go', 'README.md'];
      const packages = getPackagesToValidate(changedFiles);
      expect(packages.size).toBe(0);
    });

    test('deduplicates packages', () => {
      const changedFiles = [
        'i18nify-data/currency/data.json',
        'i18nify-data/currency/proto/currency.proto',
      ];
      const packages = getPackagesToValidate(changedFiles);
      expect(packages.size).toBe(1);
      expect(packages.has('currency')).toBe(true);
    });

    test('identifies business entity files', () => {
      const changedFiles = [
        'i18nify-data/business_entity/categories_data.json',
        'i18nify-data/business_entity/entity_types_data.json',
      ];
      const packages = getPackagesToValidate(changedFiles);
      expect(packages.size).toBe(1);
      expect(packages.has('business_entity')).toBe(true);
    });
  });

  describe('getValidationTargets', () => {
    test('returns explicit validation targets for business entity data', () => {
      const targets = getValidationTargets(
        'business_entity',
        PACKAGE_CONFIGS.business_entity,
      );
      expect(targets).toHaveLength(2);
      expect(targets[0]).toEqual({
        dataFile: 'i18nify-data/business_entity/categories_data.json',
        protoPath: 'i18nify-data/business_entity/proto/categories_data.proto',
        rootMessageName: 'CategoriesData',
      });
      expect(targets[1]).toEqual({
        dataFile: 'i18nify-data/business_entity/entity_types_data.json',
        protoPath: 'i18nify-data/business_entity/proto/entity_types_data.proto',
        rootMessageName: 'EntityTypesData',
      });
    });
  });

  describe('validateWithProto', () => {
    const fixtureProto = path.join(
      FIXTURES_DIR,
      'test-package/proto/test.proto',
    );
    const validData = path.join(FIXTURES_DIR, 'test-package/valid-data.json');
    const invalidData = path.join(
      FIXTURES_DIR,
      'test-package/invalid-data.json',
    );

    test('validates correct data successfully', async () => {
      const result = await validateWithProto(
        fixtureProto,
        'TestData',
        validData,
      );
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('fails validation for invalid data', async () => {
      const result = await validateWithProto(
        fixtureProto,
        'TestData',
        invalidData,
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('fails for non-existing proto file', async () => {
      const result = await validateWithProto(
        '/nonexistent.proto',
        'TestData',
        validData,
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('fails for non-existing data file', async () => {
      const result = await validateWithProto(
        fixtureProto,
        'TestData',
        '/nonexistent.json',
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('PACKAGE_CONFIGS', () => {
    test('all configs have required fields', () => {
      for (const config of Object.values(PACKAGE_CONFIGS)) {
        expect(config.protoPath).toBeDefined();
        expect(config.dataPattern).toMatch(/^(single|multiple|explicit)$/);
        expect(config.rootMessageName).toBeDefined();
      }
    });

    test('all proto files exist', () => {
      for (const config of Object.values(PACKAGE_CONFIGS)) {
        expect(fileExists(config.protoPath)).toBe(true);
        for (const fileConfig of config.files || []) {
          expect(fileExists(fileConfig.protoPath)).toBe(true);
        }
      }
    });
  });

  describe('Integration: Real data validation', () => {
    test('currency/data.json validates', async () => {
      const result = await validateWithProto(
        PACKAGE_CONFIGS['currency'].protoPath,
        PACKAGE_CONFIGS['currency'].rootMessageName,
        path.join(TEST_DIR, 'currency/data.json'),
      );
      expect(result.valid).toBe(true);
    });

    test('country/subdivisions/IN.json validates', async () => {
      const result = await validateWithProto(
        PACKAGE_CONFIGS['country/subdivisions'].protoPath,
        PACKAGE_CONFIGS['country/subdivisions'].rootMessageName,
        path.join(TEST_DIR, 'country/subdivisions/IN.json'),
      );
      expect(result.valid).toBe(true);
    });

    test('business_entity/categories_data.json validates', async () => {
      const target = PACKAGE_CONFIGS.business_entity.files?.[0];
      expect(target).toBeDefined();
      const result = await validateWithProto(
        target!.protoPath,
        target!.rootMessageName,
        target!.dataFile,
      );
      expect(result.valid).toBe(true);
    });

    test('business_entity/entity_types_data.json validates', async () => {
      const target = PACKAGE_CONFIGS.business_entity.files?.[1];
      expect(target).toBeDefined();
      const result = await validateWithProto(
        target!.protoPath,
        target!.rootMessageName,
        target!.dataFile,
      );
      expect(result.valid).toBe(true);
    });
  });
});
