import getStates from '../getStates';
import { INDIA_DATA } from '../mocks/country';
import { CountryDetailType } from '../types';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve<CountryDetailType>(INDIA_DATA),
  } as Response),
);

describe('getStates', () => {
  it('fetches states data correctly', async () => {
    const states = await getStates('IN');
    expect(states).toHaveProperty('DL');
    expect(states.DL.name).toBe('National Capital Territory of Delhi');
    expect(states.DL).toHaveProperty('cities');
  });

  it('throws error for invalid country code', async () => {
    // @ts-expect-error invalid state code for testing
    await expect(() => getStates('XYZ')).rejects.toEqual(
      `Invalid country code: XYZ`,
    );
  });

  it('handles API errors', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    await expect(getStates('IN')).rejects.toThrow('Error in API response');
  });
});
