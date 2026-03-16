import {
  getDialCodeByCountryCode,
  isValidPhoneNumber,
} from '@razorpay/i18nify-js/phoneNumber';
import type { CountryCodeType } from '@razorpay/i18nify-js/types';
import type { CommandModule } from '../../types';
import { renderOutput } from '../../output';
import { handleError } from '../../errors';
import phoneFormatterMapper from '../../../../i18nify-js/src/modules/phoneNumber/data/phoneFormatterMapper.json';

const MAX_RETRIES = 5;

function generateLocalNumber(template: string): string {
  let first = true;
  return template.replace(/x/gi, () => {
    if (first) {
      first = false;
      return String(Math.floor(Math.random() * 9) + 1);
    }
    return String(Math.floor(Math.random() * 10));
  });
}

const mod: CommandModule = {
  name: 'gen',
  description: 'Generate a random valid phone number for a country',
  register(parent) {
    parent
      .command('gen <country>')
      .description(this.description)
      .option(
        '--raw',
        'Output without spaces (dial code + digits concatenated)',
      )
      .option('--json', 'Output as JSON string')
      .action((countryArg: string, opts: { raw?: boolean; json?: boolean }) => {
        const country = countryArg.toUpperCase();
        const mapper = phoneFormatterMapper as Record<string, string>;

        if (!(country in mapper)) {
          handleError(
            new Error(`"${country}" is not a supported country code.`),
          );
        }

        const template = mapper[country];
        if (!template) {
          handleError(
            new Error(`No phone number format available for "${country}".`),
          );
        }

        let result: string | null = null;

        try {
          const dialCode = getDialCodeByCountryCode(country as CountryCodeType);

          for (let i = 0; i < MAX_RETRIES; i++) {
            const localNumber = generateLocalNumber(template);
            const candidate = `${dialCode}${localNumber.replace(/\s/g, '')}`;

            if (isValidPhoneNumber(candidate, country as CountryCodeType)) {
              result = opts.raw ? candidate : `${dialCode} ${localNumber}`;
              break;
            }
          }
        } catch (err) {
          handleError(err);
        }

        if (!result) {
          handleError(
            new Error(
              `Could not generate a valid phone number for "${country}". Try again.`,
            ),
          );
        }

        renderOutput(result, opts.json);
      });
  },
};

export default mod;
