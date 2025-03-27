import getCityByZipcode from '../getCityByZipcode';
import { CountryCodeType } from '../../types';

// Mock data and functions
jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
  I18NIFY_DATA_SUPPORTED_COUNTRIES: ['US', 'IN'],
}));

// Mock fetch
(global.fetch as jest.Mock) = jest.fn((url: string) => {
  if (url.includes('US.json')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          states: {
            CA: {
              cities: {
                'Los Angeles': { zipcodes: ['90001', '90002'] },
              },
            },
          },
        }),
    });
  } else if (url.includes('IN.json')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          states: {
            KA: {
              cities: {
                Bangalore: { zipcodes: ['560001', '560002'] },
              },
            },
          },
        }),
    });
  }
  return Promise.reject(new Error('Network error'));
});

describe('getCityByZipcode', () => {
  it('should return the city name for a valid zipcode', async () => {
    const cityName = await getCityByZipcode('90001', 'US');
    expect(cityName).toBe('Los Angeles');
  });

  it('should throw an error for an invalid country code', async () => {
    await expect(
      getCityByZipcode('90001', 'XX' as CountryCodeType),
    ).rejects.toThrow('Invalid country code: XX.');
  });

  it('should return the city name for a valid zipcode but no country passed', async () => {
    const cityName = await getCityByZipcode('90001');
    expect(cityName).toBe('Los Angeles');
  });

  it('should throw an error for an empty zipcode', async () => {
    await expect(getCityByZipcode('', 'US')).rejects.toThrow(
      'Zipcode is required.',
    );
  });

  it('should throw an error if the zipcode is not found', async () => {
    await expect(getCityByZipcode('99999', 'US')).rejects.toThrow(
      'Zipcode "99999" not found',
    );
  });

  it('should handle network errors gracefully', async () => {
    await expect(getCityByZipcode('90001', 'IN')).rejects.toThrow(
      'An error occurred while fetching city data.',
    );
  });
});
