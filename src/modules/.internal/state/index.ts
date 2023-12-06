import { I18nState } from './types';
import { getDefaultState } from '../utils';

export class I18nStateManager {
  private static instance: I18nStateManager | undefined;
  private state: I18nState;

  private constructor() {
    this.state = getDefaultState();
  }

  public static getInstance(): I18nStateManager {
    if (!I18nStateManager.instance) {
      I18nStateManager.instance = new I18nStateManager();
    }

    return I18nStateManager.instance;
  }

  public static resetInstance(): void {
    I18nStateManager.instance = undefined;
  }

  public getState(): I18nState {
    return { ...this.state };
  }

  public setState(newState: Partial<I18nState>): void {
    this.state = { ...this.state, ...newState };
  }

  public resetState(): void {
    this.state = getDefaultState();
  }
}

export default I18nStateManager.getInstance();
