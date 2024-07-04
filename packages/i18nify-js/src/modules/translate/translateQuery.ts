import fs from 'fs';
import path from 'path';
import { translateText } from './googleTranslateApi';
import { getAllLanguages } from './utils';
import { coveredTexts } from './i18n_bundles/text';
import { LANGUAGE_TO_LOCALE_MAP } from './constants';

const i18nBundlesPath = path.join(__dirname, 'i18n_bundles/translations');

const loadTranslations = (locale: string): Record<string, string> => {
  const filePath = path.join(i18nBundlesPath, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return {};
};

const saveTranslations = (
  locale: string,
  translations: Record<string, string>,
) => {
  const filePath = path.join(i18nBundlesPath, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf-8');
};

async function translateTextIfNeeded(text: string) {
  const supportedLanguages = getAllLanguages();
  for (const language of supportedLanguages) {
    const locale = LANGUAGE_TO_LOCALE_MAP[language as string];
    if (!locale) continue; // Skip unsupported languages

    let translations = loadTranslations(locale);
    if (!translations[text]) {
      const translatedText = await translateText(text, locale);
      translations[text] = translatedText;
      saveTranslations(locale, translations);
    }
  }
}

async function processTranslations() {
  for (const text of coveredTexts) {
    await translateTextIfNeeded(text);
  }
}

processTranslations()
  .then(() => {
    console.log('Translation process completed');
  })
  .catch((error) => {
    console.error('Error in translation process:', error);
  });
