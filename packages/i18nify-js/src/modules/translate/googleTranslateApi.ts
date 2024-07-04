import { Translate } from '@google-cloud/translate/build/src/v2';

// Creates a client
const translate = new Translate({
  keyFilename:
    '/Users/divyansh.singh/Desktop/Razorpay/i18n/i18nify/packages/i18nify-js/src/modules/translate/HACKON.json',
});

export async function translateText(text: string, target: string) {
  try {
    console.error(
      `🚀 ~ Translation of '${text}' initiated for '${target}' locale.`,
    );
    let [translation] = await translate.translate(text, target);

    return translation;
  } catch (err) {
    console.error('Error in Google Translate API:', err);
    throw new Error('Translation API failed');
  }
}
