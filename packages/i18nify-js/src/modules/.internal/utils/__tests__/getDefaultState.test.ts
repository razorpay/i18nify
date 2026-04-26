import { getDefaultState } from '..';

describe('getDefaultState', () => {
  it('returns the default state object', () => {
    const defaultState = {
      locale: '',
      direction: 'ltr',
      country: '',
    };

    const result = getDefaultState();

    expect(result).toEqual(defaultState);
  });
});
