import { getDialCodeByCountryCode } from '@razorpay/i18nify-js/phoneNumber';
import type { CountryCodeType } from '@razorpay/i18nify-js/types';
import type { CommandModule } from '../../types';
import { renderOutput } from '../../output';
import { handleError } from '../../errors';
import phoneFormatterMapper from '../../../../i18nify-js/src/modules/phoneNumber/data/phoneFormatterMapper.json';

const mod: CommandModule = {
  name: 'dial',
  description: 'Get the international dial code for a country',
  register(parent) {
    parent
      .command('dial <country>')
      .description(this.description)
      .option('--json', 'Output as JSON string')
      .action((countryArg: string, opts: { json?: boolean }) => {
        const country = countryArg.toUpperCase();

        if (!(country in phoneFormatterMapper)) {
          handleError(
            new Error(`"${country}" is not a supported country code.`),
          );
        }

        try {
          renderOutput(
            getDialCodeByCountryCode(country as CountryCodeType),
            opts.json,
          );
        } catch (err) {
          handleError(err);
        }
      });
  },
};

export default mod;
