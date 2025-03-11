import { NUMBER_FORMAT_INTL_INPUTS } from 'src/constants/number';
import React from 'react';
import { createContext, useContext, useState } from 'react';

const IntlOptionsContext = createContext({});

const INITIAL_STATE = NUMBER_FORMAT_INTL_INPUTS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultValue || '';
  return acc;
});

export const IntlOptionsProvider = ({ children }) => {
  const [intlOptions, setIntlOptions] = useState(INITIAL_STATE);

  return (
    <IntlOptionsContext.Provider value={{ intlOptions, setIntlOptions }}>
      {children}
    </IntlOptionsContext.Provider>
  );
};

export const useIntlOptionsContext = () => {
  const { intlOptions, setIntlOptions } = useContext(IntlOptionsContext);

  return { intlOptions, setIntlOptions };
};
