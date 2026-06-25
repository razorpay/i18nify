/** Common placeholder, test, and garbage names that should never be accepted. */
export const DEFAULT_NAME_BLOCKLIST: string[] = [
  // test / placeholder inputs
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
  // null-like / undefined values
  'null',
  'undefined',
  'none',
  'na',
  'n/a',
  'nil',
  'void',
  // role / system names
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
  // empty label fillers
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
  // numeric / sequential strings
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
  // single-character repeats
  'aaaa',
  'bbbb',
  'cccc',
  // known garbage tokens
  'password',
  'pass',
  'login',
  'default',
];

export const DEFAULT_SEQUENTIAL_THRESHOLD = 4;
export const DEFAULT_REPEATING_THRESHOLD = 3;
/** Minimum fraction (0–1) of non-whitespace characters that must be alphabetic. */
export const DEFAULT_ALPHA_DOMINANCE_THRESHOLD = 0.5;
