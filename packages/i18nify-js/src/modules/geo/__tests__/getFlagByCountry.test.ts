import * as fs from 'fs';
import getFlagByCountry from '../getFlagByCountry';

jest.mock('fs');

describe('geo - getFlagByCountry', () => {
  const mockCountryCode = 'AE';
  const mockSvgContent =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3"><path fill="#00843D" d="M0 0h6v3H0z"/><path fill="#fff" d="M0 1h6v2H0z"/><path d="M0 2h6v1H0z"/><path fill="#C8102E" d="M0 0h1.5v3H0z"/></svg>';
  const filePath = `packages/i18nify-js/src/modules/geo/data/countryFlagSvgs/${mockCountryCode}.svg`;

  beforeEach(() => {
    // Clear all previous settings before each test
    jest.clearAllMocks();
  });

  it('should return the SVG content for a given country code', async () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(mockSvgContent);

    const svgContent = await getFlagByCountry(mockCountryCode);
    expect(svgContent).toEqual(mockSvgContent);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
  });

  it('should throw an error if the SVG file does not exist', async () => {
    const mockError = new Error('File not found');
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await expect(getFlagByCountry(mockCountryCode)).rejects.toThrow(mockError);
    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
  });
});
