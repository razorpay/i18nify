export const mockFormatToParts = jest
  .fn()
  .mockImplementation(() => [{ type: 'month', value: 'January' }]);

export const mockDateFormatter = jest.fn().mockImplementation(() => ({
  formatToParts: mockFormatToParts,
}));

jest.mock('@internationalized/date', () => ({
  DateFormatter: mockDateFormatter,
}));
