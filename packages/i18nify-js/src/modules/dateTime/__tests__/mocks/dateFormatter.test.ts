import { mockFormatToParts, mockDateFormatter } from './dateFormatter';

describe('dateFormatter mock', () => {
  describe('mockFormatToParts', () => {
    test('returns month part by default', () => {
      const result = mockFormatToParts();
      expect(result).toEqual([{ type: 'month', value: 'January' }]);
    });

    test('mock can be spied on', () => {
      mockFormatToParts();
      expect(mockFormatToParts).toHaveBeenCalled();
    });

    test('mock implementation can be changed', () => {
      const newParts = [
        { type: 'month', value: 'February' },
        { type: 'day', value: '1' },
      ];
      mockFormatToParts.mockImplementationOnce(() => newParts);
      expect(mockFormatToParts()).toEqual(newParts);
    });
  });

  describe('mockDateFormatter', () => {
    test('returns object with formatToParts', () => {
      const formatter = mockDateFormatter();
      expect(formatter).toHaveProperty('formatToParts');
      expect(formatter.formatToParts).toBe(mockFormatToParts);
    });

    test('mock can be spied on', () => {
      mockDateFormatter();
      expect(mockDateFormatter).toHaveBeenCalled();
    });

    test('mock implementation can be changed', () => {
      const newFormatter = { formatToParts: jest.fn() };
      mockDateFormatter.mockImplementationOnce(() => newFormatter);
      expect(mockDateFormatter()).toBe(newFormatter);
    });
  });

  describe('@internationalized/date mock', () => {
    test('exports DateFormatter as mockDateFormatter', () => {
      const { DateFormatter } = jest.requireMock('@internationalized/date');
      expect(DateFormatter).toBe(mockDateFormatter);
    });
  });
});
