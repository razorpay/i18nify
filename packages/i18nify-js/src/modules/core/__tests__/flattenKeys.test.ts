import flattenKeys from '../flattenKeys';

jest.mock('../../../common/errorBoundary', () => ({
  withErrorBoundary: jest.fn((fn) => fn),
}));

describe('flattenKeys', () => {
  it('flattens nested objects with the default delimiter', () => {
    expect(
      flattenKeys({
        user: {
          name: 'Ada',
          address: {
            city: 'London',
          },
        },
      }),
    ).toEqual({
      'user.name': 'Ada',
      'user.address.city': 'London',
    });
  });

  it('preserves arrays and null values as leaf nodes', () => {
    expect(
      flattenKeys({
        user: {
          aliases: ['Ada', 'Lovelace'],
          preferences: null,
        },
      }),
    ).toEqual({
      'user.aliases': ['Ada', 'Lovelace'],
      'user.preferences': null,
    });
  });

  it('supports a custom delimiter', () => {
    expect(
      flattenKeys(
        {
          user: {
            profile: {
              city: 'Mumbai',
            },
          },
        },
        { delimiter: '/' },
      ),
    ).toEqual({
      'user/profile/city': 'Mumbai',
    });
  });

  it('throws when the input is not a plain object', () => {
    expect(() => flattenKeys([] as unknown as Record<string, unknown>)).toThrow(
      'flattenKeys: input must be a plain object.',
    );
  });

  it('throws when the delimiter is empty', () => {
    expect(() =>
      flattenKeys({ user: { name: 'Ada' } }, { delimiter: '' }),
    ).toThrow('flattenKeys: delimiter must be a non-empty string.');
  });
});
