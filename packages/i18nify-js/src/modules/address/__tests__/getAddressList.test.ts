import getAddressList from '../getAddressList';

describe('getAddressList', () => {
  it('returns all address entries', () => {
    const list = getAddressList();
    expect(typeof list).toBe('object');
    expect(Object.keys(list).length).toBeGreaterThan(0);
  });

  it('each entry has expected shape', () => {
    const list = getAddressList();
    const sample = Object.values(list)[0] as Record<string, unknown>;
    expect(typeof sample).toBe('object');
  });
});
