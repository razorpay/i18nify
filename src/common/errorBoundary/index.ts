// Custom Error class to extend properties to error object
export class I18nifyError extends Error {
  timestamp: Date;
  constructor(message) {
    super(message);
    this.name = 'i18nify Error';
    this.timestamp = new Date();
    // more params like type of error/severity can be added in future for better debugging.
  }
}

/**
 * withErrorBoundary is a higher order function that takes function as parameter and wraps it in try/catch block.
 * It appends additional attributes and serves as a centralized error-handling service.
 * Usage =>
 * const wrappedUtilityFn = withErrorBoundary(utilityFn)
 *
 * @param fn utility that is wrapped in error boundary
 * @returns {Function} returns the function wrapped in try/catch block
 */
export const withErrorBoundary = <T extends (...args: unknown[]) => unknown>(
  fn: T,
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return function (...rest: Parameters<T>) {
    try {
      return fn.call(this, ...rest);
    } catch (err) {
      // Currently, we are throwing the error as it is to consumers.
      // In the future, this can be modified as per our requirement, like an error logging service.
      throw new I18nifyError(err);
    }
  };
};
