import { withErrorBoundary } from '../../common/errorBoundary';
import { DEFAULT_DELIMITER } from './constants';
import type { JsonObject, UnflattenOptions } from './types';

const unflattenKeys = (
  obj: JsonObject,
  options?: UnflattenOptions,
): JsonObject => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('unflattenKeys: input must be a plain object.');
  }
  const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;
  if (!delimiter) {
    throw new Error('unflattenKeys: delimiter must be a non-empty string.');
  }
  const result: JsonObject = {};
  for (const flatKey of Object.keys(obj)) {
    const parts = flatKey.split(delimiter);
    let cursor: JsonObject = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const existing = cursor[part];
      if (
        existing === null ||
        typeof existing !== 'object' ||
        Array.isArray(existing)
      ) {
        cursor[part] = {};
      }
      cursor = cursor[part] as JsonObject;
    }
    cursor[parts[parts.length - 1]] = obj[flatKey];
  }
  return result;
};

export default withErrorBoundary<typeof unflattenKeys>(unflattenKeys);
