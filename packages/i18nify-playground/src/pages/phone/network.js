import { I18NIFY_DATA_SOURCE } from 'src/shared/constants';

export const getDialCodeCountryMap = async () => {
  const response = await fetch(
    `${I18NIFY_DATA_SOURCE}/phone-number/dial-code-to-country/data.json`,
  );
  const data = await response.json();
  return data;
};
