import getRoutingLabel from '../getRoutingLabel';

describe('getRoutingLabel', () => {
  it('returns IFSC label metadata', () => {
    expect(getRoutingLabel('IFSC')).toEqual({
      label: 'IFSC',
      full_name: 'Indian Financial System Code',
      description: expect.stringContaining('RBI'),
      country: 'IN',
    });
  });

  it('is case-insensitive', () => {
    expect(getRoutingLabel('swift').label).toBe('SWIFT Code');
  });

  it('throws for empty input', () => {
    expect(() => getRoutingLabel('')).toThrow(
      "Parameter 'routingCodeType' is invalid! The received value was: .",
    );
  });

  it('throws for unsupported types', () => {
    expect(() => getRoutingLabel('FOO')).toThrow(
      'Routing code type "FOO" is not supported.',
    );
  });
});
