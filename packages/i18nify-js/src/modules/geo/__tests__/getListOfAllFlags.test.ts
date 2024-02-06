import * as fs from 'fs';
import * as path from 'path';
import getListOfAllFlags from '../getListOfAllFlags';

// Mock the fs and path modules
jest.mock('fs');
jest.mock('path');

describe('geo - getListOfAllFlags', () => {
  const mockCountryCode = 'AE';
  const mockSvgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3"><path fill="#00843D" d="M0 0h6v3H0z"/><path fill="#fff" d="M0 1h6v2H0z"/><path d="M0 2h6v1H0z"/><path fill="#C8102E" d="M0 0h1.5v3H0z"/></svg>';
  const mockFiles = [`${mockCountryCode}.svg`];

  beforeEach(() => {
    // Setup fs and path mocks before each test
    (fs.readdirSync as jest.Mock).mockReturnValue(mockFiles);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockSvgContent);
    (path.extname as jest.Mock).mockImplementation((file) => '.svg');
    (path.basename as jest.Mock).mockImplementation((file, ext) => file.replace(ext, ''));
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  it('should return an object with country codes as keys and SVG content as values', async () => {
    const result = await getListOfAllFlags();
    expect(result).toEqual({
      [mockCountryCode]: mockSvgContent,
    });
  });

  it('should handle and throw errors correctly', async () => {
    (fs.readdirSync as jest.Mock).mockImplementation(() => {
      throw new Error('Filesystem error');
    });

    await expect(getListOfAllFlags).rejects.toThrow('Filesystem error');
  });
});

