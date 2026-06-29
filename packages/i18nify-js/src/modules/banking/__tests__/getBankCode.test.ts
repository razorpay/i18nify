import { getBankCode } from '../index';

global.fetch = jest.fn();

describe('getBankCode', () => {
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

  test('should return the short code for a valid bank name', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    const code = await getBankCode(mockCountryCode, 'HDFC Bank');
    expect(code).toBe('HDFC');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${mockCountryCode}.json`),
    );
  });

  test('should perform case-insensitive bank name matching', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    const code = await getBankCode(mockCountryCode, 'state bank of india');
    expect(code).toBe('SBIN');
  });

  test('should throw an error for an invalid country code', async () => {
    const invalidCountryCode = 'XX';
    await expect(
      getBankCode(invalidCountryCode as any, 'HDFC Bank'),
    ).rejects.toThrow(
      `Data not available for country code: ${invalidCountryCode}.`,
    );
  });

  test('should throw an error when bank name is empty', async () => {
    await expect(getBankCode(mockCountryCode, '')).rejects.toThrow(
      'Bank name must not be empty.',
    );
  });

  test('should throw an error when bank name is whitespace only', async () => {
    await expect(getBankCode(mockCountryCode, '   ')).rejects.toThrow(
      'Bank name must not be empty.',
    );
  });

  test('should throw an error when no bank matches the name', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    await expect(
      getBankCode(mockCountryCode, 'Nonexistent Bank'),
    ).rejects.toThrow('No bank found with name "Nonexistent Bank"');
  });

  test('should throw an error for a bank that has no short code', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        details: [{ name: 'No Code Bank', short_code: '' }],
      }),
    });

    await expect(getBankCode(mockCountryCode, 'No Code Bank')).rejects.toThrow(
      'Bank "No Code Bank" in country IN does not have a short code.',
    );
  });

  test('should throw an error when API responds with non-2xx status', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(getBankCode(mockCountryCode, 'HDFC Bank')).rejects.toThrow(
      `Failed to load bank data for country: ${mockCountryCode}.`,
    );
  });

  test('should handle network failure gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(getBankCode(mockCountryCode, 'HDFC Bank')).rejects.toThrow(
      'An error occurred while fetching bank data. The error details are: Network Error.',
    );
  });

  test('should handle missing details key in response gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}), // Missing `details`
    });

    await expect(getBankCode(mockCountryCode, 'HDFC Bank')).rejects.toThrow(
      'No bank found with name "HDFC Bank"',
    );
  });
});
