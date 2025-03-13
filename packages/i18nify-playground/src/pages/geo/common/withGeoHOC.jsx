import { Box, useToast } from '@razorpay/blade/components';
import { getAllCountries } from '@razorpay/i18nify-js';
import React, { useEffect, useState } from 'react';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import CodeEditor from 'src/components/Generic/CodeEditor';
import GenericDropdown from 'src/components/Generic/GenericDropdown';

import { useMutation } from '@tanstack/react-query';
import { I18NIFY_DATA_SUPPORTED_COUNTRIES } from 'src/shared/constants';
import { useMobile } from 'src/hooks/useMobile';

const withGeoHOC = (WrappedComponent, additionalProps) => {
  return (props) => {
    const [code, setCode] = useState('');
    const [countryInp, setCountryInp] = useState('IN');
    const [countryList, setCountryList] = useState([]);
    const [stateInp, setStateInp] = useState('');
    const [stateList, setStateList] = useState([]);

    const toast = useToast();
    const isMobile = useMobile();

    const { mutate, isPending } = useMutation({
      mutationFn: getAllCountries,
      onError: () => {
        toast.show({ content: 'Error', color: 'negative' });
      },
      onSuccess: (data) => {
        const allowedCountries = {};
        for (let key in data) {
          if (I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(key))
            allowedCountries[key] = data[key];
        }
        const countryList = Object.keys(allowedCountries).map((country) => ({
          title: `${country} - ${data[country].country_name}`,
          value: country,
        }));
        setCountryList(countryList);
      },
    });

    useEffect(() => {
      mutate();
    }, []);

    return (
      <>
        <LayoutHeader
          title={additionalProps.title}
          description={additionalProps.description}
        />

        <Box
          display="grid"
          gridTemplateColumns={isMobile ? '1fr' : '1fr 1fr'}
          alignItems="start"
          width="100%"
          columnGap="spacing.6"
        >
          <Box
            display="flex"
            flexDirection="column"
            rowGap="spacing.4"
            width="100%"
          >
            <GenericDropdown
              value={countryInp}
              label="Select Country"
              list={countryList ?? { title: '-', value: '-' }}
              onChange={(country) => setCountryInp(country)}
            />
            <GenericDropdown
              label={additionalProps?.stateDropdownLabel ?? 'List of States'}
              value={stateInp}
              onChange={(state) => setStateInp(state)}
              list={stateList}
            />
            <WrappedComponent
              {...props}
              isLoading={isPending}
              countryInp={countryInp}
              countryList={countryList}
              setCountryInp={setCountryInp}
              stateInp={stateInp}
              setStateInp={setStateInp}
              stateList={stateList}
              code={code}
              setCode={setCode}
              setStateList={setStateList}
            />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="spacing.7"
          >
            <CodeEditor code={code} />
          </Box>
        </Box>
      </>
    );
  };
};

export default withGeoHOC;
