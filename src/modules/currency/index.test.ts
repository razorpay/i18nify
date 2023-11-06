import { test } from './'; // Replace 'your-module' with the actual path to your module

describe('test function', () => {
  it('should return "a" when input is 1', () => {
    const result = test(1);
    expect(result).toBe('a');
  });

  it('should return "b" for any input other than 1', () => {
    const result = test(2); // Replace with other test cases as needed
    expect(result).toBe('b');
  });
});
