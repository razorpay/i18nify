export const mockFormatToParts = jest.fn().mockImplementation(() => [
  { type: 'month', value: 'January' },
  { type: 'day', value: '1' },
  { type: 'year', value: '2024' },
]);

export const mockDateFormatter = jest.fn().mockImplementation(() => ({
  formatToParts: mockFormatToParts,
}));

jest.mock('@internationalized/date', () => ({
  DateFormatter: mockDateFormatter,
}));
