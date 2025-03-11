import { useToast } from '@razorpay/blade/components';
import { getAllCountries } from '@razorpay/i18nify-js';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import GenericDropdown from 'src/components/Generic/GenericDropdown';

const CountryDropdown = ({ label = 'Select Country', value, onChange }) => {
  const toast = useToast();

  const {
    isPending,
    mutate: getAllCountriesApi,
    data,
  } = useMutation({
    mutationFn: getAllCountries,
    onError: () => {
      toast.show({ content: 'Error fetching countries', color: 'negative' });
    },
  });

  useEffect(() => {
    getAllCountriesApi();
  }, []);

  return (
    <>
      <GenericDropdown
        label={label}
        list={Object.keys(data ?? {})?.map((country) => ({
          title: `${country} - ${data[country].country_name}`,
          value: country,
        }))}
        value={value}
        onChange={onChange}
      />
      {isPending && <Loader />}
    </>
  );
};

export default CountryDropdown;
