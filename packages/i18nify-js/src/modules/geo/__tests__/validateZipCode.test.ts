import validateZipCode from '../validateZipCode';
import { I18nifyCountryCodeType } from '../types';
import { INDIA_DATA } from '../mocks/country';
import * as shared from '../../shared';

describe('validateZipCode', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    // Reset the supported countries mock
    jest.restoreAllMocks();

    // Mock the supported countries list to only include IN and US
    Object.defineProperty(shared, 'I18NIFY_DATA_SUPPORTED_COUNTRIES', {
      value: ['IN', 'US'],
      configurable: true,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(INDIA_DATA),
      } as Response),
    );
  });

  it('returns true for a valid zipcode in a country', async () => {
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/subdivisions/IN.json'),
    );
  });

  it('returns false for an invalid zipcode in a country', async () => {
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

    const isValid = await validateZipCode(
      '999999',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles empty zipcode', async () => {
    await expect(
      validateZipCode('', 'IN' as I18nifyCountryCodeType),
    ).rejects.toThrow('Zipcode is required. Please provide a valid zipcode.');
  });

  it('handles invalid country code', async () => {
    // Mock the supported countries list to only include IN
    jest
      .spyOn(shared.I18NIFY_DATA_SUPPORTED_COUNTRIES, 'includes')
      .mockImplementation((code) => code === 'IN');

    await expect(
      validateZipCode('110001', 'XX' as I18nifyCountryCodeType),
    ).rejects.toThrow(
      'Invalid country code: XX. Please ensure you provide a valid country code.',
    );
  });

  it('validates across all supported countries when country code is not provided', async () => {
    const mockResponses: Record<string, any> = {
      'IN.json': {
        country_name: 'India',
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
      'US.json': {
        country_name: 'United States',
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

    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponses[`${countryCode}.json`]),
      });
    });

    const isValid = await validateZipCode('110001');

    expect(isValid).toBe(true);
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

    const isValid = await validateZipCode(
      '  110001  ',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(true);
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );
    expect(isValid).toBe(false);
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
      validateZipCode('110001', 'IN' as I18nifyCountryCodeType),
    ).rejects.toThrow(
      'An error occurred while validating zipcode. The error details are: res.json is not a function',
    );
  });

  // New test cases for edge cases

  it('handles network failures', async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error('Network error')));

    await expect(
      validateZipCode('110001', 'IN' as I18nifyCountryCodeType),
    ).rejects.toThrow(
      'An error occurred while validating zipcode. The error details are: Network error',
    );
  });

  it('handles invalid JSON responses', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      }),
    );

    await expect(
      validateZipCode('110001', 'IN' as I18nifyCountryCodeType),
    ).rejects.toThrow(
      'An error occurred while validating zipcode. The error details are: Invalid JSON',
    );
  });

  it('handles case sensitivity in zipcodes', async () => {
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );
    const isValidUpperCase = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(true);
    expect(isValidUpperCase).toBe(true);
  });

  it('handles special characters in zipcodes', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: ['110-001', '110.002'],
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

    const isValid = await validateZipCode(
      '110-001',
      'IN' as I18nifyCountryCodeType,
    );
    const isValidWithDot = await validateZipCode(
      '110.002',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(true);
    expect(isValidWithDot).toBe(true);
  });

  it('handles very long zipcodes', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: ['12345678901234567890'],
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

    const isValid = await validateZipCode(
      '12345678901234567890',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(true);
  });

  it('handles whitespace-only zipcode', async () => {
    await expect(
      validateZipCode('   ', 'IN' as I18nifyCountryCodeType),
    ).rejects.toThrow('Zipcode is required. Please provide a valid zipcode.');
  });

  it('handles null response from API', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(null),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );
    expect(isValid).toBe(false);
  });

  it('handles response with missing required fields', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              // Missing zipcodes field
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with malformed data structures', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': {
              name: 'New Delhi',
              timezone: 'Asia/Kolkata',
              zipcodes: null, // zipcodes is null instead of an array
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with null cities object', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: null, // cities is null instead of an object
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with undefined cities object', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          // cities is undefined
        },
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with null states object', async () => {
    const mockResponse = {
      states: null, // states is null instead of an object
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with undefined states object', async () => {
    const mockResponse = {
      // states is undefined
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with null city object', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': null, // city object is null
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with undefined city object', async () => {
    const mockResponse = {
      states: {
        DL: {
          name: 'Delhi',
          cities: {
            'New Delhi': undefined, // city object is undefined
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

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with null state object', async () => {
    const mockResponse = {
      states: {
        DL: null, // state object is null
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles response with undefined state object', async () => {
    const mockResponse = {
      states: {
        DL: undefined, // state object is undefined
      },
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const isValid = await validateZipCode(
      '110001',
      'IN' as I18nifyCountryCodeType,
    );

    expect(isValid).toBe(false);
  });

  it('handles multiple matches across countries', async () => {
    const mockResponses: Record<string, any> = {
      'IN.json': {
        country_name: 'India',
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
      'US.json': {
        country_name: 'United States',
        states: {
          CA: {
            name: 'California',
            cities: {
              'Los Angeles': {
                name: 'Los Angeles',
                timezone: 'America/Los_Angeles',
                zipcodes: ['110001', '90002'],
                'region_name/district_name': 'Los Angeles County',
              },
            },
          },
        },
      },
    };

    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponses[`${countryCode}.json`]),
      });
    });

    const isValid = await validateZipCode('110001');

    expect(isValid).toBe(true); // Should return true if found in any country
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles mixed API responses in multi-country validation', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      if (countryCode === 'IN') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                DL: {
                  name: 'Delhi',
                  cities: {
                    'New Delhi': {
                      name: 'New Delhi',
                      timezone: 'Asia/Kolkata',
                      zipcodes: ['110001'],
                      'region_name/district_name': 'Central Delhi',
                    },
                  },
                },
              },
            }),
        });
      } else {
        // US request fails
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.reject(new Error('Not found')),
        });
      }
    });

    const isValid = await validateZipCode('110001');
    expect(isValid).toBe(true); // Should still return true as IN has the zipcode
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles all API failures in multi-country validation', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      if (countryCode === 'IN') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.reject(new Error('Server error')),
        });
      } else {
        // US request times out
        return Promise.reject(new Error('Network timeout'));
      }
    });

    const isValid = await validateZipCode('110001');
    expect(isValid).toBe(false); // Should return false as all countries failed
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles mixed data structures in multi-country validation', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      if (countryCode === 'IN') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              // Missing states property
            }),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {}, // Empty states object
            }),
        });
      }
    });

    const isValid = await validateZipCode('110001');
    expect(isValid).toBe(false); // Should return false as no valid data found
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles invalid city structures in multi-country validation', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      if (countryCode === 'IN') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                DL: {
                  name: 'Delhi',
                  cities: {
                    'New Delhi': null, // Invalid city structure
                  },
                },
              },
            }),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                CA: {
                  name: 'California',
                  cities: {
                    'Los Angeles': {
                      name: 'Los Angeles',
                      timezone: 'America/Los_Angeles',
                      // Missing zipcodes array
                      'region_name/district_name': 'Los Angeles County',
                    },
                  },
                },
              },
            }),
        });
      }
    });

    const isValid = await validateZipCode('110001');
    expect(isValid).toBe(false); // Should return false as no valid data found
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles empty cities in multi-country validation', async () => {
    global.fetch = jest.fn().mockImplementation((url) => {
      const countryCode = url.split('/').pop()?.replace('.json', '');
      if (countryCode === 'IN') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                DL: {
                  name: 'Delhi',
                  cities: {}, // Empty cities object
                },
              },
            }),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              states: {
                CA: {
                  name: 'California',
                  cities: {
                    'Los Angeles': {
                      name: 'Los Angeles',
                      timezone: 'America/Los_Angeles',
                      zipcodes: [], // Empty zipcodes array
                      'region_name/district_name': 'Los Angeles County',
                    },
                  },
                },
              },
            }),
        });
      }
    });

    const isValid = await validateZipCode('110001');
    expect(isValid).toBe(false); // Should return false as no valid data found
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles null state objects in multi-country validation', async () => {
    const responses: Record<string, any> = {
      IN: {
        states: [null, { cities: {} }],
      },
      US: {
        states: [{ cities: {} }],
      },
    };

    (fetch as jest.Mock).mockImplementation((url: string) => {
      const countryCode = url.split('/').pop()?.split('.')[0] || '';
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses[countryCode]),
      });
    });

    const result = await validateZipCode('110001');
    expect(result).toBe(false);
  });
});
