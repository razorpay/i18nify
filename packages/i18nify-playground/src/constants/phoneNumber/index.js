export const PHONE_MASKING_INPUTS = [
  {
    key: 'maskingStyle',
    label: 'Masking Style',
    type: 'select',
    options: ['full', 'prefix', 'suffix', 'alternate'],
    defaultValue: 'full',
  },
  {
    key: 'maskingChar',
    label: 'Masking Character',
    type: 'text',
    defaultValue: '*',
  },
  {
    key: 'maskedDigitsCount',
    label: 'Masked Digit Counts',
    type: 'number',
    defaultValue: '0',
  },
];
