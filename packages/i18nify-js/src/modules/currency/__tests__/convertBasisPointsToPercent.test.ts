import { convertBasisPointsToPercent } from '../index';

describe('currency - convertBasisPointsToPercent', () => {
  const testCases: { basisPoints: number; expected: number }[] = [
    { basisPoints: 250, expected: 2.5 },
    { basisPoints: 100, expected: 1 },
    { basisPoints: 1, expected: 0.01 },
    { basisPoints: 0, expected: 0 },
    { basisPoints: 10000, expected: 100 },
    { basisPoints: -50, expected: -0.5 },
  ];

  testCases.forEach(({ basisPoints, expected }) => {
    it(`converts ${basisPoints} bps to ${expected}%`, () => {
      expect(convertBasisPointsToPercent(basisPoints)).toBe(expected);
    });
  });

  it('throws for NaN input', () => {
    expect(() => convertBasisPointsToPercent(NaN)).toThrow(
      'convertBasisPointsToPercent expects a finite number',
    );
  });

  it('throws for Infinity input', () => {
    expect(() => convertBasisPointsToPercent(Infinity)).toThrow(
      'convertBasisPointsToPercent expects a finite number',
    );
  });
});
