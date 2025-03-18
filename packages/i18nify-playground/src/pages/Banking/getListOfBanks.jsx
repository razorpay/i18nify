import { Box, useToast } from '@razorpay/blade/components';
import { getListOfBanks } from '@razorpay/i18nify-js';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { DEFAULT_COUNTRY_CODE } from 'src/components/Dashboard/constants/common';
import LayoutHeader from 'src/components/Dashboard/LayoutHeader';
import Loader from 'src/components/Dashboard/Loader';
import CodeEditor from 'src/components/Generic/CodeEditor/CodeEditor';
import CountryDropdown from 'src/components/Generic/CountryDropdown';

const GetListOfBanks = () => {
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [code, setCode] = useState('');

  const toast = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (countryCode) => getListOfBanks(countryCode),
    onError: () => {
      toast.show({ content: 'Error fetching banks', color: 'negative' });
    },
    onSuccess: (data) => {
      setCode(JSON.stringify(data, null, 2));
    },
  });

  useEffect(() => {
    mutate(DEFAULT_COUNTRY_CODE);
  }, [countryCode]);

  return (
    <>
      <LayoutHeader title={'getListOfBanks'} description={'getListOfBanks'} />
      <CountryDropdown value={countryCode} onChange={setCountryCode} />
      <Box marginTop="spacing.4" width="100%">
        <CodeEditor code={code} />
      </Box>
      {isPending && <Loader />}
    </>
  );
};

export default GetListOfBanks;
