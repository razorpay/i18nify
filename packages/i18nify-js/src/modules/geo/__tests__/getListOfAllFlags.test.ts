import getListOfAllFlags from '../getListOfAllFlags';

// Mocking the flags import to control the test environment
jest.mock('../data/countryFlagSvgs/index.ts', () => ({
  AD: '<svg>AD</svg>',
  AE: '<svg>AE</svg>',
  AF: '<svg>AF</svg>',
}));

describe('geo - getListOfAllFlags', () => {
  it('should correctly map country codes to their flag SVG content', () => {
    const expectedFlagMap = {
      AD: '<svg>AD</svg>',
      AE: '<svg>AE</svg>',
      AF: '<svg>AF</svg>',
    };

    const flagMap = getListOfAllFlags();

    // Ensure TypeScript knows that countryCode is a key of expectedFlagMap
    Object.keys(expectedFlagMap).forEach((countryCode) => {
      expect(flagMap[countryCode as keyof typeof expectedFlagMap]).toEqual(
        expectedFlagMap[countryCode as keyof typeof expectedFlagMap],
      );
    });

    // The `flagMap` object may include a `default` property due to Rollup's handling of ES module interop with CommonJS.
    // This property is an artifact of the compilation process and does not represent a valid country code.
    // Filtering out this `default` property ensures our length comparison reflects only the actual country codes,
    // maintaining the accuracy of our test by focusing on the intended data structure without being affected by
    // compilation artifacts.
    // Github Discussion: https://github.com/rollup/plugins/issues/635
    const filteredKeys = Object.keys(flagMap).filter(
      (key) => key !== 'default',
    );
    expect(filteredKeys.length).toEqual(Object.keys(expectedFlagMap).length);
  });
});
