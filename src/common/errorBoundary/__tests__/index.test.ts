import { withErrorBoundary, I18nifyError } from "../";

describe("withErrorBoundary", () => {
  it("should call the wrapped function and not throw an error if there are no exceptions", () => {
    const wrappedFunction = jest.fn();
    const wrappedUtilityFn = withErrorBoundary(wrappedFunction);

    wrappedUtilityFn("arg1", "arg2");

    expect(wrappedFunction).toHaveBeenCalledWith("arg1", "arg2");
    expect(() => wrappedUtilityFn("arg1", "arg2")).not.toThrow();
  });

  it("should throw an I18nifyError when an exception is thrown in the wrapped function", () => {
    const exceptionMessage = "Test error message";
    const throwingFunction = () => {
      throw new Error(exceptionMessage);
    };

    const wrappedUtilityFn = withErrorBoundary(throwingFunction);

    expect(() => wrappedUtilityFn()).toThrow(I18nifyError);
  });
});
