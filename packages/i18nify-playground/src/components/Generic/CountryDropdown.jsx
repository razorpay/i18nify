import { useToast } from '@razorpay/blade/components';
import { getAllCountries } from '@razorpay/i18nify-js';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import { I18NIFY_DATA_SUPPORTED_COUNTRIES } from 'src/shared/constants';

const CountryDropdown = ({
  label = 'Select Country',
  value,
  onChange,
  showAllowedCountries = false,
}) => {
  const toast = useToast();
  const [countryList, setCountryList] = useState([]);
  const {
    isPending,
    mutate: getAllCountriesApi,
    data,
  } = useMutation({
    mutationFn: getAllCountries,
    onError: () => {
      toast.show({ content: 'Error fetching countries', color: 'negative' });
    },
    onSuccess: (data) => {
      if (showAllowedCountries) {
        const allowedCountries = {};
        for (let key in data) {
          if (I18NIFY_DATA_SUPPORTED_COUNTRIES.includes(key))
            allowedCountries[key] = data[key];
        }

        setCountryList(allowedCountries);
      } else {
        setCountryList(data);
      }
    },
  });

  useEffect(() => {
    getAllCountriesApi();
  }, []);

  return (
    <>
      <GenericDropdown
        label={label}
        list={Object.keys(countryList ?? {})?.map((country) => ({
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
