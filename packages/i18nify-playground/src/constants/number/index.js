export const NUMBER_FORMAT_INTL_INPUTS = [
  {
    key: 'style',
    label: 'Number Style',
    type: 'select',
    options: ['decimal', 'percent'],
    defaultValue: 'decimal',
  },
  {
    key: 'notation',
    label: 'Notation',
    type: 'select',
    options: ['standard', 'scientific', 'engineering', 'compact'],
    defaultValue: 'standard',
  },
  {
    key: 'currencyDisplay',
    label: 'Currency Display',
    type: 'select',
    options: ['code', 'symbol', 'narrowSymbol', 'name'],
    defaultValue: 'symbol',
  },
  {
    key: 'minimumFractionDigits',
    label: 'Min Fraction digits',
    type: 'number',
    defaultValue: 0,
  },
  {
    key: 'maximumFractionDigits',
    label: 'Max Fraction digits',
    type: 'number',
    defaultValue: 0,
  },
  {
    key: 'trailingZeroDisplay',
    label: 'Trailing zero display',
    type: 'select',
    options: ['auto', 'stripIfInteger'],
    defaultValue: 'auto',
  },

  {
    key: 'minimumSignificantDigits',
    label: 'Min Significant digits',
    type: 'number',
    defaultValue: 1,
    textInputHelper:
      'The valid range is between 1 and 21 and it should be less than Max Significant digits',
  },
  {
    key: 'maximumSignificantDigits',
    label: 'Max Significant digits',
    type: 'number',
    defaultValue: 2,
    textInputHelper:
      'The valid range is between 1 and 21 and it should be greater than Min Significant digits',
  },
  {
    key: 'useGrouping',
    label: 'Use Grouping',
    type: 'select',
    options: ['true', 'false'],
    defaultValue: 'true',
  },

  {
    key: 'compactDisplay',
    label: 'Compact Display',
    options: ['short', 'long'],
    type: 'select',
    defaultValue: 'short',
  },
  {
    key: 'minimumExponentDigits',
    label: 'Min Exponent Digits',
    type: 'number',
    defaultValue: 1,
  },
  {
    key: 'roundingType',
    label: 'Rounding Type',
    type: 'select',
    options: ['ceil', 'floor', 'round', 'trunc'],
    defaultValue: 'round',
  },

  {
    key: 'minimumIntegerDigits',
    label: 'Min Integer digits',
    type: 'number',
    defaultValue: 1,
  },
];
