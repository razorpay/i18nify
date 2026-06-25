import getStatesByZipCode from '../getStatesByZipCode';
import { CountryCodeType } from '../../types/geo';
import { INDIA_DATA } from '../mocks/country';
import * as shared from '../../shared';

describe('getStatesByZipCode', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    // Reset the supported countries mock
    jest.restoreAllMocks();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(INDIA_DATA),
      } as Response),
    );
  });

  it('fetches state info for a valid zipcode', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: ['110001', '110002', '110003'],
              'region_name/district_name': 'Central Delhi',
            },
          },
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const stateInfo = await getStatesByZipCode(
      '110001',
      'IN' as CountryCodeType,
    );

    expect(stateInfo).toEqual({
      code: 'DL',
      name: 'Delhi',
      country: 'IN',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/subdivisions/IN.json'),
    );
  });

  it('handles empty zipcode', async () => {
    await expect(
      getStatesByZipCode('', 'IN' as CountryCodeType),
    ).rejects.toThrow('Zipcode is required. Please provide a valid zipcode.');
  });

  it('handles invalid country code', async () => {
    // Mock the supported countries list to only include IN
    jest
      .spyOn(shared.I18NIFY_DATA_SUPPORTED_COUNTRIES, 'includes')
      .mockImplementation((code) => code === 'IN');

    await expect(
      getStatesByZipCode('110001', 'XX' as CountryCodeType),
    ).rejects.toThrow(
      'Invalid country code: XX. Please ensure you provide a valid country code.',
    );
  });

  it('handles zipcode not found', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: ['110001', '110002'],
              'region_name/district_name': 'Central Delhi',
            },
          },
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    await expect(
      getStatesByZipCode('999999', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'Zipcode "999999" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.',
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => {
          throw new Error('res.json is not a function');
        },
      }),
    );

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'An error occurred while fetching state data. The error details are: res.json is not a function',
    );
  });

  it('handles network errors', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Network error')));

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'An error occurred while fetching state data. The error details are: Network error',
    );
  });

  it('searches across all supported countries when country code is not provided', async () => {
    const mockResponses = {
      IN: {
        states: {
          DL: {
            name: 'Delhi',
            cities: {
              'New Delhi': {
                name: 'New Delhi',
                timezone: 'Asia/Kolkata',
                zipcodes: ['110001', '110002'],
                'region_name/district_name': 'Central Delhi',
              },
            },
          },
        },
      },
      US: {
        states: {
          CA: {
            name: 'California',
            cities: {
              'Los Angeles': {
                name: 'Los Angeles',
                timezone: 'America/Los_Angeles',
                zipcodes: ['90001', '90002'],
                'region_name/district_name': 'Los Angeles County',
              },
            },
          },
        },
      },
    };

    // Mock the supported countries array to only include IN and US
    const mockSupportedCountries = ['IN', 'US'];
    Object.defineProperty(shared, 'I18NIFY_DATA_SUPPORTED_COUNTRIES', {
      value: mockSupportedCountries,
      writable: true,
    });

    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.split('.')[0];
      const response = mockResponses[countryCode as keyof typeof mockResponses];
      if (!response) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ states: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
      });
    });

    const stateInfo = await getStatesByZipCode('110001');

    expect(stateInfo).toEqual({
      code: 'DL',
      name: 'Delhi',
      country: 'IN',
    });
    expect(fetch).toHaveBeenCalledTimes(2); // Called for both IN and US
  });

  it('handles zipcode with leading/trailing spaces', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: ['110001', '110002'],
              'region_name/district_name': 'Central Delhi',
            },
          },
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const stateInfo = await getStatesByZipCode(
      '  110001  ',
      'IN' as CountryCodeType,
    );

    expect(stateInfo).toEqual({
      code: 'DL',
      name: 'Delhi',
      country: 'IN',
    });
  });

  it('handles empty states in country data', async () => {
    const mockResponse = {
      states: {},
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'Zipcode "110001" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.',
    );
  });

  it('handles empty cities in state data', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {},
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'Zipcode "110001" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.',
    );
  });

  it('handles empty zipcodes array in city data', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: [],
              'region_name/district_name': 'Central Delhi',
            },
          },
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      'Zipcode "110001" not found in any supported country. Please ensure you provide a valid zipcode that exists within the specified countries.',
    );
  });

  it('handles malformed country data', async () => {
    const mockResponse = {
      // Missing states property
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    await expect(
      getStatesByZipCode('110001', 'IN' as CountryCodeType),
    ).rejects.toThrow(
      "An error occurred while fetching state data. The error details are: Cannot read properties of undefined (reading 'states')",
    );
  });
});
