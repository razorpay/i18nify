import { supportedLanguages } from './constants';

export const getAllLanguages = () => {
  const allLanguages = new Set();

  for (const languages of Object.values(supportedLanguages)) {
    languages.forEach((language) => allLanguages.add(language));
  }

  return Array.from(allLanguages);
};
