import getStateByZipCode from '../getStateByZipCode';
import { CountryCodeType } from '../../types';
import * as shared from '../../shared';

jest.mock('../../shared', () => ({
  I18NIFY_DATA_SOURCE: 'http://mocksource.com',
  I18NIFY_DATA_SUPPORTED_COUNTRIES: ['US', 'IN'],
}));

const DELHI_RESPONSE = {
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

const CA_RESPONSE = {
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
};

describe('getStateByZipCode', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the state name for a valid zipcode + country', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(DELHI_RESPONSE),
    });

    const name = await getStateByZipCode('110001', {
      country: 'IN' as CountryCodeType,
    });
    expect(name).toBe('Delhi');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/country/subdivisions/IN.json'),
    );
  });

  it('returns a plain string, not an object', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(DELHI_RESPONSE),
    });
    const result = await getStateByZipCode('110001', {
      country: 'IN' as CountryCodeType,
    });
    expect(typeof result).toBe('string');
  });

  it('searches across all supported countries when country is omitted', async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      const cc = url.split('/').pop()?.split('.')[0];
      if (cc === 'IN')
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(DELHI_RESPONSE),
        });
      if (cc === 'US')
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(CA_RESPONSE),
        });
      return Promise.reject(new Error('unexpected'));
    });

    const name = await getStateByZipCode('90001');
    expect(name).toBe('California');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('trims whitespace from zipcode', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(DELHI_RESPONSE),
    });
    const name = await getStateByZipCode('  110001  ', {
      country: 'IN' as CountryCodeType,
    });
    expect(name).toBe('Delhi');
  });

  it('rejects on empty zipcode', async () => {
    await expect(
      getStateByZipCode('', { country: 'IN' as CountryCodeType }),
    ).rejects.toThrow('Zipcode is required.');
  });

  it('rejects on invalid country code', async () => {
    jest
      .spyOn(shared.I18NIFY_DATA_SUPPORTED_COUNTRIES, 'includes')
      .mockReturnValue(false);
    await expect(
      getStateByZipCode('110001', { country: 'XX' as CountryCodeType }),
    ).rejects.toThrow('Invalid country code: XX.');
  });

  it('rejects when zipcode not found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(DELHI_RESPONSE),
    });
    await expect(
      getStateByZipCode('999999', { country: 'IN' as CountryCodeType }),
    ).rejects.toThrow('Zipcode "999999" not found');
  });

  it('rejects on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(
      getStateByZipCode('110001', { country: 'IN' as CountryCodeType }),
    ).rejects.toThrow('An error occurred while fetching state data.');
  });

  it('rejects on malformed response (missing states)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    await expect(
      getStateByZipCode('110001', { country: 'IN' as CountryCodeType }),
    ).rejects.toThrow('An error occurred while fetching state data.');
  });

  it('handles state with no cities gracefully', async () => {
    const noCitiesResponse = { states: { DL: { name: 'Delhi', cities: {} } } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(noCitiesResponse),
    });
    await expect(
      getStateByZipCode('110001', { country: 'IN' as CountryCodeType }),
    ).rejects.toThrow('Zipcode "110001" not found');
  });
});
