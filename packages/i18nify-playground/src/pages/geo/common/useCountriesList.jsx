import { useToast } from '@razorpay/blade/components';
import { getAllCountries } from '@razorpay/i18nify-js';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useCountriesList = () => {
  const [countryList, setCountryList] = useState([]);
  const [code, setCode] = useState('');
  const [countryInp, setCountryInp] = useState('');

  const toast = useToast();

  const { isPending, mutate } = useMutation({
    mutationFn: getAllCountries,
    onError: () => {
      toast.show({ content: 'Error fetching countries', color: 'negative' });
    },
    onSuccess: (data) => {
      const countryList = Object.keys(data)?.map((country) => ({
        title: `${country} - ${data[country].country_name}`,
        value: country,
      }));
      setCountryList(countryList);
      setCode(JSON.stringify(data, null, 2));
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  return {
    isPending,
    countryList,
    code,
    setCountryList,
    setCode,
    setCountryInp,
    countryInp,
  };
};

export default useCountriesList;
