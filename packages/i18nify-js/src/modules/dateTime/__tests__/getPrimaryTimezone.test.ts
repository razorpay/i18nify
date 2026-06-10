import getPrimaryTimezone from '../getPrimaryTimezone';

const mockMetadata = {
  metadata_information: {
    IN: { timezone_of_capital: 'Asia/Kolkata' },
    US: { timezone_of_capital: 'America/New_York' },
    RU: { timezone_of_capital: 'Europe/Moscow' },
    AU: { timezone_of_capital: 'Australia/Sydney' },
    GB: { timezone_of_capital: 'Europe/London' },
    DE: { timezone_of_capital: 'Europe/Berlin' },
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
  it('returns primary timezone for single-tz country (IN)', async () => {
    await expect(getPrimaryTimezone('IN')).resolves.toBe('Asia/Kolkata');
  });

  it('returns capital timezone for multi-tz country (US)', async () => {
    await expect(getPrimaryTimezone('US')).resolves.toBe('America/New_York');
  });

  it('returns capital timezone for multi-tz country (RU)', async () => {
    await expect(getPrimaryTimezone('RU')).resolves.toBe('Europe/Moscow');
  });

  it('is case-insensitive (lowercase input)', async () => {
    await expect(getPrimaryTimezone('in')).resolves.toBe('Asia/Kolkata');
  });

  it('is case-insensitive (mixed case input)', async () => {
    await expect(getPrimaryTimezone('Au')).resolves.toBe('Australia/Sydney');
  });

  it('rejects for empty string', async () => {
    await expect(getPrimaryTimezone('')).rejects.toThrow();
  });

  it('rejects for whitespace-only input', async () => {
    await expect(getPrimaryTimezone('  ')).rejects.toThrow();
  });

  it('rejects for unknown country code', async () => {
    await expect(getPrimaryTimezone('ZZ')).rejects.toThrow(/ZZ/);
  });

  it('rejects when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('network error'),
    );
    await expect(getPrimaryTimezone('IN')).rejects.toThrow(/network error/);
  });

  it('rejects when response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as unknown as Response);
    await expect(getPrimaryTimezone('IN')).rejects.toThrow(/404/);
  });
});
