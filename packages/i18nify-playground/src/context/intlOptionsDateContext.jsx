import { DATE_FORMAT_INTL_INPUTS } from 'src/constants/date';

import React from 'react';
import { createContext, useContext, useState } from 'react';

const IntlOptionsDateContext = createContext({});

const INITIAL_STATE = DATE_FORMAT_INTL_INPUTS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultValue || '';
  return acc;
});

export const IntlOptionsDateProvider = ({ children }) => {
  const [intlOptions, setIntlOptions] = useState(INITIAL_STATE);

  return (
    <IntlOptionsDateContext.Provider value={{ intlOptions, setIntlOptions }}>
      {children}
    </IntlOptionsDateContext.Provider>
  );
};

export const useIntlOptionsDateContext = () => {
  const { intlOptions: intlDateOptions, setIntlOptions: setIntlDateOptions } =
    useContext(IntlOptionsDateContext);

  return { intlDateOptions, setIntlDateOptions };
};
