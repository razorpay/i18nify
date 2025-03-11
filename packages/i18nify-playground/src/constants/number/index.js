export const NUMBER_FORMAT_INTL_INPUTS = [
  {
    key: 'style',
    label: 'Number Style',
    type: 'select',
    options: ['decimal', 'percent'],
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
  },
  {
    key: 'minimumFractionDigits',
    label: 'Min Fraction digits',
    type: 'number',
  },
  {
    key: 'trailingZeroDisplay',
    label: 'Trailing zero display',
    type: 'select',
    options: ['auto', 'stripIfInteger'],
  },
  {
    key: 'maximumFractionDigits',
    label: 'Max Fraction digits',
    type: 'number',
    max: 2,
  },
  {
    key: 'minimumSignificantDigits',
    label: 'Min Significant digits',
    type: 'number',
    max: 2,
  },
  {
    key: 'maximumSignificantDigits',
    label: 'Max Significant digits',
    type: 'number',
    max: 2,
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
  },
];
