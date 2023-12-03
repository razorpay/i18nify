import { I18nStateManager } from '../';
import { getDefaultState } from '../../utils';
import { I18nState } from '../types';

describe('I18nStateManager', () => {
  beforeEach(() => {
    I18nStateManager.resetInstance();
  });

  it('should return the same instance when calling getInstance', () => {
    const instance1 = I18nStateManager.getInstance();
    const instance2 = I18nStateManager.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should have default state when getting the state', () => {
    const instance = I18nStateManager.getInstance();
    const defaultState = getDefaultState();

    expect(instance.getState()).toEqual(defaultState);
  });

  it('should update the state when calling setState', () => {
    const instance = I18nStateManager.getInstance();
    const newState = {
      locale: 'en-US',
      direction: 'ltr',
      country: 'US',
    };

    instance.setState(newState as I18nState);

    expect(instance.getState()).toEqual(newState);
  });

  it('should reset the state when calling resetState', () => {
    const instance = I18nStateManager.getInstance();
    const newState = {
      locale: 'en-US',
      direction: 'ltr',
      country: 'US',
    };

    instance.setState(newState);
    instance.resetState();

    const defaultState = getDefaultState();
    expect(instance.getState()).toEqual(defaultState);
  });

  it('should create a new instance after resetting', () => {
    const instance1 = I18nStateManager.getInstance();
    I18nStateManager.resetInstance();
    const instance2 = I18nStateManager.getInstance();

    expect(instance1).not.toBe(instance2);
  });
});
