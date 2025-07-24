import { Box, Tooltip } from '@razorpay/blade/components';
import React from 'react';

const IntlOptionWithTooltip = ({ children, optionKey }) => {
  const getTooltipContent = (key) => {
    const tooltips = {
      style:
        'The formatting style to use. Possible values are "decimal" for plain number formatting, "currency" for currency formatting, "percent" for percent formatting, and "unit" for unit formatting.',
      notation:
        'The formatting notation to use. Possible values are "standard", "scientific", "engineering", or "compact".',
      currencyDisplay:
        'How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, "code" to use the ISO currency code, "name" to use a localized currency name such as "dollar", and "narrowSymbol" to use a narrow format symbol ("$100" rather than "US$100").',
      minimumFractionDigits:
        'The minimum number of fraction digits to use. Possible values are from 0 to 20.',
      maximumFractionDigits:
        'The maximum number of fraction digits to use. Possible values are from 0 to 20.',
      trailingZeroDisplay:
        'How to display trailing zeros in fraction digits. Possible values are "auto" to keep trailing zeros as needed, and "stripIfInteger" to remove trailing zeros if the number is an integer.',
      minimumSignificantDigits:
        'The minimum number of significant digits to use. Possible values are from 1 to 21.',
      maximumSignificantDigits:
        'The maximum number of significant digits to use. Possible values are from 1 to 21.',
      useGrouping:
        'Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators.',
      compactDisplay:
        'The compact display to use. Possible values are "short" or "long".',
      minimumExponentDigits:
        'The minimum number of exponent digits to use. Possible values are from 0 to 20.',
      roundingType:
        'The rounding type to use. Possible values are "ceil", "floor", "round", or "trunc".',
      minimumIntegerDigits:
        'The minimum number of integer digits to use. Possible values are from 1 to 21.',
      calendar:
        'The calendar to use. Possible values are "buddhist", "chinese", "coptic", "dangi", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "iso8601", "japanese", "persian", "roc".',
      numberingSystem:
        'The numbering system to use. Possible values are "arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt".',
      hourCycle:
        'The hour cycle to use. Possible values are "h11", "h12", "h23", "h24".',
      weekday:
        'The weekday format to use. Possible values are "long", "short", "narrow".',
      year: 'The year format to use. Possible values are "numeric", "2-digit".',
      month:
        'The month format to use. Possible values are "numeric", "2-digit", "long", "short", "narrow".',
      day: 'The day format to use. Possible values are "numeric", "2-digit".',
      dayPeriod:
        'The day period format to use. Possible values are "narrow", "short", "long".',
      hour: 'The hour format to use. Possible values are "numeric", "2-digit".',
      minute:
        'The minute format to use. Possible values are "numeric", "2-digit".',
      second:
        'The second format to use. Possible values are "numeric", "2-digit".',
      fractionalSecondDigits:
        'The number of fractional second digits to use. Possible values are 1, 2, or 3.',
      timeZoneName:
        'The time zone name format to use. Possible values are "long", "short".',
      dateStyle:
        'The date style to use. Possible values are "full", "long", "medium", "short".',
      timeStyle:
        'The time style to use. Possible values are "full", "long", "medium", "short".',
    };

    return tooltips[key] || 'No documentation available for this option.';
  };

  return (
    <Tooltip content={getTooltipContent(optionKey)}>
      <Box>{children}</Box>
    </Tooltip>
  );
};

export default IntlOptionWithTooltip;
