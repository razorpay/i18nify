import { withErrorBoundary } from '../../common/errorBoundary';
import type {
  IsValidNameOptions,
  NameValidationResult,
} from './types';
import { getNameValidationRules } from './data';

const DEFAULT_SEQUENTIAL_THRESHOLD = 4;
const DEFAULT_REPEATING_THRESHOLD = 3;
const DEFAULT_ALPHA_DOMINANCE_THRESHOLD = 0.5;

const DEFAULT_BLOCKLIST = [
  'test',
  'testing',
  'tester',
  'asdf',
  'asdfgh',
  'qwerty',
  'qwertyui',
  'qwer',
  'zxcv',
  'zxcvbn',
  'null',
  'undefined',
  'none',
  'na',
  'n/a',
  'nil',
  'void',
  'admin',
  'user',
  'noreply',
  'no-reply',
  'anonymous',
  'anon',
  'root',
  'guest',
  'system',
  'support',
  'contact',
  'name',
  'fullname',
  'firstname',
  'lastname',
  'your name',
  'enter name',
  'enter your name',
  'placeholder',
  'sample',
  'example',
  'demo',
  'dummy',
  'fake',
  'abc',
  'abcd',
  'abcde',
  'xyz',
  'xyzabc',
  'aaa',
  'bbb',
  'ccc',
  'xxx',
  'yyy',
  'zzz',
  '123',
  '1234',
  '12345',
  'aaaa',
  'bbbb',
  'cccc',
  'password',
  'pass',
  'login',
  'default',
];

const LETTER_REGEX = /\p{L}/u;
const WHITESPACE_REGEX = /\s/u;

const hasSequentialChars = (value: string, threshold: number): boolean => {
  const chars = Array.from(value).filter(
    (char) => !WHITESPACE_REGEX.test(char),
  );
  if (chars.length < threshold) return false;

  let ascendingRun = 1;
  let descendingRun = 1;

  for (let index = 1; index < chars.length; index++) {
    const current = chars[index].codePointAt(0);
    const previous = chars[index - 1].codePointAt(0);

    if (current === undefined || previous === undefined) {
      ascendingRun = 1;
      descendingRun = 1;
      continue;
    }

    const diff = current - previous;

    if (diff === 1) {
      ascendingRun += 1;
      if (ascendingRun >= threshold) return true;
    } else {
      ascendingRun = 1;
    }

    if (diff === -1) {
      descendingRun += 1;
      if (descendingRun >= threshold) return true;
    } else {
      descendingRun = 1;
    }
  }

  return false;
};

const hasRepeatingChars = (value: string, threshold: number): boolean => {
  const chars = Array.from(value);
  if (chars.length < threshold) return false;

  let run = 1;

  for (let index = 1; index < chars.length; index++) {
    if (chars[index] === chars[index - 1]) {
      run += 1;
      if (run >= threshold) return true;
    } else {
      run = 1;
    }
  }

  return false;
};

const isAlphaDominant = (value: string, threshold: number): boolean => {
  let nonWhitespaceCount = 0;
  let letterCount = 0;

  for (const char of Array.from(value)) {
    if (WHITESPACE_REGEX.test(char)) continue;

    nonWhitespaceCount += 1;
    if (LETTER_REGEX.test(char)) letterCount += 1;
  }

  if (nonWhitespaceCount === 0) return false;
  return letterCount / nonWhitespaceCount >= threshold;
};

/**
 * Validates a human name against common placeholder and garbage-input patterns.
 */
const isValidName = (
  name: string,
  options?: IsValidNameOptions,
): NameValidationResult => {
  if (!name || typeof name !== 'string') {
    throw new Error('name must be a non-empty string.');
  }

  const sequentialThreshold =
    options?.sequentialThreshold && options.sequentialThreshold > 0
      ? options.sequentialThreshold
      : DEFAULT_SEQUENTIAL_THRESHOLD;
  const repeatingThreshold =
    options?.repeatingThreshold && options.repeatingThreshold > 0
      ? options.repeatingThreshold
      : DEFAULT_REPEATING_THRESHOLD;
  const alphaDominanceThreshold =
    options?.alphaDominanceThreshold && options.alphaDominanceThreshold > 0
      ? options.alphaDominanceThreshold
      : DEFAULT_ALPHA_DOMINANCE_THRESHOLD;

  const blocklist = options?.blocklist
    ? options.allowBlocklistExtension
      ? [...DEFAULT_BLOCKLIST, ...options.blocklist]
      : options.blocklist
    : DEFAULT_BLOCKLIST;

  const trimmed = name.trim();

  if (trimmed === '') {
    throw new Error('name must be a non-empty string.');
  }

  const { min_length: minLength, max_length: maxLength } =
    getNameValidationRules();
  const nameLength = Array.from(trimmed).length;

  if (nameLength < minLength) {
    return { isValid: false, reason: 'too_short' };
  }

  if (nameLength > maxLength) {
    return { isValid: false, reason: 'too_long' };
  }

  const normalized = trimmed.toLowerCase();

  if (blocklist.some((entry) => normalized === entry.toLowerCase())) {
    return { isValid: false, reason: 'blocklisted' };
  }

  if (hasSequentialChars(normalized, sequentialThreshold)) {
    return { isValid: false, reason: 'sequential_chars' };
  }

  if (hasRepeatingChars(normalized, repeatingThreshold)) {
    return { isValid: false, reason: 'repeating_chars' };
  }

  if (!isAlphaDominant(normalized, alphaDominanceThreshold)) {
    return { isValid: false, reason: 'non_alpha_dominant' };
  }

  return { isValid: true };
};

export default withErrorBoundary<typeof isValidName>(isValidName);
