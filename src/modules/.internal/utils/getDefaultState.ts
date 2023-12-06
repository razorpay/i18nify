import type { I18nState } from '../state/types';

export function getDefaultState(): I18nState {
  return {
    locale: '',
    direction: '',
    country: '',
  };
}
