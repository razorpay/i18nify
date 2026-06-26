import { getBankNameByCode } from '../index';

global.fetch = jest.fn();

describe('getBankNameByCode', () => {
  const mockCountryCode = 'IN';
  const mockBankData = {
    details: [
      { name: 'State Bank of India', short_code: 'SBIN' },
      { name: 'HDFC Bank', short_code: 'HDFC' },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the bank name for a valid short code', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    const name = await getBankNameByCode(mockCountryCode, 'SBIN');
    expect(name).toBe('State Bank of India');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${mockCountryCode}.json`),
    );
  });

  test('should perform case-insensitive short code matching', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    const name = await getBankNameByCode(mockCountryCode, 'hdfc');
    expect(name).toBe('HDFC Bank');
  });

  test('should throw an error for an invalid country code', async () => {
    const invalidCountryCode = 'XX';
    await expect(
      getBankNameByCode(invalidCountryCode as any, 'SBIN'),
    ).rejects.toThrow(
      `Data not available for country code: ${invalidCountryCode}.`,
    );
  });

  test('should throw an error when bank code is empty', async () => {
    await expect(getBankNameByCode(mockCountryCode, '')).rejects.toThrow(
      'Bank code must not be empty.',
    );
  });

  test('should throw an error when bank code is whitespace only', async () => {
    await expect(getBankNameByCode(mockCountryCode, '   ')).rejects.toThrow(
      'Bank code must not be empty.',
    );
  });

  test('should throw an error when no bank matches the short code', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    await expect(getBankNameByCode(mockCountryCode, 'ZZZZ')).rejects.toThrow(
      'No bank found with short code "ZZZZ"',
    );
  });

  test('should throw an error when API responds with non-2xx status', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(getBankNameByCode(mockCountryCode, 'SBIN')).rejects.toThrow(
      `Failed to load bank data for country: ${mockCountryCode}.`,
    );
  });

  test('should handle network failure gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(getBankNameByCode(mockCountryCode, 'SBIN')).rejects.toThrow(
      'An error occurred while fetching bank data. The error details are: Network Error.',
    );
  });

  test('should handle missing details key in response gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}), // Missing `details`
    });

    await expect(getBankNameByCode(mockCountryCode, 'SBIN')).rejects.toThrow(
      'No bank found with short code "SBIN"',
    );
  });
});
