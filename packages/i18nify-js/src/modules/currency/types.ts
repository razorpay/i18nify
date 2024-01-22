import { ALLOWED_FORMAT_PARTS_KEYS } from './constants';

export type FormattedPartsObject = {
  [key in (typeof ALLOWED_FORMAT_PARTS_KEYS)[number]]?: string | undefined;
};
export interface ByParts extends FormattedPartsObject {
  isPrefixSymbol: boolean;
  rawParts: Array<{ type: string; value: unknown }>;
}
