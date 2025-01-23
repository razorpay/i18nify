import getBankCode from '../getBankCode';

// A mock object to simulate the data returned by the fetch call
// You can customize this as needed for your tests
const mockBankData = {
  details: [
    {
      name: 'Abhyudaya Co-operative Bank',
      short_code: 'ABHY',
    },
    {
      name: 'SBI Bank',
      short_code: 'SBI',
    },
  ],
};

// Mock global.fetch by default to return `mockBankData`
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(mockBankData),
  } as Response),
);

describe('getBankCode', () => {
  beforeEach(() => {
    // Reset fetch mock before each test case
    jest.clearAllMocks();
  });

  it('should reject if the bank is not found in the details array', async () => {
    const bankName = 'Non Existent Bank';

    await expect(getBankCode('IN', bankName)).rejects.toThrow(
      `Unable to find bank code for bank "${bankName}" in IN. Please ensure the bank name is correct.`,
    );
  });

  it('should return bank code for a valid country code and bank name', async () => {
    const countryCode = 'IN';
    const bankName = 'Abhyudaya Co-operative Bank';

    const result = await getBankCode(countryCode, bankName);

    expect(result).toBe('ABHY');
  });

  it('should reject with an error message when country code is invalid', async () => {
    const invalidCountryCode = 'XYZ';
    const bankName = 'Abhyudaya Co-operative Bank';

    await expect(
      getBankCode(invalidCountryCode as any, bankName),
    ).rejects.toThrow(
      `Data not available for country code: XYZ. Data only available for country codes mentioned here: https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/src/modules/geo/constants.ts#L8`,
    );
  });

  it('should reject when bankName is not provided', async () => {
    // @ts-expect-error Testing scenario with missing bank name
    await expect(getBankCode('IN')).rejects.toThrow(
      'Bank name is required to fetch the bank code. Please provide a valid bank name.',
    );
  });

  it('should reject if the data is not in the expected format (missing details array)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}), // details is missing
      } as Response),
    );

    await expect(getBankCode('IN', 'SBI Bank')).rejects.toThrow(
      'Bank data is not in the expected format for IN.',
    );
  });

  it('should reject if the bank is found but bank code is missing', async () => {
    // Adjust mock data so the found bank does not have bank code
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            details: [{ name: 'Bank Without Shortcode' }],
          }),
      } as Response),
    );

    const bankName = 'Bank Without Shortcode';

    await expect(getBankCode('IN', bankName)).rejects.toThrow(
      `Unable to find bank code for bank "${bankName}" in IN. Please ensure the bank name is correct.`,
    );
  });

  it('should handle network or fetch errors gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));

    await expect(
      getBankCode('IN', 'Abhyudaya Co-operative Bank'),
    ).rejects.toThrow(
      'An error occurred while fetching bank bank code. The error details are: undefined.',
    );
  });
});
