import getMandateFrequencyLabel from '../getMandateFrequencyLabel';

describe('getMandateFrequencyLabel', () => {
  it('returns monthly frequency metadata', () => {
    expect(getMandateFrequencyLabel('MONTHLY')).toEqual({
      label: 'Monthly',
      description: 'Recurring every month',
      days: 30,
    });
  });

  it('supports aliases and case-insensitive lookup', () => {
    expect(getMandateFrequencyLabel('annual')).toEqual({
      label: 'Annual',
      description: 'Recurring every year',
      days: 365,
    });
  });

  it('returns variable-frequency metadata for AS_PRESENTED', () => {
    expect(getMandateFrequencyLabel('AS_PRESENTED')).toEqual({
      label: 'As Presented',
      description: 'Collected as and when presented by the merchant',
    });
  });

  it('throws for empty input', () => {
    expect(() => getMandateFrequencyLabel('')).toThrow(
      "Parameter 'frequencyCode' is invalid! The received value was: .",
    );
  });

  it('throws for unsupported codes', () => {
    expect(() => getMandateFrequencyLabel('HOURLY')).toThrow(
      'Frequency code "HOURLY" is not supported.',
    );
  });
});
