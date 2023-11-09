import { CURRENCIES } from './data/currencies';
import { ByParts } from './types';
import { withErrorBoundary } from '../../common/errorBoundary';
import { getIntlInstanceWithOptions } from '../shared/utils/getIntlInstanceWithOptions';

const formatNumberByParts = (
  amount: string | number,
  options: {
    currency?: keyof typeof CURRENCIES;
    locale?: string;
    intlOptions?: Intl.NumberFormatOptions;
  } = {},
): ByParts => {
  if (!Number(amount) && Number(amount) !== 0)
    throw new Error('Parameter `amount` is not a number!');

  try {
    const formattedAmount = getIntlInstanceWithOptions(options).formatToParts(
      Number(amount),
    );

    const parts = formattedAmount;
    let integerValue = '';
    let decimalValue = '';
    let currencySymbol = '';
    let separator = '';
    let symbolAtFirst = true;
    const partValues = parts.map((p: any) => {
      if (p.type === 'integer' || p.type === 'group') integerValue += p.value;
      else if (p.type === 'fraction') decimalValue += p.value;
      else if (p.type === 'currency') currencySymbol += p.value;
      else if (p.type === 'decimal') separator += p.value;
      return p.value;
    });

    if (currencySymbol.toString() !== partValues[0].toString())
      symbolAtFirst = false;

    return {
      currencySymbol,
      decimalValue,
      integerValue,
      separator,
      symbolAtFirst,
    };
  } catch (error: any) {
    throw new Error(`Something went wrong- ${error.message}`);
  }
};

export default withErrorBoundary<typeof formatNumberByParts>(
  formatNumberByParts,
);
