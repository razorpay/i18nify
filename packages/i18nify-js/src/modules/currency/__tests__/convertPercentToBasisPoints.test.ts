import { convertPercentToBasisPoints } from '../index';

describe('currency - convertPercentToBasisPoints', () => {
  const testCases: { percent: number; expected: number }[] = [
    { percent: 2.5, expected: 250 },
    { percent: 1, expected: 100 },
    { percent: 0.01, expected: 1 },
    { percent: 0, expected: 0 },
    { percent: 100, expected: 10000 },
    { percent: -0.5, expected: -50 },
  ];

  testCases.forEach(({ percent, expected }) => {
    it(`converts ${percent}% to ${expected} bps`, () => {
      expect(convertPercentToBasisPoints(percent)).toBe(expected);
    });
  });

  it('throws for NaN input', () => {
    expect(() => convertPercentToBasisPoints(NaN)).toThrow(
      'convertPercentToBasisPoints expects a finite number',
    );
  });

  it('throws for Infinity input', () => {
    expect(() => convertPercentToBasisPoints(Infinity)).toThrow(
      'convertPercentToBasisPoints expects a finite number',
    );
  });
});
