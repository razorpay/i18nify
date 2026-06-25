import unflattenKeys from '../unflattenKeys';

jest.mock('../../../common/errorBoundary', () => ({
  withErrorBoundary: jest.fn((fn) => fn),
}));

describe('unflattenKeys', () => {
  it('rebuilds a nested object with the default delimiter', () => {
    expect(
      unflattenKeys({
        'user.name': 'Ada',
        'user.address.city': 'London',
      }),
    ).toEqual({
      user: {
        name: 'Ada',
        address: {
          city: 'London',
        },
      },
    });
  });

  it('supports a custom delimiter', () => {
    expect(
      unflattenKeys(
        {
          'user/profile/city': 'Mumbai',
        },
        { delimiter: '/' },
      ),
    ).toEqual({
      user: {
        profile: {
          city: 'Mumbai',
        },
      },
    });
  });

  it('replaces non-object intermediates while rebuilding nested values', () => {
    expect(
      unflattenKeys({
        user: 'Ada',
        'user.name': 'Grace',
      }),
    ).toEqual({
      user: {
        name: 'Grace',
      },
    });
  });

  it('throws when the input is not a plain object', () => {
    expect(() =>
      unflattenKeys([] as unknown as Record<string, unknown>),
    ).toThrow('unflattenKeys: input must be a plain object.');
  });

  it('throws when the delimiter is empty', () => {
    expect(() =>
      unflattenKeys({ 'user.name': 'Ada' }, { delimiter: '' }),
    ).toThrow('unflattenKeys: delimiter must be a non-empty string.');
  });
});
