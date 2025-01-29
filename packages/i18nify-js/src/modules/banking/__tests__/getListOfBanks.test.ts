import { getListOfBanks } from '../index';

global.fetch = jest.fn();

describe('getListOfBanks', () => {
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

  test('should fetch and return list of banks successfully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBankData),
    });

    const banks = await getListOfBanks(mockCountryCode);
    expect(banks).toEqual(mockBankData.details);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${mockCountryCode}.json`),
    );
  });

  test('should throw an error for invalid country code', async () => {
    const invalidCountryCode = 'XX'; // Not in `I18NIFY_DATA_SUPPORTED_COUNTRIES`
    await expect(getListOfBanks(invalidCountryCode as any)).rejects.toThrow(
      `Data not available for country code: ${invalidCountryCode}. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
    );
  });

  test('should throw an error when API responds with non-2xx status', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false, // Simulating API failure
    });

    await expect(getListOfBanks(mockCountryCode)).rejects.toThrow(
      `Failed to load bank data for country: ${mockCountryCode}.`,
    );
  });

  test('should handle unexpected response format gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}), // Missing `details` key
    });

    const banks = await getListOfBanks(mockCountryCode);
    expect(banks).toEqual([]); // Should return an empty array
  });

  test('should handle network failure gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(getListOfBanks(mockCountryCode)).rejects.toThrow(
      `An error occurred while fetching bank data. The error details are: Network Error.`,
    );
  });
});
