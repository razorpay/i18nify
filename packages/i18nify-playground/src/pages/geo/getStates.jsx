import { useToast } from '@razorpay/blade/components';
import { getStates } from '@razorpay/i18nify-js/geo';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useEffect } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import withGeoHOC from 'src/pages/Geo/common/withGeoHOC';

function GetStates({
  countryInp,
  setStateInp,
  setStateList,
  setCode,
  isLoading,
}) {
  const toast = useToast();

  const { isPending: isPendingGetStates, mutate: getStatesApi } = useMutation({
    mutationFn: getStates,
    onError: () => {
      toast.show({ content: 'Error fetching states', color: 'negative' });
    },
    onSuccess: (res) => {
      setCode(JSON.stringify(res, null, 2));

      const data = Object.keys(res).map((stateCode) => ({
        title: `${stateCode} - ${res[stateCode].name}`,
        value: stateCode,
      }));
      setStateList(data);
      setStateInp(data[0].value);
    },
  });

  useEffect(() => {
    setStateInp('');
    setStateList([]);

    getStatesApi(countryInp);
  }, [countryInp]);

  return (isLoading || isPendingGetStates) && <Loader />;
}

export default withGeoHOC(GetStates, {
  title: 'getStates',
  description: `🗺️ Your essential utility for retrieving state/province information! 🌍 Features include state data retrieval with locale support and detailed metadata. 🔄 Perfect for apps needing regional information, the function returns a complete list of states/provinces for any supported country. 💫 Includes detailed information like state codes, names, and regional configurations based on international standards. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent state data access across your application.`,
});
