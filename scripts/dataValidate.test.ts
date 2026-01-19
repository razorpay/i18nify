import * as fs from 'fs';
import * as path from 'path';
import * as protobuf from 'protobufjs';

// Test utilities
const TEST_DIR = path.join(__dirname, '../i18nify-data');

describe('dataValidate', () => {
  describe('Proto files exist for all packages', () => {
    const packages = [
      'bankcodes',
      'currency',
      'country/metadata',
      'country/subdivisions',
      'phone-number/country-code-to-phone-number',
      'phone-number/dial-code-to-country',
    ];

    test.each(packages)('%s has a proto file', (pkg) => {
      const protoDir = path.join(TEST_DIR, pkg, 'proto');
      expect(fs.existsSync(protoDir)).toBe(true);
      
      const protoFiles = fs.readdirSync(protoDir).filter(f => f.endsWith('.proto'));
      expect(protoFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Proto files are valid', () => {
    const protoConfigs = [
      { pkg: 'bankcodes', proto: 'bankcodes.proto', message: 'BankCodes' },
      { pkg: 'currency', proto: 'currency.proto', message: 'CurrencyData' },
      { pkg: 'country/metadata', proto: 'country_metadata.proto', message: 'CountryMetadataData' },
      { pkg: 'country/subdivisions', proto: 'country_subdivisions.proto', message: 'CountrySubdivisions' },
      { pkg: 'phone-number/country-code-to-phone-number', proto: 'country_phone_info.proto', message: 'CountryPhoneData' },
      { pkg: 'phone-number/dial-code-to-country', proto: 'dial_code_to_country.proto', message: 'DialCodeToCountryData' },
    ];

    test.each(protoConfigs)('$pkg proto loads and has $message', async ({ pkg, proto, message }) => {
      const protoPath = path.join(TEST_DIR, pkg, 'proto', proto);
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType(message);
      expect(MessageType).toBeDefined();
    });
  });

  describe('Data files validate against proto', () => {
    test('currency/data.json validates', async () => {
      const protoPath = path.join(TEST_DIR, 'currency/proto/currency.proto');
      const dataPath = path.join(TEST_DIR, 'currency/data.json');
      
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType('CurrencyData');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      const errMsg = MessageType.verify(data);
      expect(errMsg).toBeNull();
    });

    test('country/metadata/data.json validates', async () => {
      const protoPath = path.join(TEST_DIR, 'country/metadata/proto/country_metadata.proto');
      const dataPath = path.join(TEST_DIR, 'country/metadata/data.json');
      
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType('CountryMetadataData');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      const errMsg = MessageType.verify(data);
      expect(errMsg).toBeNull();
    });

    test('country/subdivisions/IN.json validates', async () => {
      const protoPath = path.join(TEST_DIR, 'country/subdivisions/proto/country_subdivisions.proto');
      const dataPath = path.join(TEST_DIR, 'country/subdivisions/IN.json');
      
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType('CountrySubdivisions');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      
      const errMsg = MessageType.verify(data);
      expect(errMsg).toBeNull();
    });

    test('phone-number data files validate', async () => {
      // country-code-to-phone-number
      const proto1 = path.join(TEST_DIR, 'phone-number/country-code-to-phone-number/proto/country_phone_info.proto');
      const data1 = path.join(TEST_DIR, 'phone-number/country-code-to-phone-number/data.json');
      
      const root1 = await protobuf.load(proto1);
      const Type1 = root1.lookupType('CountryPhoneData');
      const json1 = JSON.parse(fs.readFileSync(data1, 'utf-8'));
      expect(Type1.verify(json1)).toBeNull();

      // dial-code-to-country
      const proto2 = path.join(TEST_DIR, 'phone-number/dial-code-to-country/proto/dial_code_to_country.proto');
      const data2 = path.join(TEST_DIR, 'phone-number/dial-code-to-country/data.json');
      
      const root2 = await protobuf.load(proto2);
      const Type2 = root2.lookupType('DialCodeToCountryData');
      const json2 = JSON.parse(fs.readFileSync(data2, 'utf-8'));
      expect(Type2.verify(json2)).toBeNull();
    });
  });

  describe('Invalid data fails validation', () => {
    test('invalid country subdivision data fails', async () => {
      const protoPath = path.join(TEST_DIR, 'country/subdivisions/proto/country_subdivisions.proto');
      
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType('CountrySubdivisions');
      
      // Invalid data - states should be object, not string
      const invalidData = {
        country_name: 'Test',
        states: {
          'INVALID': 'this should be an object, not a string'
        }
      };
      
      const errMsg = MessageType.verify(invalidData);
      expect(errMsg).not.toBeNull();
    });

    test('wrong nested type fails validation', async () => {
      const protoPath = path.join(TEST_DIR, 'country/subdivisions/proto/country_subdivisions.proto');
      
      const root = await protobuf.load(protoPath);
      const MessageType = root.lookupType('CountrySubdivisions');
      
      // Wrong type - cities should be object with City structure, not array
      const wrongTypeData = {
        country_name: 'Test',
        states: {
          'TEST': {
            name: 'Test State',
            cities: ['city1', 'city2']  // Should be map<string, City>, not array
          }
        }
      };
      
      const errMsg = MessageType.verify(wrongTypeData);
      expect(errMsg).not.toBeNull();
    });
  });
});

