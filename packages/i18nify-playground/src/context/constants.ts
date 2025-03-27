export enum LANGUAGES {
  JS = 'JS',
  GO = 'GO',
  PHP = 'PHP',
}

export const LANGUAGE_MAPPING = {
  [LANGUAGES.JS]: { version: 'v1.12.5', isApisAvailable: true },
  [LANGUAGES.GO]: { version: '', isApisAvailable: false },
  [LANGUAGES.PHP]: { version: '', isApisAvailable: false },
};
