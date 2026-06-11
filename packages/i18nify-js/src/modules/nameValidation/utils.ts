/**
 * Returns true if `str` contains a run of `threshold` or more characters
 * whose Unicode code points increment (ascending) or decrement (descending)
 * by exactly 1 each step — e.g. "abcd" or "4321".
 */
export function hasSequentialChars(str: string, threshold: number): boolean {
  // [...str] handles surrogate pairs / multibyte characters correctly
  const chars = [...str];
  if (chars.length < threshold) return false;

  let ascRun = 1;
  let descRun = 1;

  for (let i = 1; i < chars.length; i++) {
    const diff =
      (chars[i].codePointAt(0) ?? 0) - (chars[i - 1].codePointAt(0) ?? 0);

    if (diff === 1) {
      if (++ascRun >= threshold) return true;
    } else {
      ascRun = 1;
    }

    if (diff === -1) {
      if (++descRun >= threshold) return true;
    } else {
      descRun = 1;
    }
  }
  return false;
}

/**
 * Returns true if `str` contains a run of `threshold` or more identical
 * characters — e.g. "aaa" with threshold 3.
 */
export function hasRepeatingChars(str: string, threshold: number): boolean {
  const chars = [...str];
  if (chars.length < threshold) return false;

  let run = 1;
  for (let i = 1; i < chars.length; i++) {
    if (chars[i] === chars[i - 1]) {
      if (++run >= threshold) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

/**
 * Returns true when the fraction of alphabetic characters among all
 * non-whitespace characters in `str` is at least `threshold`.
 *
 * Whitespace is excluded so "John Doe" (9/9 non-ws alpha) is not penalised
 * for the space.
 */
export function isAlphaDominant(str: string, threshold: number): boolean {
  const nonWs = [...str].filter((c) => !/\s/.test(c));
  if (nonWs.length === 0) return false;
  const alphaCount = nonWs.filter((c) => /\p{L}/u.test(c)).length;
  return alphaCount / nonWs.length >= threshold;
}
