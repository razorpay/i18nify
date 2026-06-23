export { default as getHonorificTitles } from './getHonorificTitles';
export { default as isValidName } from './isValidName';
export type {
  HonorificTitle,
  ValidationRules,
  NamesData,
  IsValidNameOptions,
  NameValidationResult,
  NameValidationReason,
} from './types';
export {
  DEFAULT_NAME_BLOCKLIST,
  DEFAULT_SEQUENTIAL_THRESHOLD,
  DEFAULT_REPEATING_THRESHOLD,
  DEFAULT_ALPHA_DOMINANCE_THRESHOLD,
} from './constants';
export { hasSequentialChars, hasRepeatingChars, isAlphaDominant } from './utils';
