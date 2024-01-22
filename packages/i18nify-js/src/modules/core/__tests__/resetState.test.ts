import { resetState } from '..';
import state from '../../.internal/state';

jest.mock('../../../common/errorBoundary', () => ({
  withErrorBoundary: jest.fn((fn) => fn),
}));
jest.mock('../../.internal/state', () => ({
  resetState: jest.fn(),
}));

describe('resetState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call state.resetState with the provided newState', () => {
    resetState();

    expect(state.resetState).toHaveBeenCalled();
  });

  it('should not throw an error when called', () => {
    expect(() => resetState()).not.toThrow();
  });
});
