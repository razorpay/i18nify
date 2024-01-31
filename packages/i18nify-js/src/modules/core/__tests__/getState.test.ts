import { getState } from '../';
import state from '../../.internal/state';
import { I18nState } from '../../.internal/state/types';

jest.mock('../../../common/errorBoundary', () => ({
  withErrorBoundary: jest.fn((fn) => fn),
}));
jest.mock('../../.internal/state', () => ({
  getState: jest.fn(),
}));

describe('getState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call state.getState', () => {
    getState();

    expect(state.getState).toHaveBeenCalled();
  });

  it('should return the i18n state', () => {
    // Mock the state to be returned by state.getState
    const mockState: I18nState = {
      locale: 'en-US',
      direction: 'ltr',
      country: 'US',
    };

    // Set up the mock implementation for state.getState
    (state.getState as jest.Mock).mockReturnValueOnce(mockState);

    // Call the function and expect it to return the mocked state
    const result = getState();

    expect(result).toEqual(mockState);
  });

  it('should not throw an error when called', () => {
    // Ensure that withErrorBoundary is correctly used and doesn't throw an error
    expect(() => getState()).not.toThrow();
  });
});
