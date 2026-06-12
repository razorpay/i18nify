import getPrimaryTimezone from '../getPrimaryTimezone';

const mockMetadata = {
  metadata_information: {
    IN: { timezone_of_capital: 'Asia/Kolkata' },
    US: { timezone_of_capital: 'America/New_York' },
    RU: { timezone_of_capital: 'Europe/Moscow' },
  },
};

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockMetadata),
  } as unknown as Response);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('getPrimaryTimezone', () => {
  it('returns the primary timezone for a country', async () => {
    await expect(getPrimaryTimezone('IN')).resolves.toBe('Asia/Kolkata');
    await expect(getPrimaryTimezone('us')).resolves.toBe('America/New_York');
  });

  it('rejects empty input', async () => {
    await expect(getPrimaryTimezone('')).rejects.toThrow();
  });

  it('rejects unknown country code', async () => {
    await expect(getPrimaryTimezone('ZZ')).rejects.toThrow(/ZZ/);
  });
});
