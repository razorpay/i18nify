// Mock the loadPolyfills function
jest.mock('../modules/.internal/polyfills/index', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

const loadPolyfills = require('../modules/.internal/polyfills/index').default;

describe('Entry File - index.js', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock state before each test
  });

  it('should load polyfills successfully', async () => {
    const consoleInfoMock = jest.spyOn(console, 'info').mockImplementation();

    // Trigger the function that triggers loading polyfills
    await require('../index');

    // Assertions
    expect(loadPolyfills).toHaveBeenCalledTimes(1);
    expect(consoleInfoMock).toHaveBeenCalledWith(
      'i18nify polyfills loaded successfully !',
    );
  });
});
