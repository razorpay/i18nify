import { setState } from '..';
import state from '../../.internal/state';
import { I18nState } from '../../.internal/state/types';

jest.mock('../../../common/errorBoundary', () => ({
  withErrorBoundary: jest.fn((fn) => fn),
}));
jest.mock('../../.internal/state', () => ({
  setState: jest.fn(),
}));

describe('setState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call state.setState with the provided newState', () => {
    const mockNewState: Partial<I18nState> = {
      locale: 'en-US',
      direction: 'ltr',
      country: 'US',
    };

    setState(mockNewState);

    expect(state.setState).toHaveBeenCalledWith(mockNewState);
  });

  it('should not throw an error when called', () => {
    expect(() => setState({})).not.toThrow();
  });
});
