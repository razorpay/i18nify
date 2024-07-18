import { ByParts } from '../../types';

export const getMockParts = (symbol: string): ByParts['rawParts'] => [
  { type: 'currency', value: symbol },
  { type: 'integer', value: '1000' },
  { type: 'decimal', value: '.' },
  { type: 'fraction', value: '00' },
];
