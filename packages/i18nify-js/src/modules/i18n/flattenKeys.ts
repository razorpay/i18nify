import { withErrorBoundary } from '../../common/errorBoundary';
import { DEFAULT_DELIMITER } from './constants';
import type { FlattenOptions, JsonObject } from './types';

function _flatten(
  obj: JsonObject,
  delimiter: string,
  prefix: string,
  result: JsonObject,
): void {
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}${delimiter}${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      _flatten(value as JsonObject, delimiter, fullKey, result);
    } else {
      result[fullKey] = value;
    }
  }
}

const flattenKeys = (obj: JsonObject, options?: FlattenOptions): JsonObject => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('flattenKeys: input must be a plain object.');
  }
  const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;
  if (!delimiter) {
    throw new Error('flattenKeys: delimiter must be a non-empty string.');
  }
  const result: JsonObject = {};
  _flatten(obj, delimiter, '', result);
  return result;
};

export default withErrorBoundary<typeof flattenKeys>(flattenKeys);
